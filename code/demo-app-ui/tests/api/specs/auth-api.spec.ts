import { test, expect } from '../fixtures/api.fixture';
import { newTestUser, invalidUser, testUsers } from '../../data/users';

test.describe('Authentication API', () => {
  test('valid claimant login returns claimant user', async ({ authApi }) => {
    const response = await authApi.login(testUsers.CLAIMANT);
    expect(response.status()).toBe(200);
    expect((await response.json()).role).toBe('CLAIMANT');
  });

  test('invalid credentials return 401', async ({ authApi }) => {
    const response = await authApi.login(invalidUser);
    expect(response.status()).toBe(401);
  });

  test('signup creates a claimant account', async ({ authApi }) => {
    const user = newTestUser();
    const response = await authApi.signup(user);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(user.email);
    expect(body.role).toBe('CLAIMANT');
  });
});
