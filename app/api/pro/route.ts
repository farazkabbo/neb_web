import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { launchMode } from "@/lib/launch";
import { clientIp, formLimitByIp, overLimit } from "@/lib/limits";

/**
 * The Pro fake-door test (docs/PRO_TEST.md). "click" counts a press of "upgrade to pro" with no
 * personal data; "join" puts an email on Pro early access (at no charge). Nothing is ever charged.
 */
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("click") }),
  z.object({
    action: z.literal("join"),
    email: z.string().trim().toLowerCase().email().max(254),
    company: z.string().optional(), // honeypot
  }),
]);

export const preferredRegion = "fra1";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("That email doesn't look right.", 400);
  const body = parsed.data;
  const ip = clientIp(req);

  // Clicks get their own small limit so they never use up the waitlist form's 5 an hour.
  const limited =
    body.action === "click" ? await overLimit(`pro-click:ip:${ip}`, 10, 60 * 60 * 1000) : await formLimitByIp(ip);
  if (limited) return fail("Too many tries. Give it a few minutes.", 429);
  if (body.action === "join" && body.company) return NextResponse.json({ ok: true }, { status: 201 });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return fail("Early access isn't plugged in yet.", 500);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const table = supabase.from("pro_interest");
  const { error } =
    body.action === "click"
      ? await table.insert({ kind: "click", mode: launchMode() })
      : await table.upsert(
          { kind: "join", mode: launchMode(), email: body.email },
          { onConflict: "email", ignoreDuplicates: true },
        );
  if (error) {
    console.error("supabase pro_interest", error);
    return fail("Something broke. Try again?", 500);
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
