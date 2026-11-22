import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly fields = {
    name: this.page.getByLabel('Name'),
    email: this.page.getByLabel('Email'),
    password: this.page.locator('input[name="password"]'),
  };

  readonly buttons = {
    submit: this.page.getByRole('button', { name: 'Sign Up' }),
  };

  async goto() {
    await this.page.goto('/signup');
    await expect(this.page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  }

  async register(name: string, email: string, password: string) {
    await this.fields.name.fill(name);
    await this.fields.email.fill(email);
    await this.fields.password.fill(password);
    await this.buttons.submit.click();
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
