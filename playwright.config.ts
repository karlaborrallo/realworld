import { defineConfig } from '@playwright/test';
import { baseConfig } from './specs/e2e/playwright.base';

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'https://therealworld.net/',
  },
  reporter: [['@muuktest/amikoo-reporter']],
});
