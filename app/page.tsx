import { existsSync } from "node:fs";
import path from "node:path";

import { headers } from "next/headers";
import Script from "next/script";

import { launchMode, showPro } from "@/lib/launch";

import { homeHtml, osOf } from "./home-markup";

// Read per request: LAUNCH_MODE, BILLING_ENABLED and the visitor's OS.
export const dynamic = "force-dynamic";

/** The film window shows once scripts/encode-ad.sh has run (NEB_FORCE_FILM=1 for the tests). */
const media = (file: string) => existsSync(path.join(process.cwd(), "public", "media", file));
const hasFilm = () => process.env.NEB_FORCE_FILM === "1" || media("hero-loop.mp4");
const hasCaptions = () => process.env.NEB_FORCE_FILM === "1" || media("neb-ad.en.vtt");

export default async function Home() {
  const mode = launchMode();
  const os = osOf((await headers()).get("user-agent") ?? "");
  const html = homeHtml({ mode, os, film: hasFilm(), captions: hasCaptions(), pro: showPro() });
  return (
    <>
      <div id="neb-root" data-mode={mode} dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/neb-home.js" strategy="afterInteractive" />
    </>
  );
}
