import { createHmac, timingSafeEqual } from "node:crypto";

/** How far a webhook's timestamp may be from now (older replays are refused). */
const TOLERANCE_S = 5 * 60;

/**
 * Checks a Svix-signed webhook (how Clerk signs them): HMAC-SHA256 over "id.timestamp.body"
 * with the endpoint's secret ("whsec_…"), compared in constant time. False for anything off.
 * (The same check as the app's frontend/src/server/svix.ts.)
 */
export function verifySvix(
  secret: string,
  headers: { id: string | null; timestamp: string | null; signature: string | null },
  body: string,
  now = Date.now(),
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature || !secret.startsWith("whsec_")) return false;
  const seconds = Number(timestamp);
  if (!Number.isInteger(seconds) || Math.abs(now / 1000 - seconds) > TOLERANCE_S) return false;
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
