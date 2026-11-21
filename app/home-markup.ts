// The home page (docs/SITE_V3.md). Server-rendered HTML; public/neb-home.js adds the desktop
// (taskbar, dragging, film player, sync) and loads each demo from public/demos/ when it's in view.
// Copy is lowercase on purpose. Ids and data-* attributes are what the scripts look for.

import type { LaunchMode } from "@/lib/launch";

export type Os = "windows" | "mac" | "other";

/** The visitor's computer, from their browser (same rule as /download). */
export function osOf(userAgent: string): Os {
  if (/Windows NT/i.test(userAgent)) return "windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "mac";
  return "other";
}

/** Film chapters (seconds into neb-ad), shared by the player markers and the demo windows. */
export const CHAPTERS = [
  { id: "circle", label: "circle & ask", at: 10 },
  { id: "show", label: "show me", at: 19 },
  { id: "catch", label: "catch me", at: 29 },
  { id: "do", label: "do it", at: 37 },
] as const;
const FILM_SECONDS = 59;

const SPRITES = String.raw`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs><linearGradient id="g-neb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C5CF0"/><stop offset=".55" stop-color="#F06BA8"/><stop offset="1" stop-color="#4E95F5"/></linearGradient></defs>
  <symbol id="mk" viewBox="12 34 190 146"><path d="M36 150 V104 C36 74 56 58 80 58 C104 58 122 74 122 104 V136 L142 156 L178 106" fill="none" stroke="currentColor" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="wm" viewBox="0 0 256 96"><g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M10 86 V58 C10 40 22 30 38 30 C54 30 66 40 66 58 V86"/><path d="M101 58 H155 A27 27 0 1 0 147 77"/><path d="M190 8 V86"/><path d="M218 30 A28 28 0 1 1 217.99 30"/></g></symbol>
</svg>`;

type Chapter = (typeof CHAPTERS)[number];

/** A window title bar: name, optional "see it in the film" chapter button, and working controls. */
function tb(name: string, tone = "", chapter?: Chapter) {
  const seek = chapter
    ? `<button class="seek" type="button" data-seek="${chapter.id}" aria-label="see it in the film: ${chapter.label}">▶ see it in the film</button>`
    : "";
  return `<div class="tb ${tone}" data-drag><svg class="ti" aria-hidden="true"><use href="#mk" style="color:#fff"/></svg><b>${name}</b>${seek}<span class="ctl"><button type="button" data-act="min" aria-label="minimize ${name}">_</button><button type="button" data-act="max" aria-label="maximize ${name}">□</button><button type="button" data-act="min" aria-label="close ${name}">×</button></span></div>`;
}

/** The neb cursor the demos move around (gradient arrow). */
const nebCursor = () =>
  `<span class="ncur" aria-hidden="true"><svg viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.6 15.2 L17 15.2 Z" fill="url(#g-neb)" stroke="#1E1D1A" stroke-width="1.4" stroke-linejoin="round"/></svg><i>neb</i></span>`;

const emailForm = (id: string, cta: string) =>
  `<form class="wl" id="f-${id}" novalidate><label class="sr" for="e-${id}">email</label><input id="e-${id}" type="email" placeholder="you@email.com" autocomplete="email" required><input name="company" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp"><button class="btn go" id="b-${id}">${cta}</button></form>`;

/**
 * The call to action, by launch mode (docs/LAUNCH.md): the waitlist form; or, once open, the
 * download link on Windows and "mac is coming soon" + an email box everywhere else.
 */
export function ctaHtml(id: "hero" | "final", mode: LaunchMode, os: Os): string {
  if (mode === "waitlist") {
    const phone = id === "hero" ? `<p class="mobsend">on your phone? <button type="button" id="sendme">send this to your laptop</button></p>` : "";
    return `${emailForm(id, "join the waitlist")}<p class="micro" id="m-${id}">windows first · mac coming soon</p>${phone}`;
  }
  if (os === "windows") {
    return `<a class="btn go big" href="/download" data-cta="${id}">get neb for windows</a><p class="micro" id="m-${id}">windows first · mac coming soon</p>`;
  }
  const line =
    os === "mac"
      ? "<b>mac is coming soon.</b> leave your email and we'll tell you, or send the link to your windows pc."
      : "<b>neb is for windows computers.</b> mac is coming soon. we'll email you the link for your pc.";
  return `<p class="soon-line">${line}</p>${emailForm(`mac-${id}`, "email me")}<p class="micro" id="m-mac-${id}">windows first · mac coming soon</p>`;
}

