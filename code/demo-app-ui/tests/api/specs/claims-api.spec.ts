import { test, expect } from '../fixtures/api.fixture';
import { apiClaim, apiInvalidClaim } from '../data/api-data';

test.describe('Claims API', () => {
  test('claimant can submit and list a claim', async ({ claimsApi }) => {
    const created = await claimsApi.submit(apiClaim());
    expect(created.status()).toBe(201);
    const claim = await created.json();
    expect(claim.status).toBe('SUBMITTED');

    const list = await claimsApi.list();
    expect(list.status()).toBe(200);
    expect((await list.json()).some((item: { claimId: string }) => item.claimId === claim.claimId)).toBe(true);
  });

  test('future incident date is rejected', async ({ claimsApi }) => {
    const response = await claimsApi.submit(apiInvalidClaim());
    expect(response.status()).toBe(400);
  });

  test('unauthenticated user cannot submit a claim', async ({ api }) => {
    const response = await api.post('/api/claims', { data: apiClaim() });
    // Spring Security rejects this state at the CSRF/authentication boundary.
    expect(response.status()).toBe(403);
  });
});
