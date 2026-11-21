# site v2: "your cursor, but it understands" (branch site-v2)

## today (app/home-markup.ts + public/neb-home.js, ~29 KB)
- svg sprites, #boot terminal ("checking understanding … not found"), sessionStorage once
- #story: pinned scroll film (wallpapers, homework.pdf, answers.exe, notebook, pop_quiz.exe,
  understanding.sys, rewind, #end card, captions, #tbar taskbar) + hero window neb.exe inside it
- #launch: LAUNCH_FILM.MP4 tablet (different-4k loop + teaser lightbox, NEXT_PUBLIC_LAUNCH_VIDEO_URL)
- #setup: "neb setup" wizard form (source `setup`)
- from_the_founders.txt, readme.txt (5 faqs), footer (privacy, instagram, placeholder x + tiktok)
- lib/launch.ts `homeFor()` regex-rewrites the markup for LAUNCH_MODE=open (hides #f-hero, adds
  "Get neb", turns data-go="#setup" buttons into /download links)

## keep / remove / add
- keep: sprites, .win/.tb/.ctl chrome, palette, fonts, lowercase voice, #f-hero waitlist logic +
  messages, "send this to your laptop" on phones (source `send-to-me`), founders + readme windows
- remove: #boot, whole #story (stage, cursors, scroll engine, ~70% of neb-home.js), #launch tablet,
  #setup wizard, NEXT_PUBLIC_LAUNCH_VIDEO_URL, old public/media videos (29 MB: teaser, nudge,
  different-4k) and scripts/prep-media.sh's Higgsfield section, footer x/tiktok (no real urls)
- add: hero neb.exe + neb_film.mp4, 4 feature windows, why_neb.txt, final CTA window, lightbox
- CTA: replace the regex hack with markup built per request: `homeHtml({mode, os})`, os from the
  user agent (same `osOf` as /download, moved to lib/launch.ts). waitlist → form (hero / final_cta);
  open + windows → "get neb for windows" → /download; open + mac/other → "mac is coming soon" + email
- mac email goes to /api/download-link with a new enum value `mac_notify` (only API change; it
  sends the existing "mac is coming" email). final CTA posts to /api/waitlist with `final_cta`
- pricing (only what code says): "8 free questions to start. your notebook, replay and pdfs are
  always free." (app/download/page.tsx). drops "free at launch"
- metadata: title/description/og per brief, og.png 1200x630 from a film frame + headline (ffmpeg),
  og:video → /media/neb-ad-720.mp4

## video plan (scripts/encode-ad.sh, replaces prep-media.sh)
- inputs: media-src/neb-ad-final.mp4 (+ optional -9x16), docs/vo-script.txt; media-src/ gitignored
- outputs per brief: neb-ad-1080/720.mp4, neb-ad.webm, hero-loop.mp4/.webm, feat-{circle,show,
  catch,do}.mp4 (+webm), posters q80, neb-ad.en.vtt (timings by hand from the vo script)
- cut points chosen after I watch the ad; I'll list them in the script for you to adjust
- budget check: the script prints the total and fails over 25 MB (the 1080 file only loads in the
  lightbox on desktop, so a page view costs ~3–4 MB)
- player: loops preload=metadata, IntersectionObserver (0.3) play/pause, reduced-motion = poster
  only; lightbox = <dialog> + <video controls> + <track default>, Esc, focus trap, focus return;
  <source media="(max-width:640px)"> for 720p / 9:16. never autoplay sound

## test plan
- add devDeps @playwright/test (chromium already installed locally); tests/site.spec.ts runs
  `next build && next start` twice (LAUNCH_MODE=waitlist / open)
- cases: loads with no console errors; hero CTA per mode; Mac UA → "mac is coming soon"; lightbox
  opens, plays, track mode "showing", Esc closes, focus back on the button; reduced motion → loops
  paused with posters; exactly one "available now" badge (circle_and_ask); no horizontal scroll at 390
- screenshots 1440 + 390 → docs/screens/; Lighthouse mobile via `npx lighthouse` on next start

## questions before I build
1. analytics: there is none. /privacy says "we do not use … analytics tools". film_play / cta_click
   events need a tool (e.g. Vercel Web Analytics, cookieless) and a privacy page update. skip them,
   or add one and update /privacy?
2. media-src/neb-ad-final.mp4 and docs/vo-script.txt aren't here yet. I can build everything
   with placeholder posters and run the encode when they land
3. ok to delete the 29 MB of old media from public/media (they stay in git history)?
