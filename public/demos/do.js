// do_it.exe: neb renames the photos one by one, then "◀◀ replay" shows the path it took.
// "save this recipe" flies the card into the recipe book.
export function init(stage, api) {
  const $ = (s) => stage.querySelector(s);
  const files = [...stage.querySelectorAll(".files li")], rename = $(".rename"), save = $(".save"), replay = $(".replay");
  const cur = $(".ncur"), trail = $(".trail"), line = trail.querySelector("polyline"), recipe = $(".recipe"), folder = $(".folder"), count = $(".count");
  let path = [], busy = false, renamed = false;

  const rel = (el, fx = 0.9, fy = 0.6) => {
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * fy };
  };
  async function moveTo(p, ms = 420) {
    cur.style.transition = `transform ${api.RM ? 0 : ms}ms cubic-bezier(.3,.7,.2,1), opacity .2s`;
    cur.style.transform = `translate(${p.x}px, ${p.y}px)`;
    cur.classList.add("on");
    await api.wait(ms);
  }

  rename.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    if (renamed) {
      files.forEach((li) => { li.classList.remove("renamed"); li.querySelector(".new").textContent = ""; });
      renamed = false; replay.hidden = true; rename.textContent = "rename by date"; busy = false;
      api.live(stage, "back to the messy names.");
      return;
    }
    path = [];
    for (const li of files) {
      const p = rel(li);
      path.push(p);
      await moveTo(p);
      li.classList.add("renamed");
      li.querySelector(".new").textContent = li.dataset.new;
      api.sound("click");
      await api.wait(260);
    }
    cur.classList.remove("on");
    renamed = true; busy = false;
    stage.classList.add("used");
    stage.dataset.renamed = "1";
    rename.textContent = "reset";
    replay.hidden = false;
    api.live(stage, "renamed 3 photos by date. press replay to see what neb did.");
  });

  replay.addEventListener("click", async () => {
    if (busy || !path.length) return;
    busy = true;
    const s = stage.getBoundingClientRect();
    trail.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
    const start = { x: s.width - 30, y: s.height - 70 };
    const pts = [start];
    line.setAttribute("points", "");
    trail.classList.add("on");
    cur.style.transition = "none";
    cur.style.transform = `translate(${start.x}px, ${start.y}px)`;
    void cur.offsetWidth;
    for (const p of path) {
      pts.push(p);
      line.setAttribute("points", pts.map((v) => `${v.x},${v.y}`).join(" "));
      await moveTo(p, 600);
    }
    api.live(stage, "replay: neb went to each photo and renamed it by the date it was taken.");
    await api.wait(700);
    trail.classList.remove("on");
    cur.classList.remove("on");
    busy = false;
  });

  save.addEventListener("click", async () => {
    if (recipe.classList.contains("fly")) return;
    const a = rel(recipe, 0.5, 0.5), b = rel(folder, 0.3, 0.5);
    recipe.style.setProperty("--fx", `${b.x - a.x}px`);
    recipe.style.setProperty("--fy", `${b.y - a.y}px`);
    recipe.classList.add("fly");
    await api.wait(650);
    count.textContent = String(+count.textContent + 1);
    folder.classList.remove("bump"); void folder.offsetWidth; folder.classList.add("bump");
    api.sound("pop");
    stage.classList.add("used");
    stage.dataset.saved = count.textContent;
    api.live(stage, `saved nonna's pasta to your recipe book. it has ${count.textContent} recipes now.`);
    await api.wait(1200);
    recipe.classList.remove("fly");
  });
}
