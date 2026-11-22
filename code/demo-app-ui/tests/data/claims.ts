export interface ClaimTestData {
  incidentDate: string;
  incidentLocation: string;
  claimAmount: string;
  description: string;
}

export const validClaim = (overrides: Partial<ClaimTestData> = {}): ClaimTestData => ({
  incidentDate: '2025-01-15',
  incidentLocation: '123 Main Street, Springfield',
  claimAmount: '1250.50',
  description: 'The insured vehicle was damaged in a documented collision at the listed location.',
  ...overrides,
});
