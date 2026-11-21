import { existsSync } from "node:fs";
import path from "node:path";

import Script from "next/script";

import { DEMO_WINDOW, FILM_WINDOW, HOME_HTML } from "./home-markup";

// Waitlist only until the installer ships (LAUNCH_MODE no longer changes this page).
// The film window shows up once scripts/encode-ad.sh has written public/media/hero-loop.mp4.
const hasFilm = existsSync(path.join(process.cwd(), "public", "media", "hero-loop.mp4"));
const html = HOME_HTML.replace("<!--HERO_MEDIA-->", hasFilm ? FILM_WINDOW : DEMO_WINDOW);

export default function Home() {
  return (
    <>
      <div id="neb-root" dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/neb-home.js" strategy="afterInteractive" />
    </>
  );
}
