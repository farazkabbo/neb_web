import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test, type Page, type Route } from "@playwright/test";

const OPEN = "http://localhost:3124/";
const MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const FIX = path.join(__dirname, "fixtures");

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** Serve the small fixture film in place of the real ad (Playwright's Chromium has no H.264). */
async function fixtureFilm(page: Page) {
  await page.route(/\/media\/.*\.mp4$/, (r) => r.abort());
  await page.route(/\/media\/hero-loop\.webm$/, (r) => r.fulfill({ path: path.join(FIX, "loop.webm"), contentType: "video/webm" }));
  await page.route(/\/media\/neb-ad\.webm$/, (r) => ranged(r, path.join(FIX, "film.webm")));
  await page.route(/\/media\/.*\.jpg$/, (r) => r.fulfill({ path: path.join(FIX, "poster.jpg"), contentType: "image/jpeg" }));
  await page.route(/\/media\/neb-ad\.en\.vtt$/, (r) => r.fulfill({ path: path.join(FIX, "film.vtt"), contentType: "text/vtt" }));
}

/** A byte-range response, so the browser can seek in the fixture like it can on a real server. */
async function ranged(route: Route, file: string) {
  const buf = readFileSync(file), size = buf.length;
  const m = /bytes=(\d+)-(\d*)/.exec(route.request().headers()["range"] ?? "");
  const start = m ? +m[1] : 0, end = m && m[2] ? Math.min(+m[2], size - 1) : size - 1;
  await route.fulfill({
    status: m ? 206 : 200,
    headers: { "Content-Type": "video/webm", "Accept-Ranges": "bytes", "Content-Length": String(end - start + 1), ...(m ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}) },
    body: buf.subarray(start, end + 1),
  });
}

const isMobile = (name: string) => name === "mobile";

test.describe("the page", () => {
  test("loads with the headline and no console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle("neb — your cursor, but it understands");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("your cursor, but it understands.");
    for (const id of ["#w-circle", "#w-show", "#w-catch", "#w-do"]) await page.locator(id).scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".stage.ready")).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test("only circle & ask says available now", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#w-circle .badge")).toHaveText("available now");
    const others = page.locator('[data-feature]:not([data-feature="circle_and_ask"])');
    await expect(others).toHaveCount(3);
    for (const t of await others.locator(".badge").allTextContents()) expect(t).toBe("in development");
    await expect(page.getByText("available now", { exact: true })).toHaveCount(1);
  });

  test("pro is hidden in waitlist mode, shown only when open + billing", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#b-pro")).toHaveCount(0);
    await expect(page.getByText("$19")).toHaveCount(0);
    await page.goto(OPEN);
    await expect(page.locator("#b-pro")).toHaveCount(1);
  });

  test("one school example only", async ({ page }) => {
    await page.goto("/");
    expect((await page.textContent("body")) ?? "").not.toMatch(/derivative|photosynthesis|calculus/i);
    await expect(page.getByText("PV = FV / (1 + rt)")).toHaveCount(1);
  });

  test("waitlist mode: forms, no installer link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#f-hero")).toBeVisible();
    await expect(page.locator("#f-final")).toHaveCount(1);
    await expect(page.locator('a[href*="/download"]')).toHaveCount(0);
  });

  test("open mode: windows gets the download, mac gets coming soon", async ({ page, browser }, info) => {
    await page.goto(OPEN);
    if (isMobile(info.project.name)) await expect(page.locator("#cta-hero")).toContainText("neb is for windows computers");
    else await expect(page.locator("#cta-hero a.btn")).toHaveText("get neb for windows");
    const mac = await (await browser.newContext({ userAgent: MAC_UA })).newPage();
    await mac.goto(OPEN);
    await expect(mac.locator("#cta-hero")).toContainText("mac is coming soon");
    await expect(mac.locator("#f-mac-hero")).toBeVisible();
  });

  test("no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(sw).toBe(w);
  });

  test("desktop icons open their window", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "icons are desktop only");
    await page.goto("/");
    await page.locator('.icon[data-open="w-faq"]').dblclick();
    await expect(page.locator("#w-faq")).toBeFocused();
    await expect(page.locator("#w-faq")).toBeInViewport();
  });
});

