import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/hydration.spec.ts', '**/dev-sourcemaps.spec.ts'],
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'dev-reduced-motion', use: { reducedMotion: 'reduce' } },
    { name: 'dev-motion', use: { reducedMotion: 'no-preference' } },
  ],
  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
