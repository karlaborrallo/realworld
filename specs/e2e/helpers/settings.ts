import { Page } from '@playwright/test';

export interface SettingsUpdate {
  username?: string;
  email?: string;
  password?: string;
}

/**
 * Opens /settings, fills only the provided credential fields and submits the form.
 * Waits for the redirect to the profile page, which both modes (API and fullstack) perform on success.
 */
export async function updateCredentials(page: Page, updates: SettingsUpdate) {
  await page.goto('/settings', { waitUntil: 'load' });

  if (updates.username !== undefined) {
    await page.fill('input[name="username"]', updates.username);
  }
  if (updates.email !== undefined) {
    await page.fill('input[name="email"]', updates.email);
  }
  if (updates.password !== undefined) {
    await page.fill('input[name="password"]', updates.password);
  }

  await Promise.all([page.waitForURL(/\/profile\//), page.click('button[type="submit"]')]);
}
