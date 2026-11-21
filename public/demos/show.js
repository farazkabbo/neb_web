// show_me.exe: put the logo on the back. A ghost path points at the next step; if the pointer is
// heading for the wrong tool (last ~100ms of movement), the right one glows. Each round helps less.
export function init(stage, api) {
  const $ = (s) => stage.querySelector(s), $$ = (s) => [...stage.querySelectorAll(s)];
  const tools = $$("[data-tool]"), sides = $$("[data-side]"), tee = $(".tee"), tray = $(".tray");
  const logo = $(".logo-item"), pill = $(".pill"), ghost = $(".ghost path"), steps = $$(".steps i"), done = $(".done-card");
  const uploads = tools.find((t) => t.dataset.tool === "uploads"), backBtn = sides[1];
  let step = 0, side = "front", placed = false, round = 0, pillT = 0;

  const want = () => (step >= 1 && side === "front" ? backBtn : [backBtn, uploads, logo][step]);
  const rel = (el) => {
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height };
  };

  function cue() {
    $$(".cue").forEach((el) => el.classList.remove("cue"));
    const t = step < 3 ? want() : null;
    if (t && round < 2) t.classList.add("cue");
    if (!t || round > 0) { ghost.setAttribute("d", ""); return; }
    const a = rel(tee), b = rel(t);
    const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 40;
    ghost.setAttribute("d", `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`);
  }
  new ResizeObserver(cue).observe(stage);

  function setSide(s) {
    side = s;
    sides.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.side === s)));
    stage.classList.toggle("back", s === "back");
    tee.setAttribute("aria-label", `a t-shirt, ${s} side${placed && s === "back" ? ", with the neb logo on it" : ""}`);
  }

  function advance(msg) {
    steps[step].classList.add("ok");
    step++;
    api.sound("ok");
    api.live(stage, `step ${step} of 3 done. ${msg}`);
    if (step === 3) finish(); else cue();
  }

  sides.forEach((b) => b.addEventListener("click", () => {
    setSide(b.dataset.side);
    if (step === 0 && side === "back") advance("now open uploads.");
    else cue();
  }));
  tools.forEach((b) => b.addEventListener("click", () => {
    if (b === uploads) {
      tray.hidden = false;
      if (step === 1) advance("now put the logo on the shirt.");
      else cue();
    } else {
      api.sound("click");
      nudge(b);
    }
  }));

  function place() {
    if (step !== 2) return;
    if (side !== "back") { nudge(logo); return; }
    placed = true;
    stage.classList.add("placed");
    setSide("back");
    advance("the logo is on the back.");
  }
  // click / Enter places it; dragging it onto the shirt does too
  let dragged = false;
  logo.addEventListener("click", () => { if (!dragged) place(); dragged = false; });
  logo.addEventListener("pointerdown", (e) => {
    if (e.button > 0) return;
    const sx = e.clientX, sy = e.clientY;
    let ghostEl = null;
    const mv = (ev) => {
      if (!ghostEl && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!ghostEl) { ghostEl = logo.cloneNode(true); ghostEl.className = "drag-logo"; document.body.append(ghostEl); dragged = true; }
      ghostEl.style.transform = `translate(${ev.clientX - 24}px, ${ev.clientY - 24}px)`;
    };
    const up = (ev) => {
      removeEventListener("pointermove", mv); removeEventListener("pointerup", up);
      if (!ghostEl) return;
      ghostEl.remove();
      const r = tee.getBoundingClientRect();
      if (ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom) place();
    };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  });

  // where is the pointer heading? the nearest button along its direction of travel
  let samples = [];
  stage.addEventListener("pointermove", (e) => {
    if (step >= 3 || e.pointerType !== "mouse") return;
    const s = stage.getBoundingClientRect(), now = performance.now();
    samples.push({ x: e.clientX - s.left, y: e.clientY - s.top, t: now });
    samples = samples.filter((p) => now - p.t < 110);
    if (samples.length < 3) return;
    const a = samples[0], b = samples[samples.length - 1], dt = b.t - a.t || 1;
    const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt, sp = Math.hypot(vx, vy);
    if (sp < 0.25) return;
    const ux = vx / sp, uy = vy / sp;
    let best = null, bestPerp = 34;
    for (const el of [...tools, ...sides, ...(tray.hidden ? [] : [logo])]) {
      const c = rel(el), dx = c.x - b.x, dy = c.y - b.y, along = dx * ux + dy * uy;
      if (along <= 4) continue;
      const perp = Math.abs(dx * uy - dy * ux);
      if (perp < bestPerp) { bestPerp = perp; best = el; }
    }
    const right = want();
    if (best && right && best !== right) nudge(best);
  });

  function nudge(wrong) {
    const right = want();
    if (!right) return;
    right.classList.remove("glow"); void right.offsetWidth; right.classList.add("glow");
    const a = rel(wrong), b = rel(right);
    pill.textContent = Math.abs(b.x - a.x) < 20 ? (b.y > a.y ? "one down" : "one up") : "over here";
    pill.style.left = `${b.x + b.w / 2 + 8}px`;
    pill.style.top = `${b.y - 14}px`;
    pill.classList.add("show");
    clearTimeout(pillT);
    pillT = setTimeout(() => { pill.classList.remove("show"); right.classList.remove("glow"); }, 1300);
  }

  function finish() {
    ghost.setAttribute("d", "");
    $$(".cue").forEach((el) => el.classList.remove("cue"));
    done.hidden = false;
    stage.classList.add("used");
    stage.dataset.done = "1";
    if (!api.RM) {
      for (let i = 0; i < 24; i++) {
        const c = document.createElement("i");
        c.className = "cf";
        c.style.setProperty("--x", `${Math.cos(i) * (60 + (i % 5) * 22)}px`);
        c.style.setProperty("--y", `${-50 - (i % 7) * 18}px`);
        c.style.setProperty("--r", `${i * 47}deg`);
        c.style.background = ["#7C5CF0", "#F06BA8", "#4E95F5", "#F1E5AE"][i % 4];
        done.append(c);
        setTimeout(() => c.remove(), 1100);
      }
    }
    api.live(stage, "done. you did that.");
    done.querySelector(".again").focus({ preventScroll: true });
  }

  done.querySelector(".again").addEventListener("click", () => {
    round++; step = 0; placed = false;
    stage.classList.remove("placed");
    steps.forEach((s) => s.classList.remove("ok"));
    done.hidden = true; tray.hidden = true;
    delete stage.dataset.done;
    setSide("front");
    cue();
    api.live(stage, round === 1 ? "again, with a little less help." : "again. you've got this.");
    backBtn.focus({ preventScroll: true });
  });

  setSide("front");
  cue();
}
