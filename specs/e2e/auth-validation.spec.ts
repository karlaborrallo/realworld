import { test, expect } from '@playwright/test';
import { register, logout, generateUniqueUser } from './helpers/auth';

/**
 * Registration validation: the app must reject invalid or duplicate sign-ups
 * and keep the visitor on /register, unauthenticated.
 */
test.describe('Registration validation', () => {
  test('should reject registration with an already used email', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);
    await logout(page);

    // Same email, different username
    await page.goto('/register', { waitUntil: 'load' });
    await page.fill('input[name="username"]', `other${user.username}`);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-messages')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

  test('should reject registration with an already used username', async ({ page }) => {
    const user = generateUniqueUser();
    await register(page, user.username, user.email, user.password);
    await logout(page);

    // Same username, different email
    await page.goto('/register', { waitUntil: 'load' });
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="email"]', `other${user.email}`);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-messages')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });

  test('should not register with empty fields', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'load' });
    await page.click('button[type="submit"]');

    // Whether validation is native (required) or server-side, the user must stay on /register
    await expect(page).toHaveURL('/register');
    await expect(page.locator('a[href^="/profile/"]')).toHaveCount(0);
  });

  test('should not register without a password', async ({ page }) => {
    const user = generateUniqueUser();

    await page.goto('/register', { waitUntil: 'load' });
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="email"]', user.email);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/register');
    await expect(page.locator('a[href^="/profile/"]')).toHaveCount(0);
  });
});
