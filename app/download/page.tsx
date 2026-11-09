import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "get neb", description: "Download neb for Windows." };

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

export default async function Download() {
  const release = await latest();
  return (
    <main className="legal">
      <a href="/" className="legal-back">← myneb.si</a>
      <h1>Get neb</h1>
      {release?.installer ? (
        <>
          <p>
            <a className="btn go" href={release.installer}>
              Download for Windows
            </a>{" "}
            <span className="legal-meta">version {release.version} · Windows 10 (2004) or 11</span>
          </p>
          <ol>
            <li>Run the installer.</li>
            <li>Open neb and click <b>Sign in</b>. Your browser opens; you&apos;re already signed in, so click once and you&apos;re connected.</li>
            <li>Circle anything on your screen, hold <b>Ctrl + Alt</b>, and ask.</li>
          </ol>
          <p className="legal-meta">You get 8 free questions to start. Your notebook, Replay and PDFs are always free.</p>
        </>
      ) : (
        <p>The installer is on its way. We&apos;ll email you the moment it&apos;s ready.</p>
      )}
      <p className="legal-meta">On a Mac? neb for macOS is coming. You&apos;re on the list.</p>
    </main>
  );
}
