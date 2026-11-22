import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClaimWizardPage extends BasePage {
  readonly fields = {
    incidentDate: this.page.getByLabel(/when did the incident occur/i),
    incidentLocation: this.page.getByLabel(/where did the incident occur/i),
    claimAmount: this.page.getByLabel(/claim amount/i),
    description: this.page.getByLabel(/describe what happened/i),
  };
  readonly buttons = {
    next: this.page.locator('[data-testid^="wizard-step-"]').getByRole('button', { name: 'Next' }),
    submit: this.page.getByTestId('wizard-step-3').getByRole('button', { name: 'Submit Claim' }),
  };
  async goto() {
    await this.page.goto('/claims/new');
    await expect(this.page.getByRole('heading', { name: 'Submit New Claim' })).toBeVisible();
  }
  async completeStepOne() {
    await this.fields.incidentDate.fill('2025-01-15');
    await this.fields.incidentLocation.fill('123 Main Street, Springfield');
    await this.fields.claimAmount.fill('1250.50');
    await this.buttons.next.click();
  }
  async completeStepTwo() {
    await this.fields.description.fill('The insured vehicle was damaged in a documented collision at the listed location.');
    await this.buttons.next.click();
  }
  async submit() {
    await expect(this.page.getByRole('heading', { name: 'Review Your Claim' })).toBeVisible();
    await this.buttons.submit.click();
    await expect(this.page).toHaveURL(/\/claims$/);
  }
}
