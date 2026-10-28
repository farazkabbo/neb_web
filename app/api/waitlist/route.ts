import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { confirmationEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  role: z.enum(["Student", "Teacher", "Parent", "Other", ""]).optional(),
  source: z.string().trim().max(64).optional(),
  company: z.string().optional(), // honeypot
});

// Run next to the Supabase database (Central EU, Frankfurt): a central point for a worldwide audience.
export const preferredRegion = "fra1";

const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const ok = () => NextResponse.json({ ok: true }, { status: 201 });
const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return fail("Too many tries. Give it a few minutes.", 429);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("That email doesn't look right.", 400);
  const { email, role, source, company } = parsed.data;
  if (company) return ok();

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !RESEND_FROM) {
    return fail("The waitlist isn't plugged in yet.", 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("waitlist")
    .upsert({ email, role: role || null, source: source || "direct" }, { onConflict: "email", ignoreDuplicates: true })
    .select("id");
  if (error) {
    console.error("supabase", error);
    return fail("Something broke. Try again?", 500);
  }
  if (!data?.length) return NextResponse.json({ ok: true, duplicate: true }, { status: 409 }); // already on the list

  const resend = new Resend(RESEND_API_KEY);
  // Newer Resend accounts have one account-wide audience (no ID); older ones use a per-audience ID.
  const contact = await fetch(RESEND_AUDIENCE_ID ? `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts` : "https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, unsubscribed: false }),
  }).catch((e) => e);
  if (!(contact instanceof Response) || !contact.ok) console.error("resend contact", contact instanceof Response ? await contact.text() : contact);

  const mail = confirmationEmail(process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin, source === "send-to-me");
  const sent = await resend.emails.send({ from: RESEND_FROM, to: email, ...mail, replyTo: process.env.RESEND_REPLY_TO || undefined });
  if (sent.error) console.error("resend email", sent.error);

  return ok();
}
