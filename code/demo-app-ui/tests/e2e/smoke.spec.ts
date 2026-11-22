import { test, expect, type Page } from '@playwright/test';
import { testUsers, invalidUser } from '../data/users';

async function login(page: Page, email: string, password: string, expectedStatus = 200) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.locator('input[name="password"]').fill(password);
  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/auth/login'));
  await page.getByRole('button', { name: 'Log In' }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(expectedStatus);
}

test('@smoke claimant can log in and view claims', async ({ page }) => {
  await login(page, testUsers.CLAIMANT.email, testUsers.CLAIMANT.password);
  await expect(page).toHaveURL(/\/claims/);
  await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
});

test('@smoke admin can log in and load dashboard statistics', async ({ page }) => {
  await login(page, testUsers.ADMIN.email, testUsers.ADMIN.password);
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  await expect(page.getByText('Total Users')).toBeVisible();
  await expect(page.getByText('Total Claims')).toBeVisible();
});

test('@authorization claimant cannot access the admin dashboard', async ({ page }) => {
  await login(page, testUsers.CLAIMANT.email, testUsers.CLAIMANT.password);
  await page.goto('/admin/dashboard');
  await expect(page).not.toHaveURL(/\/admin\/dashboard/);
});

test('@negative rejects invalid credentials', async ({ page }) => {
  await login(page, invalidUser.email, invalidUser.password, 401);
  await expect(page.getByText('Invalid email or password', { exact: true })).toBeVisible();
});
