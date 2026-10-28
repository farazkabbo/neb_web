#!/usr/bin/env bash
# Prepares all site media into public/media (and brand files into public/brand). Requires ffmpeg + curl.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=assets-in; HF=$IN/higgsfield; OUT=public/media
mkdir -p "$HF" "$OUT" public/brand
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }

# Brand assets
[ -f "$IN/neb-logo/neb-hero-lockup.svg" ] && cp "$IN/neb-logo/neb-hero-lockup.svg" public/brand/
[ -f "$IN/neb-logo/neb-app-icon.svg" ] && cp "$IN/neb-logo/neb-app-icon.svg" public/brand/ && cp "$IN/neb-logo/neb-app-icon.svg" app/icon.svg
[ -f "$IN/neb-logo/neb-app-icon-rounded.png" ] && cp "$IN/neb-logo/neb-app-icon-rounded.png" app/apple-icon.png
[ -f "$IN/founder.jpg" ] && cp "$IN/founder.jpg" public/brand/founder.jpg

# Download Higgsfield videos once (never hotlinked)
BASE=https://d2ol7oe51mr4n9.cloudfront.net/user_3LAR5U9JbfDECsfzEqsTMKuDAAI
declare -A VIDS=(
  [teaser-16x9]=a52496f4-111b-4edf-93f1-4872e4ab2180
  [teaser-9x16]=c9955ca3-0b34-419b-9438-99bc36a112aa
  [nudge-9x16]=b2ce0c99-ca51-4fd0-9052-56c00e0619b3
  [different-4k]=68c6cda0-f6f6-42c2-9619-9b8279844bd8
)
for n in "${!VIDS[@]}"; do
  [ -s "$HF/$n.mp4" ] || curl -fL --retry 3 -o "$HF/$n.mp4" "$BASE/${VIDS[$n]}.mp4"
done

FF="ffmpeg -y -hide_banner -loglevel error"
FIT="scale=w='min(iw,1920)':h='min(ih,1920)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"

web() { # src name
  $FF -i "$1" -vf "$FIT" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/$2.mp4"
  $FF -i "$1" -vf "$FIT" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -c:a libopus -b:a 96k "$OUT/$2.webm"
  $FF -ss 2 -i "$OUT/$2.mp4" -frames:v 1 -q:v 3 "$OUT/$2.jpg"
}

clip() { # name start end — muted loop, <= 2 Mbps
  local src="$IN/neb-the-nudge-real.mp4" s=$2 d
  d=$(awk "BEGIN{print $3-$2}")
  local V="scale=w='min(iw,1080)':h='min(ih,1080)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"
  $FF -ss "$s" -t "$d" -i "$src" -an -vf "$V" -c:v libx264 -crf 26 -maxrate 2M -bufsize 2M -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$1.mp4"
  $FF -ss "$s" -t "$d" -i "$src" -an -vf "$V" -c:v libvpx-vp9 -b:v 1.2M -maxrate 2M -row-mt 1 "$OUT/$1.webm"
  $FF -ss "$(awk "BEGIN{t=$d<2?$d/2:2; print t}")" -i "$OUT/$1.mp4" -frames:v 1 -q:v 3 "$OUT/$1.jpg"
}

for n in "${!VIDS[@]}"; do echo "web: $n"; web "$HF/$n.mp4" "$n"; done

if [ -f "$IN/neb-the-nudge-real.mp4" ]; then
  echo "clips"
  clip clip-notice 6.5 10.0
  clip clip-ask 14.0 16.5
  clip clip-prove 19.5 24.6
  web "$IN/neb-the-nudge-real.mp4" clip-full
else
  echo "warning: $IN/neb-the-nudge-real.mp4 missing, skipping clips"
fi

ls -lh "$OUT"
