import { validClaim } from '../../data/claims';

export const apiClaim = () => ({
  ...validClaim(),
  incidentDate: '2025-02-20',
});

export const apiInvalidClaim = () => ({
  ...apiClaim(),
  incidentDate: '2099-01-01',
});