/** The film window once scripts/encode-ad.sh has made the files (captions only if the .vtt exists). */
export const filmWindow = (captions: boolean) => String.raw`<section class="win film" id="w-film" data-win="neb_film.mp4" aria-labelledby="film-h">${tb("neb_film.mp4", "ink")}
  <h2 class="sr" id="film-h">the neb film, 59 seconds</h2>
  <div class="frame" id="film-frame">
    <video class="loop" id="loop" muted loop playsinline preload="metadata" poster="/media/hero-loop-tiny.jpg" aria-label="a silent 8 second loop from the neb film">
      <source src="/media/hero-loop.webm" type="video/webm"><source src="/media/hero-loop.mp4" type="video/mp4"></video>
    <video id="film" playsinline preload="none" poster="/media/neb-ad.jpg" aria-label="the neb film" hidden>
      <source src="/media/neb-ad-720.mp4" type="video/mp4" media="(max-width: 640px)">
      <source src="/media/neb-ad.webm" type="video/webm">
      <source src="/media/neb-ad-1080.mp4" type="video/mp4">
      ${captions ? `<track kind="captions" src="/media/neb-ad.en.vtt" srclang="en" label="english" default>` : ""}
    </video>
    <button class="bigplay" type="button" id="b-film"><span class="tri" aria-hidden="true">▶</span> watch the film · 59s</button>
  </div>
  <div class="skin" id="skin" hidden>
    <button type="button" class="sk" id="sk-play" aria-label="play">▶</button>
    <span class="time" id="sk-time">0:00 / 0:59</span>
    <div class="track" id="sk-track" role="slider" tabindex="0" aria-label="seek" aria-valuemin="0" aria-valuemax="${FILM_SECONDS}" aria-valuenow="0" aria-valuetext="0:00">
      <i class="fill" id="sk-fill"></i>
      ${CHAPTERS.map((c) => `<button type="button" class="mark" data-chapter="${c.id}" data-at="${c.at}" style="left:${((c.at / FILM_SECONDS) * 100).toFixed(2)}%" aria-label="${c.label} at 0:${String(c.at).padStart(2, "0")}"><span>${c.label}</span></button>`).join("")}
    </div>
    ${captions ? `<button type="button" class="sk" id="sk-cc" aria-pressed="true" aria-label="captions">cc</button>` : ""}
    <button type="button" class="sk" id="sk-mute" aria-pressed="false" aria-label="mute">🔊</button>
    <button type="button" class="sk" id="sk-fs" aria-label="fullscreen">⛶</button>
  </div>
</section>`;

/** Until the film is encoded: the same box, so nothing moves when it arrives. */
export const SOON_WINDOW = String.raw`<section class="win film" id="w-film" data-win="neb_film.mp4" aria-labelledby="film-h">${tb("neb_film.mp4", "ink")}
  <div class="frame soon"><h2 id="film-h">the film lands soon.</h2><p>59 seconds of neb, right here.</p></div>
</section>`;

const ch = (id: Chapter["id"]) => CHAPTERS.find((c) => c.id === id)!;

