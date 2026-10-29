// Generated from the approved prototype. Edit copy here; keep ids and classes.
export const HOME_HTML = String.raw`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="mk" viewBox="12 34 190 146"><path d="M36 150 V104 C36 74 56 58 80 58 C104 58 122 74 122 104 V136 L142 156 L178 106" fill="none" stroke="currentColor" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="wm" viewBox="0 0 256 96"><g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M10 86 V58 C10 40 22 30 38 30 C54 30 66 40 66 58 V86"/><path d="M101 58 H155 A27 27 0 1 0 147 77"/><path d="M190 8 V86"/><path d="M218 30 A28 28 0 1 1 217.99 30"/></g></symbol>
  <symbol id="arrow" viewBox="0 0 22 26"><path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.6 15.2 L17 15.2 Z" stroke="#1E1D1A" stroke-width="1.6" stroke-linejoin="round"/></symbol>
</svg>

<div id="boot" aria-hidden="true" hidden></div>

<section id="story" aria-label="what happens at 11:47 pm">
<div id="pin">
  <div class="wp" id="wpNight"><div id="stars"></div></div>
  <div class="wp" id="wpGrey"></div>
  <div class="wp" id="wpDawn"></div>

  <div id="stage"><div id="jit">
    <div class="icon" id="ic-hw"><svg viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3z" fill="#FBF8F0" stroke="#1E1D1A" stroke-width=".8"/><path d="M10 1v3h3" fill="#DCD6C8" stroke="#1E1D1A" stroke-width=".8"/><rect x="5" y="7" width="6" height="1" fill="#8C8677"/><rect x="5" y="9" width="6" height="1" fill="#8C8677"/><rect x="5" y="11" width="4" height="1" fill="#6B4EE6"/></svg><span>homework.pdf</span></div>
    <div class="icon" id="ic-ans"><svg viewBox="0 0 16 16"><path d="M1 2h14v9H7l-4 3v-3H1z" fill="#C9CBC6" stroke="#1E1D1A" stroke-width=".8"/><rect x="4" y="5" width="2" height="2" fill="#1E1D1A"/><rect x="7" y="5" width="2" height="2" fill="#1E1D1A"/><rect x="10" y="5" width="2" height="2" fill="#1E1D1A"/></svg><span>answers.exe</span><span class="tip" id="tip">blocked during quizzes</span></div>
    <div class="icon" id="ic-nb"><svg viewBox="0 0 16 16"><rect x="3" y="1" width="11" height="14" fill="#6B4EE6" stroke="#1E1D1A" stroke-width=".8"/><rect x="5" y="4" width="7" height="3" fill="#F4F0E6"/><g fill="#1E1D1A"><rect x="2" y="3" width="2" height="1"/><rect x="2" y="6" width="2" height="1"/><rect x="2" y="9" width="2" height="1"/><rect x="2" y="12" width="2" height="1"/></g></svg><span>notebook</span></div>
    <div class="icon" id="ic-bin"><svg viewBox="0 0 16 16"><path d="M3 4h10l-1 11H4z" fill="#7DA4AF" stroke="#1E1D1A" stroke-width=".8"/><rect x="2" y="3" width="12" height="1.4" fill="#1E1D1A"/><g fill="#1E1D1A" opacity=".5"><rect x="6" y="6" width="1" height="7"/><rect x="9" y="6" width="1" height="7"/></g><circle id="binball" cx="8" cy="3" r="2.2" fill="#FBF8F0" stroke="#1E1D1A" stroke-width=".6" opacity="0"/></svg><span>copied_answers</span></div>

    <div id="note">due 8am!!<br>4 more to go</div>

    <div class="win" id="w-hw"><div class="tb teal"><svg class="ti" viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3z" fill="#FBF8F0"/></svg><b>homework.pdf</b><span class="ctl"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="doc"><p class="dh">algebra · homework 4</p><ol>
        <li><span>Q1. 5x = 35</span><span>✓</span></li><li><span>Q2. x − 9 = 3</span><span>✓</span></li>
        <li class="hl"><span>Q3. solve for x: 2x + 6 = 14</span><span></span></li><li><span>Q4. 4x − 1 = 19</span><span></span></li></ol>
        <p class="due">due tomorrow, 8:00 am</p></div></div>

    <div class="win" id="w-ans"><div class="tb sand"><svg class="ti" viewBox="0 0 16 16"><path d="M1 2h14v9H7l-4 3v-3H1z" fill="#FBF8F0"/></svg><b>answers.exe</b><span class="ctl"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="chat"><div class="msgs"><div class="m u" id="mu">just give me the answer</div><div class="dots" id="dots">• • •</div><div class="m b" id="mb">x = 4</div><div class="m meta" id="mm">answered in 0.4s · no steps shown</div></div>
      <div class="inp"><div class="f"><span id="typed"></span><span class="caret" id="caret"></span></div></div></div></div>

    <div class="win" id="w-tab"><div class="tb"><svg class="ti"><use href="#mk" style="color:#fff"/></svg><b>notebook — algebra</b><span class="ctl"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="tablet"><div class="screen">
        <div class="act" id="act1"><div class="hl-line" style="top:7%">Q3.</div><div class="pasted" id="pasted">x = 4<small>pasted from answers.exe</small></div></div>
        <div class="lockwrap"><div class="win" id="lockd"><div class="tb ink"><svg class="ti"><use href="#mk" style="color:#fff"/></svg><b>notebook.neb</b><span class="ctl"><i>×</i></span></div>
          <div class="dlg-b"><p><b>classified until launch day.</b><br>what happens here is <span class="redact"></span>.</p><button class="btn go" type="button" data-go="#setup">join to see it</button></div></div></div>
        <div class="act" id="act2">
          <div class="hl-line" id="l1" style="top:5%">Q3. 2x + 6 = 14</div>
          <div class="hl-line" id="l2" style="top:19%">2x = 14 <span class="p6" id="p6">+ 6<svg class="circ" viewBox="0 0 100 60" preserveAspectRatio="none"><path id="circ" pathLength="1" d="M70 8 C40 0 6 10 6 32 C6 54 50 60 78 50 C98 42 96 14 64 6"/></svg></span><i class="strike" id="strike"></i></div>
          <div class="hl-line" id="l3" style="top:33%">2x = 14 − 6 = 8</div>
          <div class="hl-line" id="l4" style="top:47%">x = 4 <svg class="tick" viewBox="0 0 24 20"><path id="t1" pathLength="1" d="M3 11 L9 17 L21 3"/></svg></div>
          <div class="hl-line" id="l5" style="top:63%">check: 2·4 + 6 = 14</div>
          <div class="hl-line" id="l6" style="top:77%">Q4. 4x − 1 = 19 → x = 5 <svg class="tick" viewBox="0 0 24 20"><path id="t2" pathLength="1" d="M3 11 L9 17 L21 3"/></svg></div>
        </div>
      </div></div></div>

    <div class="win" id="w-quiz"><div class="tb ink"><svg class="ti" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" fill="#F4F0E6"/></svg><b>pop_quiz.exe</b><span class="ctl"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="quiz"><p class="rule">8:02 am · no notes · no tabs · just you</p><p class="q">3x − 4 = 11</p>
        <div class="ans">x = <span class="fld bevel-in"><span id="qv"></span><span class="caret" id="qc"></span></span></div>
        <div class="stamp" id="stamp"><svg><use href="#mk"/></svg>learned</div></div></div>

    <div class="win" id="w-err" role="presentation"><div class="tb ink"><b>understanding.sys</b><span class="ctl"><i>×</i></span></div>
      <div class="err"><div class="bang">!</div><div><p><b>understanding not found.</b><br>the answer to Q3 was copied, not learned.</p>
        <div class="row"><span class="btn">ok</span><span class="btn" id="rwbtn">◀◀ rewind</span></div></div></div></div>

    <div class="win" id="w-hero"><div class="tb"><svg class="ti"><use href="#mk" style="color:#fff"/></svg><b>neb.exe</b><span class="ctl"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="hero">
        <svg class="wm" aria-label="neb"><use href="#wm"/></svg>
        <h1>Don't just get the answer. Learn it.</h1>
        <p class="sub">a tutor that lives in your notebook.</p>
        <form class="wl" id="f-hero" novalidate><label class="sr" for="e-hero">email</label><input id="e-hero" type="email" placeholder="you@school.edu" autocomplete="email" required><button class="btn go" id="b-hero">join the waitlist</button></form>
        <p class="micro" id="m-hero">free at launch. we email you once, on launch day.</p>
        <p class="mobsend">on your phone? <button type="button" id="sendme">send this to your laptop</button></p>
        <div class="hint"><span><span class="arr">↓</span> scroll to watch 11:47 pm</span><button type="button" data-go="#launch">skip the story</button></div>
      </div></div>

    <svg id="pencil" viewBox="0 0 30 30"><path d="M4 26 L7 18 L22 3 L27 8 L12 23 Z" fill="#F1E5AE" stroke="#1E1D1A" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 26 L7 18 L12 23 Z" fill="#26292E"/></svg>
    <div id="chip">x = 4</div>
    <div class="cur" id="you"><svg><use href="#arrow" fill="#fff"/></svg><i class="ring" id="ring"></i><span class="tag">you</span></div>
    <div class="cur" id="neb"><svg><use href="#arrow" fill="#6B4EE6"/></svg><span class="tag">neb</span><span class="bub" id="bub"></span></div>
  </div></div>

  <div id="rw"><div class="band" id="rwband"></div><div class="lbl">◀◀ REWIND</div></div>
  <div id="end"><div class="lock"><svg class="mk"><use href="#mk"/></svg><svg class="wm"><use href="#wm"/></svg></div><h2>Don't just get the answer. Learn it.</h2><button class="btn go" data-go="#setup">join the waitlist</button></div>
  <div id="cap" aria-live="polite"><span id="capt"></span></div>
  <div id="tbar"><i id="prog"></i><div id="tasks"><span class="tbtn" id="start"><svg><use href="#mk"/></svg>neb</span></div><button class="tbtn" id="join" data-go="#setup">join waitlist</button><span id="clock">11:47 PM</span></div>
</div>
</section>
<ol class="sr" aria-label="the story above, in words"><li>11:47 pm, homework due at 8.</li><li>the answer gets copied from an app.</li><li>8:02 am pop quiz: nothing stuck.</li><li>rewind to the same night.</li><li>something is different. we can't show it yet.</li><li>8:02 am: this time, it stayed.</li></ol>

<main class="after">
  <section class="band" id="launch"><div class="wrap">
    <p class="kick">LAUNCH_FILM.MP4</p>
    <h2 class="big">Watch it on launch day.</h2>
    <div class="bigtab"><div class="scr"><div class="film"></div>
      <video class="film-vid" id="loopv" muted loop playsinline preload="none" aria-hidden="true"></video>
      <div class="win" id="ldlg"><div class="tb"><svg class="ti"><use href="#mk" style="color:#fff"/></svg><b id="ltitle">launch_film.mp4</b><span class="ctl"><i>×</i></span></div>
        <div class="dlg-b"><p id="ltext">coming soon. join the waitlist and you'll see it first.</p><div class="row"><button class="btn go" type="button" data-go="#setup" id="b-notify">get notified</button><button class="btn" type="button" id="b-play">▶ play teaser</button></div></div></div>
    </div></div>

    <div class="setup" id="setup">
      <div class="win wiz"><div class="tb"><svg class="ti"><use href="#mk" style="color:#fff"/></svg><b>neb setup</b><span class="ctl"><i>_</i><i>×</i></span></div>
        <div class="wizb"><div class="side"><svg><use href="#mk"/></svg><span>setup · step 1 of 1</span></div>
          <div class="main" id="wz">
            <h3>Welcome to neb setup.</h3>
            <p>This puts you on the waitlist. We'll email you once, on launch day, with your invite.</p>
            <form id="f-wiz" novalidate><label for="e-wiz">your email</label>
              <div class="wl"><input id="e-wiz" type="email" placeholder="you@school.edu" autocomplete="email" required></div>
              <p class="priv"><span>ⓘ</span><span>neb only looks when you ask. your notes stay yours. we only email you about neb.</span></p>
              <div class="wbtns"><button class="btn" type="button" disabled>&lt; back</button><button class="btn go" id="b-wiz">install &gt;</button><button class="btn" type="button" id="cancel">cancel</button></div>
            </form>
          </div></div></div>
    </div>

    <div class="notes">
      <div class="win"><div class="tb sand"><b>from_the_founders.txt</b><span class="ctl"><i>_</i><i>×</i></span></div>
        <div class="pad"><p>hey, we're faraz, rahbir and rubaiya.</p><p>every AI we used gave us the answer. <mark>none of it stayed.</mark></p><p>so we're building neb, a tutor that lives in your notebook and won't let you skip the thinking.</p><p>it's early. join the waitlist and you'll be first in.</p>
          <div class="sig"><span class="avs"><span class="av">f</span><span class="av">r</span><span class="av">r</span></span><span>faraz, rahbir &amp; rubaiya<br>founders</span><b>neb</b></div></div></div>
      <div class="win"><div class="tb teal"><b>readme.txt</b><span class="ctl"><i>_</i><i>×</i></span></div>
        <div class="pad faq">
          <details open><summary>what is neb?</summary><p>a tutor that makes sure you learn it, not just get it.</p></details>
          <details><summary>will it do my homework?</summary><p>no. that's the point.</p></details>
          <details><summary>who is it for?</summary><p>anyone who learns with a pen.</p></details>
          <details><summary>when does it launch?</summary><p>soon. the waitlist gets in first.</p></details>
          <details><summary>is my data private?</summary><p>neb only looks when you ask, and your notes stay yours.</p></details>
        </div></div>
    </div>
  </div></section>
  <footer><svg class="mk"><use href="#mk"/></svg><p class="see">See you on launch day.</p><nav><a href="/privacy">privacy</a><a href="https://www.instagram.com/neb_2026/" target="_blank" rel="noopener">instagram</a><a href="#">x</a><a href="#">tiktok</a></nav>© 2026 neb</footer>
</main>

`;
