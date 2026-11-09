/**
 * Launch day (docs/LAUNCH.md): `LAUNCH_MODE=waitlist` (the default) is today's page, unchanged.
 * `LAUNCH_MODE=open` turns every way to join the waitlist into "Get neb": the public /download
 * page, with no account needed (people sign up the first time they open the app). Flipping it is
 * the only change on the day.
 */

export type LaunchMode = "waitlist" | "open";

export function launchMode(): LaunchMode {
  return process.env.LAUNCH_MODE === "open" ? "open" : "waitlist";
}

/** Where "Get neb" goes: the public download page (no account needed; sign-up is in the app). */
export function getNebUrl(): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://myneb.si").replace(/\/$/, "");
  return `${site}/download`;
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * The home page for open mode. The waitlist forms stay in the page, hidden (the page's script
 * looks them up by id), with "Get neb" beside them; every "join the waitlist" button becomes a
 * link to /download. Waitlist mode returns the page as it is.
 */
export function homeFor(mode: LaunchMode, html: string, url = getNebUrl()): string {
  if (mode === "waitlist") return html;
  const href = escape(url);
  return html
    .replace(
      /(<form class="wl" id="f-hero"[^>]*)>/,
      `$1 hidden>`,
    )
    .replace(
      /(<form class="wl" id="f-hero"[\s\S]*?<\/form>)/,
      `$1<a class="btn go getneb" href="${href}">Get neb</a>`,
    )
    .replace(
      /<button ([^>]*?)data-go="#setup"([^>]*)>[^<]*<\/button>/g,
      `<a $1$2 href="${href}">get neb</a>`,
    )
    .replace(
      "coming soon. join the waitlist and you'll see it first.",
      "it's here. get neb and ask your first question.",
    );
}