const PLAYGROUND = String.raw`
<section class="play" aria-labelledby="play-h">
  <h2 class="pix" id="play-h">don't take our word for it. try it.</h2>
  <div class="grid">

  <section class="win feat" id="w-circle" data-win="circle_and_ask.exe" data-feature="circle_and_ask" data-chapter="circle" aria-labelledby="h-circle">${tb("circle_and_ask.exe", "teal", ch("circle"))}
    <div class="stage" data-demo="circle">
      <div class="page">
        <p class="dh">finance · present value</p>
        <p class="formula t" data-t="formula"><span class="t" data-t="pv" tabindex="0" role="button" aria-label="circle PV">PV</span> = <span class="t" data-t="fv" tabindex="0" role="button" aria-label="circle FV">FV</span> / <span class="t" data-t="den" tabindex="0" role="button" aria-label="circle 1 plus r t">(1 + <span class="t" data-t="rt" tabindex="0" role="button" aria-label="circle rt">rt</span>)</span></p>
        <p class="ex t" data-t="ex" tabindex="0" role="button" aria-label="FV = $1,100 · r = 5% · t = 2 years (circle it)">FV = $1,100 · r = 5% · t = 2 years</p>
        <canvas class="ink" aria-hidden="true"></canvas>
        <svg class="ann" aria-hidden="true"></svg>
        <p class="q" hidden><span aria-hidden="true">🎙</span> <span class="qt">what does this mean?</span></p>
        <p class="a" hidden></p>
        ${nebCursor()}
      </div>
      <div class="bar">
        <button type="button" class="btn pen" aria-pressed="false">✎ circle</button>
        <span class="tip"><kbd>alt</kbd> + drag around anything</span>
        <span class="langs" role="group" aria-label="question language"><button type="button" data-lang="bn" lang="bn" aria-pressed="false">বাংলা</button><button type="button" data-lang="fr" lang="fr" aria-pressed="false">français</button><button type="button" data-lang="en" aria-pressed="true">english</button></span>
      </div>
      <p class="sr live" aria-live="polite"></p>
    </div>
    <div class="pad"><span class="badge now">available now</span><h3 id="h-circle">circle and ask</h3>
      <p>circle a word, a graph, or a whole page. ask out loud in bengali, french or english. neb explains it and draws right on your screen, then saves the moment to the right notebook chapter.</p></div>
  </section>

  <section class="win feat" id="w-show" data-win="show_me.exe" data-feature="show_me" data-chapter="show" aria-labelledby="h-show">${tb("show_me.exe", "sand", ch("show"))}
    <div class="stage" data-demo="show">
      <p class="task">task: <b>put the logo on the back</b> <span class="steps" aria-hidden="true"><i>1</i><i>2</i><i>3</i></span></p>
      <div class="app">
        <div class="tools" role="toolbar" aria-label="design tools">
          <button type="button" data-tool="select" aria-label="select">⬚</button>
          <button type="button" data-tool="text" aria-label="text">T</button>
          <button type="button" data-tool="uploads" aria-label="uploads">⇪</button>
          <button type="button" data-tool="layers" aria-label="layers">≡</button>
        </div>
        <div class="canvas">
          <div class="side" role="group" aria-label="shirt side"><button type="button" data-side="front" aria-pressed="true">front</button><button type="button" data-side="back" aria-pressed="false">back</button></div>
          <svg class="tee" viewBox="0 0 200 216" role="img" aria-label="a t-shirt, front side">
            <defs><linearGradient id="g-tee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6CF4"/><stop offset="1" stop-color="#5B3FD6"/></linearGradient></defs>
            <path d="M72 12 C82 30 118 30 128 12 L176 30 L198 78 L164 94 L158 82 L158 204 C120 212 80 212 42 204 L42 82 L36 94 L2 78 L24 30 Z" fill="url(#g-tee)" stroke="#2B1E73" stroke-width="2.5" stroke-linejoin="round"/>
            <path class="collar-front" d="M72 12 C82 30 118 30 128 12" fill="none" stroke="#2B1E73" stroke-width="5" stroke-linecap="round"/>
            <path class="collar-back" d="M74 12 C86 20 114 20 126 12" fill="none" stroke="#2B1E73" stroke-width="5" stroke-linecap="round"/>
            <path d="M42 82 L36 94 M158 82 L164 94" stroke="#2B1E73" stroke-width="2" opacity=".5"/>
            <g class="logo"><use href="#mk" x="70" y="64" width="60" height="46" style="color:#fff"/><use href="#wm" x="72" y="116" width="56" height="22" style="color:#fff"/></g>
          </svg>
          <svg class="ghost" aria-hidden="true"><path/></svg>
        </div>
        <div class="tray" hidden><p>uploads</p><button type="button" class="logo-item" aria-label="place the neb logo on the shirt"><svg viewBox="12 34 190 146" aria-hidden="true"><use href="#mk" style="color:#6B4EE6"/></svg></button></div>
      </div>
      <span class="pill" aria-hidden="true">one down</span>
      <div class="done-card" hidden><p>done. you did that.</p><button type="button" class="btn again">again</button></div>
      <p class="sr live" aria-live="polite"></p>
    </div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="h-show">show me</h3>
      <p>stuck in an app? ask how. neb lights up the way, step by step, and you click. each time it helps a little less, until you don't need it.</p></div>
  </section>

  <section class="win feat" id="w-catch" data-win="catch_me.sys" data-feature="catch_me" data-chapter="catch" aria-labelledby="h-catch">${tb("catch_me.sys", "ink", ch("catch"))}
    <div class="stage" data-demo="catch">
      <div class="tabs" role="tablist" aria-label="catch me examples"><button type="button" role="tab" id="ct-term" aria-controls="cp-term" aria-selected="true">terminal</button><button type="button" role="tab" id="ct-mail" aria-controls="cp-mail" aria-selected="false" tabindex="-1">email</button></div>
      <div class="pane" id="cp-term" role="tabpanel" aria-labelledby="ct-term" data-kind="term">
        <p class="prompt"><span>prod-db ›</span> <code class="target">DROP TABLE customers;</code></p>
        <p class="hintline">go on. try running it.</p>
        <button type="button" class="run danger">▶ run on prod</button>
      </div>
      <div class="pane" id="cp-mail" role="tabpanel" aria-labelledby="ct-mail" data-kind="mail" hidden>
        <p class="hdr">to: everyone@acme.co · subject: q3 numbers</p>
        <p class="body">hi all, the q3 numbers are <span class="target">attached</span>. thanks!</p>
        <p class="att">📎 no attachments</p>
        <button type="button" class="run">send</button>
      </div>
      <svg class="ring" aria-hidden="true"><ellipse pathLength="1"/></svg>
      ${nebCursor()}
      <div class="alert" role="alertdialog" aria-labelledby="ca-msg" hidden>
        <p id="ca-msg"></p>
        <div class="row"><button type="button" class="btn go cancel">cancel</button><button type="button" class="btn anyway">run anyway</button></div>
      </div>
      <p class="sr live" aria-live="assertive"></p>
    </div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="h-catch">catch me</h3>
      <p>about to drop the live database, send "attached" with nothing attached, or reply-all to 43 people? neb sees where your mouse is heading and stops you first. runs on your computer.</p></div>
  </section>

  <section class="win feat" id="w-do" data-win="do_it.exe" data-feature="do_it" data-chapter="do" aria-labelledby="h-do">${tb("do_it.exe", "teal", ch("do"))}
    <div class="stage" data-demo="do">
      <ul class="files" aria-label="photos">
        <li data-new="2026-06-14_beach.jpg"><span class="old">IMG_0412.jpg</span><span class="new"></span></li>
        <li data-new="2026-06-14_sunset.jpg"><span class="old">IMG_0413.jpg</span><span class="new"></span></li>
        <li data-new="2026-06-15_market.jpg"><span class="old">IMG_0414.jpg</span><span class="new"></span></li>
      </ul>
      <div class="recipe" aria-hidden="true">🍝 <b>nonna's pasta</b><br>rigatoni · tomatoes · basil</div>
      <div class="folder" aria-hidden="true">📒 <span>recipe book (<b class="count">3</b>)</span></div>
      <svg class="trail" aria-hidden="true"><polyline/></svg>
      ${nebCursor()}
      <div class="bar">
        <button type="button" class="btn go rename">rename by date</button>
        <button type="button" class="btn save">save this recipe</button>
        <button type="button" class="btn replay" hidden>◀◀ replay</button>
      </div>
      <p class="sr live" aria-live="polite"></p>
    </div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="h-do">do it</h3>
      <p>the busywork you don't need to learn: save a recipe, find your lease pdf, rename 40 photos. neb does it, then shows a 2-second replay, so you're never in the dark.</p></div>
  </section>

  </div>
</section>`;

