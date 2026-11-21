import { existsSync } from "node:fs";
import path from "node:path";

import Script from "next/script";

import { launchMode, showPro } from "@/lib/launch";

import { DEMO_WINDOW, FILM_WINDOW, HOME_HTML, PRO_WINDOW } from "./home-markup";

// Read per request: LAUNCH_MODE and BILLING_ENABLED change without a rebuild.
export const dynamic = "force-dynamic";

const hasFilm = () => existsSync(path.join(process.cwd(), "public", "media", "hero-loop.mp4"));

export default function Home() {
  const html = HOME_HTML.replace("<!--HERO_MEDIA-->", hasFilm() ? FILM_WINDOW : DEMO_WINDOW).replace(
    "<!--PRO-->",
    showPro() ? PRO_WINDOW : "",
  );
  return (
    <>
      <div id="neb-root" data-mode={launchMode()} dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/neb-home.js" strategy="afterInteractive" />
    </>
  );
}
