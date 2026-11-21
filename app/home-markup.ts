// The home page (docs/SITE_V2.md). Waitlist only until the installer ships: nothing here links to
// /download. Copy is lowercase on purpose. public/neb-home.js finds elements by id.

const SPRITES = String.raw`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="mk" viewBox="12 34 190 146"><path d="M36 150 V104 C36 74 56 58 80 58 C104 58 122 74 122 104 V136 L142 156 L178 106" fill="none" stroke="currentColor" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="wm" viewBox="0 0 256 96"><g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M10 86 V58 C10 40 22 30 38 30 C54 30 66 40 66 58 V86"/><path d="M101 58 H155 A27 27 0 1 0 147 77"/><path d="M190 8 V86"/><path d="M218 30 A28 28 0 1 1 217.99 30"/></g></symbol>
  <symbol id="arrow" viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.6 15.2 L17 15.2 Z" stroke="#1E1D1A" stroke-width="1.6" stroke-linejoin="round"/></symbol>
</svg>`;

const ctl = `<span class="ctl" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>`;
const tb = (name: string, tone = "") =>
  `<div class="tb ${tone}"><svg class="ti" aria-hidden="true"><use href="#mk" style="color:#fff"/></svg><b>${name}</b>${ctl}</div>`;
const cursor = (cls: string) =>
  `<span class="mcur ${cls}" aria-hidden="true"><svg viewBox="0 0 22 26"><use href="#arrow" fill="#6B4EE6"/></svg></span>`;

/** The waitlist form (same behaviour as before; `source` goes to /api/waitlist). */
const waitlist = (id: string, cta = "join the waitlist") =>
  `<form class="wl" id="f-${id}" novalidate><label class="sr" for="e-${id}">email</label><input id="e-${id}" type="email" placeholder="you@email.com" autocomplete="email" required><button class="btn go" id="b-${id}">${cta}</button></form>`;

/** Beside the hero: the film once it's encoded (public/media/hero-loop.mp4), else a drawn demo. */
export const FILM_WINDOW = String.raw`<section class="win film-win" aria-labelledby="film-h">${tb("neb_film.mp4", "ink")}
  <h2 class="sr" id="film-h">the neb film</h2>
  <div class="frame"><video class="loop" muted loop playsinline preload="metadata" poster="/media/hero-loop.jpg" aria-label="a short silent loop from the neb film">
    <source src="/media/hero-loop.webm" type="video/webm"><source src="/media/hero-loop.mp4" type="video/mp4"></video></div>
  <div class="film-bar"><button class="btn go" type="button" id="b-film">▶ watch the film (59s)</button></div>
<div class="lightbox" id="lb" role="dialog" aria-modal="true" aria-label="the neb film" hidden>
  <div class="win">${tb("neb_film.mp4", "ink")}
    <video id="lbv" controls playsinline preload="none" poster="/media/neb-ad.jpg">
      <source src="/media/neb-ad-720.mp4" type="video/mp4" media="(max-width: 640px)">
      <source src="/media/neb-ad.webm" type="video/webm">
      <source src="/media/neb-ad-1080.mp4" type="video/mp4">
      <track kind="captions" src="/media/neb-ad.en.vtt" srclang="en" label="english" default>
    </video>
    <button class="btn" type="button" id="lb-x">close (esc)</button>
  </div>
</div>
</section>`;

export const DEMO_WINDOW = String.raw`<section class="win film-win" aria-labelledby="soon-h">${tb("neb_film.mp4", "ink")}
  <div class="frame soon"><h2 id="soon-h">the film lands soon.</h2><p>59 seconds of neb, right here.</p></div>
</section>`;

const FEATURES = String.raw`
<section class="features" aria-labelledby="feat-h"><h2 class="kick" id="feat-h">what neb does</h2>
  <section class="win feat" id="ft-circle" data-feature="circle_and_ask" aria-labelledby="ft-circle-h">${tb("circle_and_ask.exe", "teal")}
    <div class="mini m-circle" aria-hidden="true"><span class="word">PV = FV / (1 + rt)<svg class="circ" viewBox="0 0 100 60" preserveAspectRatio="none"><path pathLength="1" d="M70 8 C40 0 6 10 6 32 C6 54 50 60 78 50 C98 42 96 14 64 6"/></svg></span><span class="note-chip">saved → finance · ch 3</span>${cursor("c1")}</div>
    <div class="pad"><span class="badge now">available now</span><h3 id="ft-circle-h">circle and ask</h3>
      <p>circle a word, a graph, or a whole page. ask out loud in bengali, french or english. neb explains it and draws right on your screen, then saves the moment to the right notebook chapter so you can replay it.</p></div>
  </section>
  <section class="win feat" id="ft-show" data-feature="show_me" aria-labelledby="ft-show-h">${tb("show_me.exe", "sand")}
    <div class="mini m-show" aria-hidden="true"><div class="tools"><i></i><i></i><i class="lit"></i><i></i></div><span class="step">step 2 of 3 · flip to back</span><div class="shirt"><span>logo</span></div>${cursor("c2")}</div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="ft-show-h">show me</h3>
      <p>stuck in an app? ask how. neb lights up the way, step by step — like flipping a shirt to the back and putting your logo on it — and you click. each time, it helps a little less, until you don't need it.</p></div>
  </section>
  <section class="win feat" id="ft-catch" data-feature="catch_me" aria-labelledby="ft-catch-h">${tb("catch_me.sys", "ink")}
    <div class="mini m-catch" aria-hidden="true"><code>DROP TABLE customers;</code><span class="run">▶ run on prod</span><span class="stop">wait. this is the live database.</span>${cursor("c3")}</div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="ft-catch-h">catch me</h3>
      <p>about to run DROP TABLE on the live database, send an email that says 'attached' with nothing attached, or reply-all to 43 people? neb sees where your mouse is heading and stops you first. runs on your computer.</p></div>
  </section>
  <section class="win feat" id="ft-do" data-feature="do_it" aria-labelledby="ft-do-h">${tb("do_it.exe", "teal")}
    <div class="mini m-do" aria-hidden="true"><ul><li><s>IMG_0412.jpg</s> beach_01.jpg</li><li><s>IMG_0413.jpg</s> beach_02.jpg</li><li><s>IMG_0414.jpg</s> beach_03.jpg</li></ul><span class="replay">◀◀ replay · 2s</span></div>
    <div class="pad"><span class="badge dev">in development</span><h3 id="ft-do-h">do it</h3>
      <p>the busywork you don't need to learn: save a recipe to your recipe book, find your lease pdf, rename 40 photos. neb does it, then shows a 2-second replay of what it did, so you're never in the dark.</p></div>
  </section>
</section>`;

