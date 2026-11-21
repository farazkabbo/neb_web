import { existsSync } from "node:fs";
import path from "node:path";

import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "neb — your cursor, but it understands",
  description:
    "circle anything on your screen and ask out loud. neb explains it, shows you the way, and catches mistakes before you make them. join the waitlist.",
  openGraph: {
    title: "neb — your cursor, but it understands",
    description: "does the busywork. teaches you the rest. catches you before you slip.",
    images: ["/media/og.png"],
    // The film, once scripts/encode-ad.sh has made it.
    ...(existsSync(path.join(process.cwd(), "public", "media", "neb-ad-720.mp4"))
      ? { videos: [{ url: "/media/neb-ad-720.mp4", type: "video/mp4", width: 1280, height: 720 }] }
      : {}),
  },
};

// Self-hosted at build time (no render-blocking request to Google; the hero text paints sooner).
const disp = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-disp" });
const body = Inter({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-body" });
const ui = Pixelify_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-ui" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E1A24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[disp, body, ui].map((f) => f.variable).join(" ")}>
      <body>{children}</body>
    </html>
  );
}
