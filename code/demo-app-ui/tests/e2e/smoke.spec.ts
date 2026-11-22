import { test, expect, type Page } from '@playwright/test';

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@demo.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin123!';
const claimantEmail = process.env.CLAIMANT_EMAIL ?? 'claimant@demo.com';
const claimantPassword = process.env.CLAIMANT_PASSWORD ?? 'Claimant123!';

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
  await login(page, claimantEmail, claimantPassword);
  await expect(page).toHaveURL(/\/claims/);
  await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
});

test('@smoke admin can log in and load dashboard statistics', async ({ page }) => {
  await login(page, adminEmail, adminPassword);
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  await expect(page.getByText('Total Users')).toBeVisible();
  await expect(page.getByText('Total Claims')).toBeVisible();
});

test('@authorization claimant cannot access the admin dashboard', async ({ page }) => {
  await login(page, claimantEmail, claimantPassword);
  await page.goto('/admin/dashboard');
  await expect(page).not.toHaveURL(/\/admin\/dashboard/);
});

test('@negative rejects invalid credentials', async ({ page }) => {
  await login(page, 'invalid@example.com', 'InvalidPassword123!', 401);
  await expect(page.getByText('Invalid email or password', { exact: true })).toBeVisible();
});
