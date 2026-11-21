// catch_me.sys: as the pointer closes in on "run" and slows down, neb steps in before the click.
// The button is guarded too: a click, tap or Enter that gets there first shows the alert instead.
const MSG = {
  term: "this deletes every customer. you're on prod, not test.",
  mail: "you wrote “attached”, but nothing is attached.",
};
const ANYWAY = { term: "run anyway", mail: "send anyway" };

export function init(stage, api) {
  const tabs = [...stage.querySelectorAll('[role="tab"]')], panes = [...stage.querySelectorAll('[role="tabpanel"]')];
  const alert = stage.querySelector(".alert"), msg = alert.querySelector("p"), cancel = alert.querySelector(".cancel"), anyway = alert.querySelector(".anyway");
  const cur = stage.querySelector(".ncur"), ring = stage.querySelector(".ring"), ell = ring.querySelector("ellipse");
  let pane = panes[0], caught = false, cool = false, samples = [];
  const kind = () => pane.dataset.kind;
  const runBtn = () => pane.querySelector(".run");
  stage.dataset.runs = "0";

  function select(tab) {
    reset();
    tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
    panes.forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    pane = panes.find((p) => !p.hidden);
    api.sound("click");
  }
  tabs.forEach((t) => t.addEventListener("click", () => select(t)));
  stage.querySelector('[role="tablist"]').addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    select(n); n.focus();
  });

  async function catchIt(how) {
    if (caught) return;
    caught = true;
    stage.dataset.state = "caught";
    api.sound("warn");
    const s = stage.getBoundingClientRect(), t = pane.querySelector(".target").getBoundingClientRect();
    const cx = t.left - s.left + t.width / 2, cy = t.top - s.top + t.height / 2;
    ring.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
    ell.setAttribute("cx", cx); ell.setAttribute("cy", cy);
    ell.setAttribute("rx", t.width / 2 + 14); ell.setAttribute("ry", t.height / 2 + 12);
    cur.style.transition = "none";
    cur.style.transform = `translate(${s.width + 20}px, -30px)`;
    void cur.offsetWidth;
    cur.style.transition = "";
    cur.classList.add("on");
    cur.style.transform = `translate(${t.right - s.left + 4}px, ${t.bottom - s.top}px)`;
    ring.classList.add("on");
    // the alert shows at once (it has to beat the click); the cursor and ring animate around it
    msg.textContent = MSG[kind()];
    anyway.textContent = ANYWAY[kind()];
    anyway.hidden = false;
    cancel.textContent = "cancel";
    alert.hidden = false;
    api.live(stage, `neb stopped you: ${MSG[kind()]}`);
    if (how !== "approach") cancel.focus({ preventScroll: true });
  }

  function reset() {
    caught = false;
    delete stage.dataset.state;
    alert.hidden = true;
    ring.classList.remove("on");
    cur.classList.remove("on");
    samples = [];
  }

  // guard: the run button never runs unless neb has had its say
  stage.addEventListener("click", (e) => {
    const b = e.target.closest(".run");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    if (!caught) catchIt("click");
  }, true);

  cancel.addEventListener("click", () => {
    const hadFocus = alert.contains(document.activeElement);
    reset(); cool = true;
    api.live(stage, "cancelled. nothing ran.");
    if (hadFocus) runBtn().focus({ preventScroll: true });
  });
  anyway.addEventListener("click", () => {
    stage.dataset.runs = String(+stage.dataset.runs + 1);
    msg.textContent = "nothing happened — it's a demo 😅";
    anyway.hidden = true;
    cancel.textContent = "ok";
    ring.classList.remove("on");
    stage.classList.add("used");
    api.live(stage, "nothing happened. it's a demo.");
    cancel.focus({ preventScroll: true });
  });
  // Esc closes the alert wherever focus is (capture, so it wins over "un-maximize").
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !alert.hidden) { e.preventDefault(); cancel.click(); }
  }, true);

  // the approach: within 120px of the button, getting closer and slowing down
  function onMove(e) {
    if (e.pointerType !== "mouse" || pane.hidden) return;
    const r = runBtn().getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    const d = Math.hypot(dx, dy), now = performance.now();
    if (cool) { if (d > 160) cool = false; return; }
    if (caught || d > 120) { samples = []; return; }
    if (d === 0) return catchIt("approach");
    samples.push({ d, x: e.clientX, y: e.clientY, t: now });
    samples = samples.filter((p) => now - p.t < 200);
    if (samples.length < 3) return;
    const sp = (a, b) => Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t);
    const n = samples.length, first = sp(samples[0], samples[1]), last = sp(samples[n - 2], samples[n - 1]);
    if (samples[n - 1].d < samples[0].d && last <= first) catchIt("approach");
  }
  let watching = false;
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !watching) { addEventListener("pointermove", onMove, { passive: true }); watching = true; }
    else if (!en.isIntersecting && watching) { removeEventListener("pointermove", onMove); watching = false; }
  }).observe(stage);
}
