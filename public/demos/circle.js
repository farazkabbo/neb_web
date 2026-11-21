// circle_and_ask.exe: hold Alt (or turn on ✎ circle) and draw a loop; neb answers with scripted
// labels. Keyboard: Tab to a part of the formula, Enter circles it, Esc clears.
const Q = { en: "what does this mean?", bn: "এটার মানে কী?", fr: "ça veut dire quoi ?" };
const ANSWERS = {
  fv: { text: "FV is the future value: what the money is worth later. here, $1,100 after 2 years.", labels: [["fv", "future value"]] },
  pv: { text: "PV is the present value: what it's worth today. work back from FV and you get $1,000.", labels: [["pv", "present value"]] },
  den: { text: "1 + rt is the growth: 1 plus the interest added. 1 + 0.05 × 2 = 1.10.", labels: [["den", "interest added"]] },
  rt: { text: "rt is the rate times the time: 5% a year for 2 years is 0.05 × 2 = 0.10.", labels: [["rt", "rate × time"]] },
  formula: {
    text: "divide what the money will be worth by the interest it gains, and you get what it's worth today.",
    labels: [["pv", "present value"], ["den", "interest added"]],
  },
  ex: { text: "plug them in: 1,100 / (1 + 0.05 × 2) = 1,100 / 1.10 = $1,000 today.", labels: [["ex", "your numbers"]] },
};
const FALLBACK = "in the real app, neb explains anything you circle.";
const NS = "http://www.w3.org/2000/svg";

