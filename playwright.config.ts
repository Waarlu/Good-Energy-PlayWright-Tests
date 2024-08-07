import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 8,
  retries: 1,
  timeout: 3 * 60 * 500,
  reporter: [
    ["junit", { outputFile: "test-results/e2e-junit-results.xml" }],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],

  use: {
    screenshot: "only-on-failure",
    video: "on-first-retry",
    testIdAttribute: "data-cy",
    baseURL: 'https://new-works-api.internal.uat.igloo.energy',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});


