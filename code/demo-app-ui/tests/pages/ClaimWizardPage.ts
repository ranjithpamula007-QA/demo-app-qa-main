import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ClaimTestData } from '../data/claims';

export class ClaimWizardPage extends BasePage {
  readonly fields = {
    incidentDate: this.page.getByLabel(/when did the incident occur/i),
    incidentLocation: this.page.getByLabel(/where did the incident occur/i),
    claimAmount: this.page.getByLabel(/claim amount/i),
    description: this.page.getByLabel(/describe what happened/i),
  };
  readonly buttons = {
    next: this.page.locator('[data-testid^="wizard-step-"]').getByRole('button', { name: 'Next' }),
    back: this.page.getByRole('button', { name: 'Back' }),
    submit: this.page.getByTestId('wizard-step-3').getByRole('button', { name: 'Submit Claim' }),
  };
  async goto() {
    await this.page.goto('/claims/new');
    await expect(this.page.getByRole('heading', { name: 'Submit New Claim' })).toBeVisible();
  }
  async completeStepOne(data: Pick<ClaimTestData, 'incidentDate' | 'incidentLocation' | 'claimAmount'>) {
    await this.fields.incidentDate.fill(data.incidentDate);
    await this.fields.incidentLocation.fill(data.incidentLocation);
    await this.fields.claimAmount.fill(data.claimAmount);
    await this.buttons.next.click();
  }
  async completeStepTwo(data: Pick<ClaimTestData, 'description'>) {
    await this.fields.description.fill(data.description);
    await this.buttons.next.click();
  }

  async returnToStepOne() {
    await this.buttons.back.click();
    await expect(this.page.getByRole('heading', { name: 'Incident Details' })).toBeVisible();
  }

  async expectStepOneValues(data: Pick<ClaimTestData, 'incidentDate' | 'incidentLocation' | 'claimAmount'>) {
    await expect(this.fields.incidentDate).toHaveValue(data.incidentDate);
    await expect(this.fields.incidentLocation).toHaveValue(data.incidentLocation);
    await expect(this.fields.claimAmount).toHaveValue(data.claimAmount);
  }
  async submit() {
    await expect(this.page.getByRole('heading', { name: 'Review Your Claim' })).toBeVisible();
    await this.buttons.submit.click();
    await expect(this.page).toHaveURL(/\/claims$/);
  }
}
