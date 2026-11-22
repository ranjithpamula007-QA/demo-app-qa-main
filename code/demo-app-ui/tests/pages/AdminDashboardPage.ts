import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  readonly headings: {
    page: Locator;
  };

  readonly buttons: {
    refresh: Locator;
  };

  readonly text: {
    totalUsers: Locator;
    totalClaims: Locator;
    claimsByStatus: Locator;
  };

  readonly messages: {
    error: Locator;
  };

  constructor(page: Page) {
    super(page);

    this.headings = {
      page: page.getByRole('heading', { name: 'Admin Dashboard' }),
    };

    this.buttons = {
      refresh: page.getByRole('button', { name: 'Refresh dashboard' }),
    };

    this.text = {
      totalUsers: page.getByText('Total Users'),
      totalClaims: page.getByText('Total Claims'),
      claimsByStatus: page.getByText('Claims by Status'),
    };

    this.messages = {
      error: page.getByRole('alert'),
    };
  }

  async goto() {
    await this.page.goto('/admin/dashboard');
    await expect(this.headings.page).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.text.totalUsers).toBeVisible();
    await expect(this.text.totalClaims).toBeVisible();
  }

  async refresh() {
    await this.buttons.refresh.click();
  }

  async statusCount(statusLabel: string) {
    const card = this.page.getByTestId('stats-card-chart');
    const row = card.locator('div.flex.items-center.justify-between').filter({ hasText: statusLabel });
    return Number(await row.locator('span').last().innerText());
  }
}
