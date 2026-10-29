import { defineConfig } from '@playwright/test';
import { baseConfig } from './specs/e2e/playwright.base';

export default defineConfig({
  ...baseConfig,
  testDir: './specs/e2e',
  use: {
    ...baseConfig.use,
    // The suite targets the RealWorld (Conduit) demo app, not therealworld.net (a course site).
    // Override with BASE_URL if you host your own frontend.
    baseURL: process.env.BASE_URL || 'https://demo.realworld.show',
  },
  reporter: [['@muuktest/amikoo-reporter']],
});
