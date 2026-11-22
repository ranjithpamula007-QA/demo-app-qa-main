import { test, expect } from '../fixtures/test';
import { AdminClaimsPage, ClaimWizardPage, SignupPage } from '../pages';

test.describe('Representative functional coverage', () => {
  test('@authentication claimant can reach the claims workspace', async ({ claimsPage }) => {
    await claimsPage.goto();
    await expect(claimsPage.headings.page).toBeVisible();
    await expect(claimsPage.buttons.newClaim).toBeVisible();
  });

  test('@registration newly registered user can log in and reach My Claims', async ({ page, loginPage }) => {
    const signup = new SignupPage(page);
    const email = `playwright-${Date.now()}@demo.com`;
    const password = 'Playwright123!';

    await signup.goto();
    await signup.register('Playwright Test User', email, password);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/\/claims$/);
    await expect(page.getByRole('heading', { name: 'My Claims' })).toBeVisible();
  });

  test('@authorization claimant is denied access to admin dashboard', async ({ claimantPage }) => {
    await claimantPage.goto('/admin/dashboard');
    await expect(claimantPage).not.toHaveURL(/\/admin\/dashboard/);
  });

  test('@claim-submission claimant can complete the three-step claim workflow', async ({ claimantPage }) => {
    const wizard = new ClaimWizardPage(claimantPage);
    await wizard.goto();
    await wizard.completeStepOne();
    await expect(claimantPage.getByRole('heading', { name: 'Supporting Details' })).toBeVisible();
    await wizard.completeStepTwo();
    await wizard.submit();
  });

  test('@claimant claimant can cancel a new claim and return safely', async ({ claimsPage, claimantPage }) => {
    await claimsPage.goto();
    await claimsPage.openNewClaim();
    await claimantPage.getByRole('button', { name: /cancel/i }).click();
    await expect(claimantPage).toHaveURL(/\/claims$/);
  });

  test('@admin admin can view dashboard and use claims filters', async ({ adminPage, adminDashboardPage }) => {
    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();
    const claims = new AdminClaimsPage(adminPage);
    await claims.goto();
    await claims.filterByStatus('SUBMITTED');
    await expect(claims.filters.status).toHaveValue('SUBMITTED');
    await claims.filters.userId.fill('no-such-user');
    await expect(claims.filters.clear).toBeVisible();
    await claims.filters.clear.click();
    await expect(claims.filters.status).toHaveValue('');
  });

  test('@claim-status submitted claim moves to under review and dashboard counts update', async ({ claimantPage, adminPage, adminDashboardPage }) => {
    const wizard = new ClaimWizardPage(claimantPage);
    await wizard.goto();
    await wizard.completeStepOne();
    await wizard.completeStepTwo();
    await wizard.submit();

    await adminDashboardPage.goto();
    const submittedBefore = await adminDashboardPage.statusCount('Submitted');
    const underReviewBefore = await adminDashboardPage.statusCount('Under Review');

    const claims = new AdminClaimsPage(adminPage);
    await claims.goto();
    await claims.filterByStatus('SUBMITTED');
    await expect(adminPage.locator('tbody tr').first()).toBeVisible();
    await claims.updateFirstClaimStatus('UNDER_REVIEW');

    await adminDashboardPage.goto();
    await adminDashboardPage.expectLoaded();
    await expect(adminDashboardPage.headings.page).toBeVisible();
    await expect(adminDashboardPage.text.claimsByStatus).toBeVisible();
    await adminDashboardPage.refresh();
    await expect.poll(() => adminDashboardPage.statusCount('Submitted')).toBe(submittedBefore - 1);
    await expect.poll(() => adminDashboardPage.statusCount('Under Review')).toBe(underReviewBefore + 1);
  });

  test('@api-error login surfaces a backend authentication failure', async ({ loginPage, page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ detail: 'Invalid email or password' }) });
    });
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'InvalidPassword123!');
    await loginPage.expectInvalidCredentials();
  });

  test('@accessibility login controls expose accessible names', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.inputs.email).toHaveAccessibleName('Email');
    await expect(loginPage.inputs.password).toHaveAccessibleName('Password');
    await expect(loginPage.buttons.submit).toHaveAccessibleName('Log In');
  });
});
