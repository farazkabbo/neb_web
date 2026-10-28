import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "neb",
  description: "Don't just get the answer. Learn it. A tutor that lives in your notebook.",
  openGraph: {
    title: "neb",
    description: "Don't just get the answer. Learn it.",
    images: ["/media/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E1A24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Instrument+Serif&family=Inter:wght@400;500;600&family=Pixelify+Sans:wght@400;500;600&family=VT323&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
