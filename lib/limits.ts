/**
 * Spam limits for this site's forms (docs/LAUNCH.md): counted in Upstash Redis when it's set up
 * (shared by every server instance), else in this instance's memory. Fixed windows: simple, and
 * enough for forms.
 */

const hits = new Map<string, { count: number; until: number }>();

function countHere(key: string, windowMs: number): number {
  const now = Date.now();
  const kept = hits.get(key);
  const next = kept && kept.until > now ? { count: kept.count + 1, until: kept.until } : { count: 1, until: now + windowMs };
  hits.set(key, next);
  if (hits.size > 50_000) hits.delete(hits.keys().next().value ?? "");
  return next.count;
}

/** Adds one to `key` in a window of `windowMs`; true once the window holds more than `limit`. */
export async function overLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowed = `${key}:${Math.floor(Date.now() / windowMs)}`;
  if (!url || !token) return countHere(windowed, windowMs) > limit;
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", windowed], ["EXPIRE", windowed, String(Math.ceil(windowMs / 1000))]]),
      cache: "no-store",
    });
    const [incr] = (await response.json()) as [{ result?: number }];
    return typeof incr?.result === "number" ? incr.result > limit : countHere(windowed, windowMs) > limit;
  } catch {
    return countHere(windowed, windowMs) > limit;
  }
}

const HOUR = 60 * 60 * 1000;

/** The waitlist form's limit, shared with "Email me the link": 5 an hour from one address. */
export const formLimitByIp = (ip: string) => overLimit(`form:ip:${ip}`, 5, HOUR);

/** At most 3 download-link emails a day to one address. */
export const linkLimitByEmail = (email: string) => overLimit(`link:email:${email}`, 3, 24 * HOUR);

/** The caller's address (Vercel puts the client first in x-forwarded-for). */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
