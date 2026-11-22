import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminClaimsPage extends BasePage {
  readonly filters = {
    status: this.page.getByRole('combobox', { name: 'Filter claims by status' }),
    userId: this.page.getByRole('textbox', { name: 'Search claims by user ID' }),
    clear: this.page.getByRole('button', { name: 'Clear Filters' }),
  };
  async goto() {
    await this.page.goto('/admin/claims');
    await expect(this.page.getByRole('heading', { name: 'Claims Management' })).toBeVisible();
  }
  async filterByStatus(status: string) { await this.filters.status.selectOption(status); }

  firstClaimStatusSelect() {
    return this.page.locator('tbody tr').first().getByRole('combobox');
  }

  async updateFirstClaimStatus(status: string) {
    await this.firstClaimStatusSelect().selectOption(status);
    await expect(this.page.getByRole('dialog', { name: 'Confirm Status Change' })).toBeVisible();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
    await expect(this.page.getByText(/status updated to/i)).toBeVisible();
  }
}
