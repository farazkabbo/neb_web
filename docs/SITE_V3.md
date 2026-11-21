# site v3: alive + playable (branch site-v2)

## today (home-markup.ts 12 KB, neb-home.js 5 KB, globals.css 15 KB)
- icons (≥1420px) · neb.exe hero + neb_preview.exe (calculus; film + lightbox once encoded)
- "what neb does": 4 CSS-only scenes, all badged "available now" (wrong) · why_neb.txt ·
  founders + readme · neb_pro.exe (always shown) · join_waitlist.exe · CSS night→dawn, no clock

## must-fix first (own commit)
- badges: only circle & ask "available now"; others "in development"; FAQ back to the truth;
  test fails if any non-circle window says "available now"
- neb_pro.exe rendered server-side only when LAUNCH_MODE=open && BILLING_ENABLED=true
  (this pauses the fake-door test while we're in waitlist mode)
- remove neb_preview.exe and photosynthesis; the only school example is PV = FV / (1 + rt)

## what changes
- first screen: centred headline + subhead, neb_film.mp4 (≤1100px, aspect-ratio box), CTA under
  it. lightbox removed; the film plays in place with a custom skin
- CTA follows LAUNCH_MODE again (form | "get neb for windows" → /download | mac: coming soon +
  email). page.tsx goes per-request (LAUNCH_MODE, BILLING_ENABLED, user agent). we stay on waitlist
- icons work at every desktop width: dblclick / tap / Enter scroll to + focus the window
- "try it" playground replaces "what neb does"; film ↔ window sync; fixed taskbar with clock

## demos (scripted, no network; each module import()ed when its window is 20% visible)
- circle_and_ask: PV = FV / (1 + rt) page. Alt+drag (touch: "✎ circle" toggle) draws a live
  gradient stroke on canvas (#7C5CF0→#F06BA8→#4E95F5). release: loop bbox hit-tests tagged targets
  (FV, PV, rt, 1 + rt); neb cursor glides in; SVG labels + arrows draw; no hit → "in the real app,
  neb explains anything you circle." বাংলা / français / english switches the question bubble only
- show_me: toolbar, Front/Back, violet tee SVG, uploads tray with the neb logo. steps: back →
  uploads → place logo. last ~80ms of pointer velocity → ray → nearest tool; wrong tool ⇒ right one
  glows + "one down" pill. ghost dotted path, ✓ per step, confetti-lite, "done. you did that."
- catch_me: tabs [terminal | email]. inside 120px of "▶ run on prod" with falling speed ⇒ neb
  cursor slides in, circles the command, alert (≥18px): "this deletes every customer. you're on
  prod, not test." [cancel] [run anyway → "nothing happened — it's a demo 😅"]. the button is
  guarded: if no alert yet, the first click / tap / Enter shows it instead. email: "attached", none
- do_it: 3 filenames + "rename by date" (one by one, strike-through) → "◀◀ replay" animates
  neb's path; "save this recipe" flies a card into a recipe book folder
- all: keyboard path (Tab to target, Enter acts, Esc closes), aria-live narration, title-bar
  "▶ see it in the film" seeks to that chapter

## film
- skin: pixel ▶, progress with chapters 0:10 / 0:19 / 0:29 / 0:37, captions (on when unmuted),
  mute, fullscreen; Space, ←/→, M, C, F. before play: muted hero-loop + "▶ watch the film · 59s";
  click → full film from 0:00 with sound. never autoplays sound. playing chapter ⇒ its window gets
  a gradient ring, its marker lights up. reduced motion: poster only
- scripts/encode-ad.sh: 1080/720 mp4 CRF 23 +faststart, VP9 webm, 8s silent hero-loop ≤1.5 MB,
  posters, vtt from docs/vo-script.txt. no files yet ⇒ poster card "the film lands soon"

## atmosphere
- scroll-tied background: fixed night layer fades into the dawn photo (opacity/transform in rAF),
  stars fade; taskbar clock ticks 11:47 pm → 7:00 am
- taskbar (≥641px): neb button, a tab per window, clock, 🔈 (off; WebAudio) · windows open .96→1 + blur
- fine pointer only: drag by title bar, click to front, dblclick title = maximise (Esc), "_"
  minimises to taskbar, reset on reload. companion cursor: lagging gradient arrow, ≤3 hints,
  "×" = off forever (localStorage, try/catch); off for touch + reduced motion

## budget
- JS: core ≤ 12 KB gz + ≤ 6 KB gz per demo · first screen: hero-loop ≤ 1.5 MB + poster, film
  on play only (720p ≤640px) · LCP = headline, CLS 0 · mobile perf ≥ 85, a11y ≥ 95 · text ≥ 16px

## tests (Playwright at 1440 and 390)
- badges · pro only with open + BILLING_ENABLED · no console errors · each demo's happy +
  keyboard path · catch_me alert before the run handler (approach, first tap) · Esc closes alerts
- film plays + seeks per chapter (59s ffmpeg test clip served via page.route, so no real ad needed)
- screenshots: first screen, playground, bottom at both widths

## decisions (2026-11-20, "do what is best")
- build now; "the film lands soon" until scripts/encode-ad.sh runs (npm run encode-ad)
- stay on LAUNCH_MODE=waitlist (no installer); pro needs open + BILLING_ENABLED (test paused)
- bengali/french questions are drafts: have a native speaker check public/demos/circle.js Q
