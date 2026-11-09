import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { verifySvix } from "@/lib/svix";

const UserCreated = z.object({
  type: z.literal("user.created"),
  data: z.object({
    email_addresses: z.array(z.object({ email_address: z.string().email().max(254) })).max(10),
  }),
});

/**
 * Clerk's `user.created` (docs/LAUNCH.md): someone who was on the waitlist and signs up with the
 * same email is marked `converted`. Signed with Svix (CLERK_WEBHOOK_SECRET of this endpoint,
 * which is its own endpoint in Clerk, next to the app's). Anything else is acknowledged and ignored.
 */
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!secret || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const body = await req.text();
  if (body.length > 64 * 1024) return NextResponse.json({ ok: false }, { status: 413 });
  const signed = verifySvix(
    secret,
    {
      id: req.headers.get("svix-id"),
      timestamp: req.headers.get("svix-timestamp"),
      signature: req.headers.get("svix-signature"),
    },
    body,
  );
  if (!signed) return NextResponse.json({ ok: false }, { status: 401 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const event = UserCreated.safeParse(parsed);
  if (!event.success) return NextResponse.json({ ok: true, ignored: true });

  const emails = event.data.data.email_addresses.map((e) => e.email_address.trim().toLowerCase());
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { error } = await supabase
    .from("waitlist")
    .update({ status: "converted", converted_at: new Date().toISOString() })
    .in("email", emails);
  if (error) {
    console.error("waitlist convert", error.code);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