/** Only rendered when LAUNCH_MODE=open and BILLING_ENABLED=true (lib/launch.ts showPro). */
export const PRO_WINDOW = String.raw`<section class="win pro" id="w-pro" data-win="neb_pro.exe" aria-labelledby="pro-h">${tb("neb_pro.exe", "ink")}
    <div class="pad" id="pro-b">
      <h2 id="pro-h">neb pro</h2>
      <p class="price"><b>$19</b>/month</p>
      <p>for people who use neb every day.</p>
      <button class="btn go" type="button" id="b-pro">upgrade to pro – $19/month</button>
    </div>
</section>`;

const ICONS = String.raw`<nav class="icons" aria-label="desktop shortcuts">
  <button type="button" class="icon" data-open="w-circle"><img src="/media/icon-notebook.png" alt="" width="44" height="44"><span>features</span></button>
  <button type="button" class="icon" data-open="w-letter"><img src="/media/icon-letter.png" alt="" width="44" height="44"><span>letter.txt</span></button>
  <button type="button" class="icon" data-open="w-faq"><img src="/media/icon-help.png" alt="" width="44" height="44"><span>readme.txt</span></button>
  <button type="button" class="icon" data-open="w-join"><img src="/media/icon-lock.png" alt="" width="44" height="44"><span>join.exe</span></button>
</nav>`;

