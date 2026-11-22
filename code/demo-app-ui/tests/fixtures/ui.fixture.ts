import { test as authTest, expect } from './auth.fixture';
import { LoginPage } from '../pages/LoginPage';
import { ClaimsPage } from '../pages/ClaimsPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

type UiFixtures = {
  loginPage: LoginPage;
  claimsPage: ClaimsPage;
  adminDashboardPage: AdminDashboardPage;
};

export const test = authTest.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  claimsPage: async ({ claimantPage }, use) => {
    await use(new ClaimsPage(claimantPage));
  },

  adminDashboardPage: async ({ adminPage }, use) => {
    await use(new AdminDashboardPage(adminPage));
  },
});

export { expect };
