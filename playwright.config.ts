import { defineConfig, devices } from "@playwright/test";

// Runs against a production build: `npm run build && npm run test:e2e`.
// Two servers: 3123 is the page as it is today (waitlist, no film files); 3124 is launch day with
// billing on and the film window forced on (tests serve a small fixture film, tests/fixtures).
// PW_CHROMIUM can point at an already-installed Chromium instead of `npx playwright install`.
const launchOptions = process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:3123", launchOptions },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 }, launchOptions } },
  ],
  webServer: [
    {
      command: "npx next start -p 3123",
      url: "http://localhost:3123",
      reuseExistingServer: true,
      env: { LAUNCH_MODE: "waitlist", BILLING_ENABLED: "false", NEB_FORCE_FILM: "0" },
    },
    {
      command: "npx next start -p 3124",
      url: "http://localhost:3124",
      reuseExistingServer: true,
      env: { LAUNCH_MODE: "open", BILLING_ENABLED: "true", NEB_FORCE_FILM: "1" },
    },
  ],
});