export function homeHtml(opts: { mode: LaunchMode; os: Os; film: boolean; captions: boolean; pro: boolean }): string {
  const { mode, os, film, captions, pro } = opts;
  return String.raw`${SPRITES}
<div class="sky" aria-hidden="true"><div class="night"></div><div class="stars"></div><div class="dawn"></div></div>
${ICONS}
<main>
<section class="first" aria-labelledby="hero-h">
  <h1 id="hero-h">your cursor, but it understands.</h1>
  <p class="sub">circle anything on your screen and ask out loud. neb explains it, shows you the way, and catches mistakes before you make them.</p>
  ${film ? filmWindow(captions) : SOON_WINDOW}
  <div class="cta" id="cta-hero">${ctaHtml("hero", mode, os)}</div>
</section>
${PLAYGROUND}

<section class="win why" id="w-why" data-win="why_neb.txt" aria-labelledby="why-h">${tb("why_neb.txt", "sand")}
  <div class="pad"><h2 id="why-h">does the busywork. teaches you the rest. catches you before you slip.</h2>
    <p>ai that does everything for you makes you forget how. neb does the chores, teaches you what's worth knowing, and never acts behind your back.</p></div>
</section>

<div class="notes">
  <section class="win" id="w-letter" data-win="from_the_founders.txt" aria-labelledby="letter-h">${tb("from_the_founders.txt", "sand")}
    <div class="pad"><h2 class="sr" id="letter-h">a letter from the founders</h2>
      <p>hey homo sapiens.</p>
      <p>every ai we tried did the thing for us. we got faster. <mark>we didn't get better.</mark></p>
      <p>so we're building neb: a cursor that understands what's on your screen. whatever you're learning — a formula, a design app, a database, a recipe — circle it and ask. it does the chores, shows you the rest, and catches you before you slip.</p>
      <p>it's early. join the waitlist and you'll be first in.</p>
      <div class="sig"><span>faraz, rubaiya &amp; rahbir — the founders</span><svg class="wm" role="img" aria-label="neb"><use href="#wm"/></svg></div></div>
  </section>
  <section class="win" id="w-faq" data-win="readme.txt" aria-labelledby="faq-h">${tb("readme.txt", "teal")}
    <div class="pad faq"><h2 class="sr" id="faq-h">questions</h2>
      <details open><summary>what is neb?</summary><p>a cursor that understands anything you circle on your screen. it explains, shows you how, catches mistakes and does the chores.</p></details>
      <details><summary>will it just do things for me?</summary><p>the busywork, yes, and it shows you a replay of what it did. anything worth learning, it shows you the way and you do it.</p></details>
      <details><summary>what works today vs what's coming?</summary><p>circle and ask, the notebook and the handwriting check work today. show me, catch me and do it are in development.</p></details>
      <details><summary>when can i get it?</summary><p>soon. the waitlist gets in first, and we'll email you once when it's ready.</p></details>
      <details><summary>which computers?</summary><p>windows first. mac is coming soon.</p></details>
      <details><summary>which languages?</summary><p>we've tested bengali, french and english.</p></details>
      <details><summary>is my data private?</summary><p>neb only looks when you ask. catch me runs on your computer and is off until you turn it on. your notes stay yours.</p></details>
      <details><summary>is it free?</summary><p>you get 8 free questions to start. your notebook, replay and pdfs are always free.</p></details>
    </div>
  </section>
</div>

${pro ? PRO_WINDOW : ""}

<section class="win final" id="w-join" data-win="${mode === "waitlist" ? "join_waitlist.exe" : "get_neb.exe"}" aria-labelledby="final-h">${tb(mode === "waitlist" ? "join_waitlist.exe" : "get_neb.exe")}
  <div class="pad"><h2 id="final-h">be first in.</h2>
    <p>${mode === "waitlist" ? "one email when neb is ready. nothing else." : "neb is out for windows. mac is next."}</p>
    <div class="cta">${ctaHtml("final", mode, os)}</div></div>
</section>
</main>

<footer><div class="foot"><svg class="mk" aria-hidden="true"><use href="#mk"/></svg><p class="see">see you soon.</p><nav aria-label="footer"><a href="/privacy">privacy</a><a href="https://www.instagram.com/neb_2026/" target="_blank" rel="noopener">instagram</a></nav><p>© 2026 neb</p></div></footer>

<div class="taskbar" id="taskbar" role="toolbar" aria-label="taskbar">
  <button type="button" class="start" id="tb-top" aria-label="back to top"><svg aria-hidden="true"><use href="#mk"/></svg>neb</button>
  <div class="tabs-bar" id="tb-tabs"></div>
  <button type="button" class="snd" id="tb-snd" aria-pressed="false" aria-label="ui sounds">🔈</button>
  <span class="clock" id="tb-clock" aria-hidden="true">11:47 PM</span>
</div>
<div class="buddy" id="buddy" hidden aria-hidden="true"><svg viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.6 15.2 L17 15.2 Z" fill="url(#g-neb)" stroke="#1E1D1A" stroke-width="1.4" stroke-linejoin="round"/></svg></div>
<div class="buddy-hint" id="buddy-hint" role="status" hidden><span></span><button type="button" aria-label="turn off hints">×</button></div>
<div class="maxback" id="maxback" hidden></div>
`;
}
