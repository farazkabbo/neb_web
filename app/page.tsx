import Script from "next/script";

import { homeFor, launchMode } from "@/lib/launch";

import { HOME_HTML } from "./home-markup";

// LAUNCH_MODE is read when the page is served, so flipping it needs no rebuild.
export const dynamic = "force-dynamic";

export default function Home() {
  const launch = process.env.NEXT_PUBLIC_LAUNCH_VIDEO_URL ?? "";
  const mode = launchMode();
  return (
    <>
      <div
        id="neb-root"
        data-launch={launch}
        data-mode={mode}
        dangerouslySetInnerHTML={{ __html: homeFor(mode, HOME_HTML) }}
      />
      <Script src="/neb-home.js" strategy="afterInteractive" />
    </>
  );
}
