import { test, expect } from '../fixtures/api.fixture';
import { apiClaim } from '../data/api-data';

test.describe('Admin API', () => {
  test('admin can read dashboard statistics', async ({ adminClient }) => {
    const response = await adminClient.stats();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('totalClaims');
    expect(body).toHaveProperty('claimsByStatus');
  });

  test('admin can list submitted claims', async ({ adminClient }) => {
    const response = await adminClient.claims({ status: 'SUBMITTED' });
    expect(response.status()).toBe(200);
    expect((await response.json()).every((claim: { status: string }) => claim.status === 'SUBMITTED')).toBe(true);
  });

  test('claimant cannot access admin dashboard', async ({ claimantApi }) => {
    const response = await claimantApi.get('/api/admin/dashboard/stats');
    expect(response.status()).toBe(403);
  });

  test('admin can transition a submitted claim to under review', async ({ claimsApi, adminClient }) => {
    const created = await claimsApi.submit(apiClaim());
    expect(created.status()).toBe(201);
    const claim = await created.json();
    const response = await adminClient.updateStatus(claim.claimId, 'UNDER_REVIEW');
    expect(response.status()).toBe(200);
    expect((await response.json()).status).toBe('UNDER_REVIEW');
  });
});
