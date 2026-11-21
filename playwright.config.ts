import { defineConfig } from "@playwright/test";

// Runs against a production build: `npm run build && npm run test:e2e`.
// PW_CHROMIUM can point at an already-installed Chromium instead of `npx playwright install`.
export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: "http://localhost:3123",
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: { command: "npx next start -p 3123", url: "http://localhost:3123", reuseExistingServer: true },
});
