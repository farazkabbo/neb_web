import Script from "next/script";
import { HOME_HTML } from "./home-markup";

export default function Home() {
  const launch = process.env.NEXT_PUBLIC_LAUNCH_VIDEO_URL ?? "";
  return (
    <>
      <div id="neb-root" data-launch={launch} dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
      <Script src="/neb-home.js" strategy="afterInteractive" />
    </>
  );
}