/** Only rendered when LAUNCH_MODE=open and BILLING_ENABLED=true (app/page.tsx). */
export const PRO_WINDOW = String.raw`<section class="pro" aria-labelledby="pro-h">
  <div class="win">${tb("neb_pro.exe", "ink")}
    <div class="pad" id="pro-b">
      <h2 id="pro-h">neb pro</h2>
      <p class="price"><b>$19</b>/month</p>
      <p>for people who use neb every day.</p>
      <button class="btn go" type="button" id="b-pro">upgrade to pro – $19/month</button>
    </div></div>
</section>`;

export const HOME_HTML = String.raw`${SPRITES}
<nav class="icons" aria-label="desktop">
  <a class="icon" href="#feat-h"><img src="/media/icon-notebook.png" alt="" width="44" height="44">features</a>
  <a class="icon" href="#letter-h"><img src="/media/icon-letter.png" alt="" width="44" height="44">letter.txt</a>
  <a class="icon" href="#faq-h"><img src="/media/icon-help.png" alt="" width="44" height="44">readme.txt</a>
  <a class="icon" href="#join"><img src="/media/icon-lock.png" alt="" width="44" height="44">join.exe</a>
</nav>
<main>
<section class="desk hero-desk" aria-labelledby="hero-h">
  <section class="win hero-win" aria-labelledby="hero-h">${tb("neb.exe")}
    <div class="hero">
      <svg class="wm" role="img" aria-label="neb"><use href="#wm"/></svg>
      <h1 id="hero-h">your cursor, but it understands.</h1>
      <p class="sub">circle anything on your screen and ask out loud, in your language. neb explains it, shows you the way, and catches mistakes before you make them.</p>
      ${waitlist("hero")}
      <p class="micro" id="m-hero">windows first · mac coming soon. we email you once, when it's ready.</p>
      <p class="mobsend">on your phone? <button type="button" id="sendme">send this to your laptop</button></p>
    </div>
  </section>
  <!--HERO_MEDIA-->
</section>

${FEATURES}

<section class="win why" aria-labelledby="why-h">${tb("why_neb.txt", "sand")}
  <div class="pad"><h2 id="why-h">does the busywork. teaches you the rest. catches you before you slip.</h2>
    <p>ai that does everything for you makes you forget how to do it yourself. neb takes the chores off your plate, teaches you the things worth knowing, and never acts behind your back: every click it makes, you can replay.</p></div>
</section>

<div class="notes">
  <section class="win" aria-labelledby="letter-h">${tb("from_the_founders.txt", "sand")}
    <div class="pad"><h2 class="sr" id="letter-h">a letter from the founders</h2>
      <p>hey homo sapiens.</p>
      <p>every ai we tried did the thing for us. we got faster. <mark>we didn't get better.</mark></p>
      <p>so we're building neb: a cursor that understands what's on your screen. whatever you're learning — a formula, a design app, a database, a recipe — circle it and ask. it does the chores, shows you the rest, and catches you before you slip.</p>
      <p>it's early. join the waitlist and you'll be first in.</p>
      <div class="sig"><span>faraz, rubaiya &amp; rahbir — the founders</span><svg class="wm" role="img" aria-label="neb"><use href="#wm"/></svg></div></div>
  </section>
  <section class="win" aria-labelledby="faq-h">${tb("readme.txt", "teal")}
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

<!--PRO-->

<section class="win final" id="join" aria-labelledby="final-h">${tb("join_waitlist.exe")}
  <div class="pad"><h2 id="final-h">be first in.</h2>
    <p>one email when neb is ready. nothing else.</p>
    ${waitlist("final")}
    <p class="micro" id="m-final">windows first · mac coming soon.</p></div>
</section>
</main>

<footer><svg class="mk" aria-hidden="true"><use href="#mk"/></svg><p class="see">see you soon.</p><nav aria-label="footer"><a href="/privacy">privacy</a><a href="https://www.instagram.com/neb_2026/" target="_blank" rel="noopener">instagram</a></nav>© 2026 neb</footer>
`;
