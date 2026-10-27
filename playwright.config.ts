import { defineConfig, devices } from '@playwright/test';

// Set CHROMIUM_PATH to use a browser that is already installed instead of the one Playwright downloads.
const executablePath = process.env.CHROMIUM_PATH || undefined;
const FORM_ENDPOINT = 'https://forms.example.test/submit';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
  ],
  // Two builds of the same site: one with a contact form endpoint, one without.
  webServer: [
    {
      command: 'npx vite build && npx vite preview --port 4173 --strictPort',
      env: { VITE_FORM_ENDPOINT: FORM_ENDPOINT },
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command:
        'npx vite build --outDir dist-noform && npx vite preview --outDir dist-noform --port 4174 --strictPort',
      env: { VITE_FORM_ENDPOINT: '' },
      url: 'http://localhost:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
