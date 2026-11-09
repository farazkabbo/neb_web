import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import { headers } from "next/headers";

import { EmailMeTheLink } from "./EmailMeTheLink";

export const metadata: Metadata = { title: "get neb", description: "Download neb for Windows. No account needed." };

// The installer is published with each release (public/desktop/latest.json): read it per request.
export const dynamic = "force-dynamic";

type Release = { version: string; installer: string | null };

/**
 * Where "Get neb" lands after signing up (docs/LAUNCH.md): the Windows installer named by the
 * same latest.json the app updates from. Only https installers on our own site are offered.
 */
async function latest(): Promise<Release | null> {
  try {
    const file = path.join(process.cwd(), "public", "desktop", "latest.json");
    const json = JSON.parse(await readFile(file, "utf8")) as {
      version?: unknown;
      platforms?: Record<string, { url?: unknown }>;
    };
    const url = json.platforms?.["windows-x86_64"]?.url;
    const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://myneb.si");
    const ours =
      typeof url === "string" && new URL(url).protocol === "https:" && new URL(url).host === site.host;
    return { version: String(json.version ?? ""), installer: ours ? url : null };
  } catch {
    return null;
  }
}

type Os = "windows" | "mac" | "other";

/** The visitor's computer, from their browser (good enough to pick an installer). */
function osOf(userAgent: string): Os {
  if (/Windows NT/i.test(userAgent)) return "windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "mac";
  return "other";
}

export default async function Download() {
  const [release, ua] = await Promise.all([latest(), headers().then((h) => h.get("user-agent") ?? "")]);
  const os = osOf(ua);
  const app = (process.env.NEXT_PUBLIC_APP_URL || "https://app.myneb.si").replace(/\/$/, "");
  return (
    <main className="legal">
      <a href="/" className="legal-back">← myneb.si</a>
      <h1>Get neb</h1>
      {os !== "windows" ? (
        <>
          <p>neb is Windows-only for now. Mac is coming soon.</p>
          <EmailMeTheLink source="download_mac" label="Email me when it's ready, or send the link to my Windows PC" />
        </>
      ) : release?.installer ? (
        <>
          <p>
            <a className="btn go" href={release.installer}>
              Download for Windows
            </a>{" "}
            <span className="legal-meta">version {release.version} · Windows 10 (2004) or 11 · no account needed</span>
          </p>
          <ol>
            <li>Run the installer.</li>
            <li>Open neb and click <b>Sign in</b>. Your browser opens to make your account (about 10 seconds).</li>
            <li>Circle anything on your screen, hold <b>Ctrl + Alt</b>, and ask.</li>
          </ol>
          <p className="legal-meta">You get 8 free questions to start. Your notebook, Replay and PDFs are always free.</p>
          <EmailMeTheLink source="download" label="Downloading on another computer? Email me the link" />
        </>
      ) : (
        <>
          <p>The installer is on its way.</p>
          <EmailMeTheLink source="download" label="Email me the link when it's ready" />
        </>
      )}
      <p className="legal-meta">
        Already have an account? <a href={`${app}/sign-in`}>Sign in</a>
      </p>
    </main>
  );
}