test.describe("demos", () => {
  test("circle & ask: keyboard circles FV and neb labels it", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator('[data-demo="circle"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator('[data-t="fv"]').focus();
    await page.keyboard.press("Enter");
    await expect(stage).toHaveAttribute("data-answer", "fv");
    await expect(stage.locator(".a")).toContainText("future value");
    await expect(stage.locator("svg.ann text")).toHaveText(["future value"]);
    await stage.locator('[data-lang="fr"]').click();
    await expect(stage.locator(".qt")).toHaveText("ça veut dire quoi ?");
    await page.keyboard.press("Escape");
  });

  test("circle & ask: alt + drag a loop around the formula's FV", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "alt + drag is the desktop path");
    await page.goto("/");
    const stage = page.locator('[data-demo="circle"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    const b = (await stage.locator('[data-t="fv"]').boundingBox())!;
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2, rx = b.width / 2 + 14, ry = b.height / 2 + 12;
    await page.keyboard.down("Alt");
    await page.mouse.move(cx + rx, cy);
    await page.mouse.down();
    for (let i = 1; i <= 24; i++) {
      const k = (i / 24) * Math.PI * 2;
      await page.mouse.move(cx + Math.cos(k) * rx, cy + Math.sin(k) * ry);
    }
    await page.mouse.up();
    await page.keyboard.up("Alt");
    await expect(stage).toHaveAttribute("data-answer", "fv");
  });

  test("circle & ask: a loop around nothing gets the fallback", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator('[data-demo="circle"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator(".pen").click();
    const p = (await stage.locator(".page").boundingBox())!;
    const cx = p.x + p.width * 0.7, cy = p.y + p.height * 0.72;
    await page.mouse.move(cx + 30, cy);
    await page.mouse.down();
    for (let i = 1; i <= 16; i++) await page.mouse.move(cx + Math.cos((i / 16) * 6.3) * 30, cy + Math.sin((i / 16) * 6.3) * 20);
    await page.mouse.up();
    await expect(stage.locator(".a")).toHaveText("in the real app, neb explains anything you circle.");
  });

  test("show me: back, uploads, logo, done", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator('[data-demo="show"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator('[data-side="back"]').click();
    await stage.locator('[data-tool="uploads"]').click();
    await stage.locator(".logo-item").click();
    await expect(stage.locator(".done-card")).toBeVisible();
    await expect(stage.locator(".done-card")).toContainText("done. you did that.");
    await expect(stage.locator(".steps i.ok")).toHaveCount(3);
  });

  test("show me: heading for the wrong tool lights up the right one", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "pointer prediction is mouse only");
    await page.goto("/");
    const stage = page.locator('[data-demo="show"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator('[data-side="back"]').click(); // next: uploads
    const t = (await stage.locator('[data-tool="layers"]').boundingBox())!;
    await page.mouse.move(t.x + 260, t.y + t.height / 2);
    await page.mouse.move(t.x + 100, t.y + t.height / 2, { steps: 6 });
    await expect(stage.locator('[data-tool="uploads"]')).toHaveClass(/glow/);
    await expect(stage.locator(".pill")).toHaveClass(/show/);
  });

  test("catch me: the alert shows before the click, as the pointer slows near run", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "approach is mouse only; mobile is the next test");
    await page.goto("/");
    const stage = page.locator('[data-demo="catch"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    const b = (await stage.locator("#cp-term .run").boundingBox())!;
    const tx = b.x + b.width / 2, ty = b.y + b.height / 2;
    await page.mouse.move(tx + 300, ty - 160);
    for (const [k, gap] of [[0.55, 20], [0.7, 40], [0.8, 60], [0.86, 90], [0.9, 120]] as const) {
      await page.mouse.move(tx + 300 * (1 - k), ty - 160 * (1 - k));
      await page.waitForTimeout(gap);
    }
    await expect(stage.locator(".alert")).toBeVisible();
    await expect(stage.locator(".alert p")).toHaveText("this deletes every customer. you're on prod, not test.");
    await expect(stage).toHaveAttribute("data-runs", "0");
    await page.keyboard.press("Escape");
    await expect(stage.locator(".alert")).toBeHidden();
  });

  test("catch me: the first tap / Enter on run shows the alert instead of running", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator('[data-demo="catch"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator("#cp-term .run").focus();
    await page.keyboard.press("Enter");
    await expect(stage.locator(".alert")).toBeVisible();
    await expect(stage).toHaveAttribute("data-runs", "0");
    await stage.locator(".anyway").click();
    await expect(stage.locator(".alert p")).toHaveText("nothing happened — it's a demo 😅");
    await stage.locator(".cancel").click();
    await stage.locator("#ct-mail").click();
    await stage.locator("#cp-mail .run").click();
    await expect(stage.locator(".alert p")).toContainText("nothing is attached");
  });

  test("do it: renames, replays, saves the recipe", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator('[data-demo="do"]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/ready/);
    await stage.locator(".rename").click();
    await expect(stage).toHaveAttribute("data-renamed", "1", { timeout: 6000 });
    await expect(stage.locator(".files .new")).toHaveText(["2026-06-14_beach.jpg", "2026-06-14_sunset.jpg", "2026-06-15_market.jpg"]);
    await expect(stage.locator(".replay")).toBeVisible();
    await stage.locator(".replay").click();
    await stage.locator(".save").click();
    await expect(stage).toHaveAttribute("data-saved", "4");
  });
});

test.describe("film", () => {
  test("plays from the big button, and seeks to each chapter from its window", async ({ page }) => {
    await fixtureFilm(page);
    await page.goto(OPEN);
    await page.click("#b-film");
    const film = page.locator("#film");
    await expect(film).toBeVisible();
    await expect.poll(() => film.evaluate((v: HTMLVideoElement) => !v.paused && !v.muted)).toBe(true);
    expect(await film.evaluate((v: HTMLVideoElement) => v.textTracks[0]?.mode)).toBe("showing");
    for (const [id, at] of [["circle", 10], ["show", 19], ["catch", 29], ["do", 37]] as const) {
      await page.locator(`[data-seek="${id}"]`).click();
      await expect.poll(() => film.evaluate((v: HTMLVideoElement) => Math.floor(v.currentTime))).toBeGreaterThanOrEqual(at);
      await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(at + 4);
      await expect(page.locator(`.feat[data-chapter="${id}"]`)).toHaveClass(/glow/);
      await expect(page.locator(`.mark[data-chapter="${id}"]`)).toHaveClass(/lit/);
    }
  });

  test("reduced motion: the loop never plays", async ({ browser }) => {
    const page = await (await browser.newContext({ reducedMotion: "reduce" })).newPage();
    await fixtureFilm(page);
    await page.goto(OPEN);
    await page.waitForTimeout(800);
    expect(await page.locator("#loop").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });
});
