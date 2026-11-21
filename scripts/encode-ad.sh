#!/usr/bin/env bash
# Encodes the ad for the home page (docs/SITE_V3.md). Needs ffmpeg.
#   in:  media-src/neb-ad-final.mp4 (1920x1080, ~59s, with sound)   [media-src/ is gitignored]
#        docs/vo-script.txt (optional; one caption per line as "0:03.5 | text", see below)
#   out: public/media/neb-ad-1080.mp4, neb-ad-720.mp4, neb-ad.webm, hero-loop.mp4/.webm,
#        neb-ad.jpg, hero-loop.jpg, neb-ad.en.vtt
# Once hero-loop.mp4 exists, the next build shows the film window instead of "the film lands soon".
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media-src/neb-ad-final.mp4 OUT=public/media
LOOP_AT=${LOOP_AT:-10}   # where the 8 s silent loop starts (seconds); pick a moment that loops well
[ -f "$SRC" ] || { echo "missing $SRC"; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }
FF="ffmpeg -y -hide_banner -loglevel error"
mkdir -p "$OUT"

echo "film 1080p";  $FF -i "$SRC" -vf "scale=-2:1080" -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/neb-ad-1080.mp4"
echo "film 720p";   $FF -i "$SRC" -vf "scale=-2:720"  -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/neb-ad-720.mp4"
echo "film webm";   $FF -i "$SRC" -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -c:a libopus -b:a 96k "$OUT/neb-ad.webm"
echo "hero loop";   $FF -ss "$LOOP_AT" -t 8 -i "$SRC" -an -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop.mp4"
                    $FF -ss "$LOOP_AT" -t 8 -i "$SRC" -an -vf "scale=-2:720" -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 "$OUT/hero-loop.webm"
echo "posters";     $FF -ss 1 -i "$OUT/neb-ad-1080.mp4" -frames:v 1 -q:v 4 "$OUT/neb-ad.jpg"
                    $FF -i "$OUT/hero-loop.mp4" -frames:v 1 -q:v 4 "$OUT/hero-loop.jpg"

# Captions: lines like "0:03.5 | circle anything on your screen" (start time | text). Each caption
# runs until the next one starts; the last runs to the end of the film.
if [ -f docs/vo-script.txt ]; then
  echo "captions"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
  awk -F'|' -v dur="$DUR" '
    function secs(t,  p){ n=split(t,p,":"); return n==2 ? p[1]*60+p[2] : p[1] }
    function stamp(s,  m){ m=int(s/60); return sprintf("%02d:%06.3f", m, s-m*60) }
    /\|/ { gsub(/^[ \t]+|[ \t]+$/,"",$1); gsub(/^[ \t]+|[ \t]+$/,"",$2); t[++n]=secs($1); x[n]=$2 }
    END { print "WEBVTT\n"; for(i=1;i<=n;i++){ e=(i<n)?t[i+1]:dur; print stamp(t[i]) " --> " stamp(e); print x[i] "\n" } }
  ' docs/vo-script.txt > "$OUT/neb-ad.en.vtt"
else
  echo "no docs/vo-script.txt: skipping captions (the film plays without them)"
fi

ls -l "$OUT"/neb-ad* "$OUT"/hero-loop*
TOTAL=$(du -cb "$OUT"/neb-ad* "$OUT"/hero-loop* | tail -1 | cut -f1)
echo "total: $((TOTAL / 1024 / 1024)) MB"
[ "$(stat -c %s "$OUT/hero-loop.mp4")" -le 1572864 ] || echo "warning: hero-loop.mp4 is over 1.5 MB (raise its -crf)"
[ "$TOTAL" -le 26214400 ] || { echo "over 25 MB: stop and move the film to storage or a video host"; exit 2; }
