import { test as base, expect, type Browser, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers, type TestRole, type TestUser } from '../data/users';

type AuthFixtures = {
  adminPage: Page;
  claimantPage: Page;
};

async function loginAs(page: Page, user: TestUser) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);

  const expectedPath = user.role === 'ADMIN' ? /\/admin\/dashboard/ : /\/claims/;
  await expect(page).toHaveURL(expectedPath);
}

async function createAuthenticatedPage(browser: Browser, role: TestRole) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await loginAs(page, testUsers[role]);
  return { context, page };
}

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ browser }, use) => {
    const { context, page } = await createAuthenticatedPage(browser, 'ADMIN');
    await use(page);
    await context.close();
  },

  claimantPage: async ({ browser }, use) => {
    const { context, page } = await createAuthenticatedPage(browser, 'CLAIMANT');
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
