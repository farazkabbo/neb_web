// Turns raw Higgsfield images (assets-in/higgsfield/raw) into site assets in public/media.
import sharp from "sharp";
const R = "assets-in/higgsfield/raw", O = "public/media";
await sharp(`${R}/wallpaper.png`).resize(1920).webp({ quality: 72 }).toFile(`${O}/wallpaper.webp`);
for (const n of ["notebook", "film", "letter", "lock", "help", "bin"])
  await sharp(`${R}/icon-${n}.png`).trim().resize(64, 64, { kernel: "nearest", fit: "contain", background: "#0000" }).png().toFile(`${O}/icon-${n}.png`);
await sharp(`${R}/og.png`).resize(1200, 630, { fit: "cover" }).png().toFile("app/opengraph-image.png");