export function init(stage, api) {
  const page = stage.querySelector(".page");
  const cv = page.querySelector("canvas.ink");
  const ctx = cv.getContext("2d");
  const ann = page.querySelector("svg.ann");
  const q = page.querySelector(".q");
  const qt = q.querySelector(".qt");
  const a = page.querySelector(".a");
  const cur = page.querySelector(".ncur");
  const pen = stage.querySelector(".pen");
  let lang = "en", penOn = false, drawing = false, pts = [], run = 0;

  const size = () => {
    const r = page.getBoundingClientRect(), d = devicePixelRatio || 1;
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ann.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
    if (pts.length) paint(pts);
  };
  new ResizeObserver(size).observe(page);
  size();

  const at = (e) => { const r = page.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const box = (p) => {
    const xs = p.map((v) => v.x), ys = p.map((v) => v.y);
    return { l: Math.min(...xs), t: Math.min(...ys), r: Math.max(...xs), b: Math.max(...ys) };
  };
  const rectOf = (el) => {
    const r = el.getBoundingClientRect(), s = page.getBoundingClientRect();
    return { l: r.left - s.left, t: r.top - s.top, r: r.right - s.left, b: r.bottom - s.top };
  };

  function paint(p) {
    const r = page.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    if (p.length < 2) return;
    const b = box(p);
    const g = ctx.createLinearGradient(b.l, b.t, b.r + 1, b.b + 1);
    g.addColorStop(0, "#7C5CF0"); g.addColorStop(0.55, "#F06BA8"); g.addColorStop(1, "#4E95F5");
    ctx.strokeStyle = g; ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < p.length - 1; i++) {
      const m = { x: (p[i].x + p[i + 1].x) / 2, y: (p[i].y + p[i + 1].y) / 2 };
      ctx.quadraticCurveTo(p[i].x, p[i].y, m.x, m.y);
    }
    ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
    ctx.stroke();
  }

  function clear() {
    run++; pts = []; paint([]); ann.replaceChildren(); q.hidden = true; a.hidden = true; cur.classList.remove("on");
  }

  /** The target the loop is around: most of the target inside, and the loop not much bigger. */
  function pick(b) {
    const bArea = Math.max(1, (b.r - b.l) * (b.b - b.t));
    let best = null, score = 0.06;
    for (const el of page.querySelectorAll(".t")) {
      const t = rectOf(el), tArea = (t.r - t.l) * (t.b - t.t);
      const iw = Math.min(b.r, t.r) - Math.max(b.l, t.l), ih = Math.min(b.b, t.b) - Math.max(b.t, t.t);
      if (iw <= 0 || ih <= 0) continue;
      const cover = (iw * ih) / tArea;
      const s = cover >= 0.6 ? cover * Math.min(1, tArea / bArea) : 0;
      if (s > score) { score = s; best = el.dataset.t; }
    }
    return best;
  }

  function label(key, text, i) {
    const el = page.querySelector(`[data-t="${key}"]`);
    if (!el) return;
    // labels sit under the target (the gap under the formula is kept for them), staggered
    const t = rectOf(el), cx = (t.l + t.r) / 2, above = key === "ex";
    const ly = above ? t.t - 30 : t.b + 26 + (i % 2) * 28, w = text.length * 8.2 + 16;
    const lx = Math.max(6, Math.min(cx - w / 2, page.clientWidth - w - 6));
    const g = document.createElementNS(NS, "g");
    g.innerHTML = `<path pathLength="1" d="M${cx} ${above ? ly + 10 : ly - 12} L${cx} ${above ? t.t - 4 : t.b + 4} M${cx - 5} ${above ? t.t - 10 : t.b + 10} L${cx} ${above ? t.t - 4 : t.b + 4} L${cx + 5} ${above ? t.t - 10 : t.b + 10}"/><rect x="${lx}" y="${ly - 13}" width="${w}" height="24" rx="4"/><text x="${lx + 8}" y="${ly + 4}"></text>`;
    g.querySelector("text").textContent = text;
    g.style.animationDelay = `${i * 220}ms`;
    ann.append(g);
  }

  async function answer(key, b) {
    const my = ++run;
    stage.classList.add("used");
    const s = page.getBoundingClientRect();
    cur.style.transition = "none";
    cur.style.transform = `translate(${s.width + 30}px, ${s.height - 20}px)`;
    void cur.offsetWidth;
    cur.style.transition = "";
    cur.classList.add("on");
    cur.style.transform = `translate(${Math.min(b.r + 6, s.width - 40)}px, ${Math.min(b.b + 4, s.height - 60)}px)`;
    qt.textContent = Q[lang]; q.lang = lang === "en" ? "en" : lang; q.hidden = false;
    api.sound("pop");
    await api.wait(650);
    if (my !== run) return;
    const ans = key && ANSWERS[key];
    if (ans) ans.labels.forEach(([k, t], i) => label(k, t, i));
    a.innerHTML = "";
    a.append(ans ? ans.text : FALLBACK);
    if (ans) { const chip = document.createElement("span"); chip.className = "chip"; chip.textContent = "saved → finance · ch 3"; a.append(" ", chip); }
    a.hidden = false;
    stage.dataset.answer = key || "none";
    api.live(stage, `neb: ${ans ? ans.text : FALLBACK}`);
  }

  function finish() {
    if (pts.length < 4) return clear();
    const b = box(pts);
    if (b.r - b.l < 18 && b.b - b.t < 18) return clear();
    answer(pick(b), b);
  }

  // drawing
  const armed = (e) => e.altKey || penOn;
  page.addEventListener("pointerdown", (e) => {
    if (!armed(e) || e.button > 0) return;
    e.preventDefault();
    clear(); drawing = true; pts = [at(e)];
    page.setPointerCapture(e.pointerId);
  });
  page.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = at(e), l = pts[pts.length - 1];
    if (Math.hypot(p.x - l.x, p.y - l.y) > 2) { pts.push(p); paint(pts); }
  });
  const end = () => { if (drawing) { drawing = false; finish(); } };
  page.addEventListener("pointerup", end);
  page.addEventListener("pointercancel", end);

  // Alt shows a crosshair; stop Alt from opening the browser menu while over the demo.
  let over = false;
  page.addEventListener("pointerenter", () => { over = true; });
  page.addEventListener("pointerleave", () => { over = false; stage.classList.remove("alt"); });
  addEventListener("keydown", (e) => { if (e.key === "Alt" && over) { e.preventDefault(); stage.classList.add("alt"); } });
  addEventListener("keyup", (e) => { if (e.key === "Alt") { if (over) e.preventDefault(); stage.classList.remove("alt"); } });

  pen.addEventListener("click", () => {
    penOn = !penOn;
    pen.setAttribute("aria-pressed", String(penOn));
    stage.classList.toggle("armed", penOn);
    api.live(stage, penOn ? "circle mode on. draw a loop around anything." : "circle mode off.");
  });

  // keyboard: Enter on a part draws a loop around it
  async function circleEl(el) {
    clear();
    const my = run, t = rectOf(el), cx = (t.l + t.r) / 2, cy = (t.t + t.b) / 2;
    const rx = (t.r - t.l) / 2 + 12, ry = (t.b - t.t) / 2 + 10, all = [];
    for (let i = 0; i <= 28; i++) {
      const k = (i / 28) * Math.PI * 2.1 - 0.4;
      all.push({ x: cx + Math.cos(k) * rx, y: cy + Math.sin(k) * ry });
    }
    for (let i = 2; i <= all.length; i += 3) {
      if (my !== run) return;
      pts = all.slice(0, i); paint(pts);
      await api.wait(14);
    }
    pts = all; paint(pts);
    answer(el.dataset.t, box(all));
  }
  page.addEventListener("keydown", (e) => {
    const el = e.target.closest(".t[tabindex]");
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); circleEl(el); }
    if (e.key === "Escape" && (pts.length || !a.hidden)) { e.preventDefault(); clear(); api.live(stage, "cleared."); }
  });

  stage.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      stage.querySelectorAll("[data-lang]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      qt.textContent = Q[lang]; q.lang = lang;
      if (q.hidden) { q.hidden = false; }
      api.sound("click");
    }),
  );
}
