import { expect, test, type Page } from "@playwright/test";

const MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test("loads with the new headline and no console errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page).toHaveTitle("neb — your cursor, but it understands");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("your cursor, but it understands.");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("waitlist only: both CTAs are waitlist forms and nothing offers the installer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#f-hero")).toBeVisible();
  await expect(page.locator("#f-final")).toBeVisible();
  await expect(page.locator('a[href*="/download"], a[href$=".exe"], a[href$=".msi"]')).toHaveCount(0);
});

test("a Mac visitor still gets the waitlist and is told mac is coming", async ({ browser }) => {
  const page = await (await browser.newContext({ userAgent: MAC_UA })).newPage();
  await page.goto("/");
  await expect(page.locator("#f-hero")).toBeVisible();
  await expect(page.locator("#m-hero")).toContainText("mac coming soon");
});

test("hero and final forms send their own source", async ({ page }) => {
  const sources: string[] = [];
  await page.route("**/api/waitlist", async (route) => {
    sources.push(JSON.parse(route.request().postData() ?? "{}").source);
    await route.fulfill({ status: 201, body: '{"ok":true}' });
  });
  await page.goto("/");
  await page.fill("#e-hero", "a@example.com");
  await page.click("#b-hero");
  await expect(page.locator(".hero .done")).toContainText("you're on the list");
  await page.fill("#e-final", "b@example.com");
  await page.click("#b-final");
  await expect(page.locator(".final .done")).toBeVisible();
  expect(sources).toEqual(["hero", "final_cta"]);
});

test("only circle_and_ask is available now", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".badge")).toHaveCount(4);
  await expect(page.locator(".badge.now")).toHaveCount(1);
  await expect(page.locator("#ft-circle .badge")).toHaveText("available now");
  for (const id of ["#ft-show", "#ft-catch", "#ft-do"]) await expect(page.locator(`${id} .badge`)).toHaveText("in development");
});

test("reduced motion: scenes never start and loops stay paused", async ({ browser }) => {
  const page = await (await browser.newContext({ reducedMotion: "reduce" })).newPage();
  await page.goto("/");
  await page.locator("#ft-do").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(page.locator(".on")).toHaveCount(0);
  const playing = await page.$$eval("video.loop", (vs) => vs.filter((v) => !(v as HTMLVideoElement).paused).length);
  expect(playing).toBe(0);
});

test("no horizontal scroll at 390px", async ({ browser }) => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("film lightbox: opens with captions, Esc closes and focus returns", async ({ page }) => {
  await page.goto("/");
  test.skip((await page.locator("#b-film").count()) === 0, "film not encoded yet (scripts/encode-ad.sh)");
  await page.click("#b-film");
  await expect(page.locator("#lb")).toBeVisible();
  expect(await page.$eval("#lbv", (v) => (v as HTMLVideoElement).textTracks[0]?.mode)).toBe("showing");
  await page.keyboard.press("Escape");
  await expect(page.locator("#lb")).toBeHidden();
  await expect(page.locator("#b-film")).toBeFocused();
});
