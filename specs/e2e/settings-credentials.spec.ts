import { test, expect } from '@playwright/test';
import { register, login, logout, generateUniqueUser } from './helpers/auth';
import { updateCredentials } from './helpers/settings';

/**
 * Settings - credential updates (username, email, password).
 * Complements settings.spec.ts, which only covers bio and image.
 */
test.describe('Settings - Credential Updates', () => {
  test('should update username and reflect it in navbar and profile', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);

    const newUsername = `renamed${Date.now()}`;
    await updateCredentials(page, { username: newUsername });

    await expect(page).toHaveURL(new RegExp(`/profile/${newUsername}`));
    await expect(page.locator(`nav a[href="/profile/${newUsername}"]`)).toBeVisible();
    await expect(page.locator('h4')).toHaveText(newUsername);
  });

  test('should login with the new email after changing it', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);

    const newEmail = `new${Date.now()}@example.com`;
    await updateCredentials(page, { email: newEmail });

    await logout(page);
    await login(page, newEmail, user.password);

    await expect(page.locator(`a[href="/profile/${user.username}"]`)).toBeVisible();
  });

  test('should login with the new password and reject the old one', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);

    const newPassword = `newpass${Date.now()}`;
    await updateCredentials(page, { password: newPassword });

    await logout(page);

    // Old password must no longer work
    await page.goto('/login', { waitUntil: 'load' });
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-messages')).toBeVisible();
    await expect(page).toHaveURL('/login');

    // New password works
    await login(page, user.email, newPassword);
    await expect(page.locator(`a[href="/profile/${user.username}"]`)).toBeVisible();
  });

  test('should keep the session after updating credentials and reloading', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);

    const newUsername = `persist${Date.now()}`;
    await updateCredentials(page, { username: newUsername });

    await page.reload();
    await expect(page.locator(`nav a[href="/profile/${newUsername}"]`)).toBeVisible();
  });
});
