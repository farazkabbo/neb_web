import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import { downloadLinkEmail } from "@/lib/email";
import { clientIp, formLimitByIp, linkLimitByEmail } from "@/lib/limits";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.enum(["download", "download_mac"]),
  company: z.string().optional(), // honeypot
});

export const preferredRegion = "fra1";

/** How long one try at Resend may take; one retry after a failure. */
const SEND_TIMEOUT_MS = 8000;

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

async function sendOnce(resend: Resend, message: Parameters<Resend["emails"]["send"]>[0]) {
  const timeout = new Promise<{ error: Error }>((resolve) =>
    setTimeout(() => resolve({ error: new Error("timed out") }), SEND_TIMEOUT_MS),
  );
  return Promise.race([resend.emails.send(message).catch((error) => ({ error })), timeout]);
}

/**
 * "Email me the link" on /download (docs/LAUNCH.md), apart from the waitlist form: the address is
 * kept on the waitlist (source `download`, or `download_mac` when neb can't run there yet), and
 * the download-link email is sent every time, even to someone already on the list. Limited like
 * the waitlist form (5 an hour from one address) and to 3 emails a day per address. Sent inline,
 * with a timeout and one retry.
 */
export async function POST(req: Request) {
  if (await formLimitByIp(clientIp(req))) return fail("Too many tries. Give it a few minutes.", 429);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("That email doesn't look right.", 400);
  const { email, source, company } = parsed.data;
  if (company) return NextResponse.json({ ok: true }, { status: 201 });
  if (await linkLimitByEmail(email)) return fail("We've sent that a few times today. Check your inbox.", 429);

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !RESEND_FROM) {
    return fail("Email isn't plugged in yet.", 500);
  }

  // Kept on the list (an earlier signup stays as it was).
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { error } = await supabase
    .from("waitlist")
    .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
  if (error) console.error("download-link waitlist", error.code);

  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const mail = downloadLinkEmail(site, source === "download_mac");
  const message = { from: RESEND_FROM, to: email, ...mail, replyTo: process.env.RESEND_REPLY_TO || undefined };
  const resend = new Resend(RESEND_API_KEY);
  let sent = await sendOnce(resend, message);
  if (sent.error) sent = await sendOnce(resend, message);
  if (sent.error) {
    console.error("download-link email failed");
    return fail("We couldn't send that just now. Try again in a minute.", 502);
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
