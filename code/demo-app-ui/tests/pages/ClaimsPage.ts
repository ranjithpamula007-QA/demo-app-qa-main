import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClaimsPage extends BasePage {
  readonly headings: {
    page: Locator;
    emptyState: Locator;
  };

  readonly buttons: {
    newClaim: Locator;
    logout: Locator;
  };

  readonly messages: {
    error: Locator;
  };

  constructor(page: Page) {
    super(page);

    this.headings = {
      page: page.getByRole('heading', { name: 'My Claims' }),
      emptyState: page.getByRole('heading', { name: 'No claims yet' }),
    };

    this.buttons = {
      newClaim: page.getByRole('button', { name: /new claim|submit claim/i }),
      logout: page.getByRole('button', { name: /log out|logout/i }),
    };

    this.messages = {
      error: page.getByRole('alert'),
    };
  }

  async goto() {
    await this.page.goto('/claims');
    await expect(this.headings.page).toBeVisible();
  }

  async openNewClaim() {
    await this.buttons.newClaim.click();
  }
}
