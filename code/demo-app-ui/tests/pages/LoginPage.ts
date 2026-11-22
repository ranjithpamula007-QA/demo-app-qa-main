import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly inputs: {
    email: Locator;
    password: Locator;
  };

  readonly buttons: {
    submit: Locator;
    showPassword: Locator;
  };

  readonly headings: {
    page: Locator;
  };

  readonly messages: {
    error: Locator;
  };

  readonly links: {
    signup: Locator;
  };

  constructor(page: Page) {
    super(page);

    this.inputs = {
      email: page.locator('input[name="email"]'),
      password: page.locator('input[name="password"]'),
    };

    this.buttons = {
      submit: page.getByRole('button', { name: 'Log In' }),
      showPassword: page.getByRole('button', { name: /show password/i }),
    };

    this.headings = {
      page: page.getByRole('heading', { name: 'Log In' }),
    };

    this.messages = {
      error: page.getByRole('alert'),
    };

    this.links = {
      signup: page.getByRole('link', { name: /sign up/i }),
    };
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.headings.page).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.inputs.email.fill(email);
    await this.inputs.password.fill(password);
    await this.buttons.submit.click();
  }

  async expectInvalidCredentials() {
    await expect(this.messages.error).toContainText('Invalid email or password');
  }
}
