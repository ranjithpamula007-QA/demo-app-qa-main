import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { testUsers, type TestRole } from '../../data/users';
import { AuthApiClient } from '../clients/auth.client';
import { ClaimsApiClient } from '../clients/claims.client';
import { AdminApiClient } from '../clients/admin.client';

type ApiFixtures = {
  api: APIRequestContext;
  claimantApi: APIRequestContext;
  adminApi: APIRequestContext;
  authApi: AuthApiClient;
  claimsApi: ClaimsApiClient;
  adminClient: AdminApiClient;
};

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:8090';

async function authenticatedRequest(playwright: { request: { newContext: (options: { baseURL: string; extraHTTPHeaders?: Record<string, string> }) => Promise<APIRequestContext> } }, role: TestRole) {
  const loginContext = await playwright.request.newContext({ baseURL: apiBaseUrl });
  const loginResponse = await loginContext.post('/api/auth/login', { data: testUsers[role] });
  expect(loginResponse.status(), `${role} API login failed`).toBe(200);
  const cookies = loginResponse.headersArray()
    .filter((header: { name: string }) => header.name.toLowerCase() === 'set-cookie')
    .map((header: { value: string }) => header.value.split(';', 1)[0])
    .join('; ');
  const csrfToken = cookies.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1];
  await loginContext.dispose();
  return playwright.request.newContext({
    baseURL: apiBaseUrl,
    extraHTTPHeaders: {
      Cookie: cookies,
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
    },
  });
}

export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: apiBaseUrl });
    await use(context);
    await context.dispose();
  },
  claimantApi: async ({ playwright }, use) => {
    const context = await authenticatedRequest(playwright, 'CLAIMANT');
    await use(context);
    await context.dispose();
  },
  adminApi: async ({ playwright }, use) => {
    const context = await authenticatedRequest(playwright, 'ADMIN');
    await use(context);
    await context.dispose();
  },
  authApi: async ({ api }, use) => use(new AuthApiClient(api)),
  claimsApi: async ({ claimantApi }, use) => use(new ClaimsApiClient(claimantApi)),
  adminClient: async ({ adminApi }, use) => use(new AdminApiClient(adminApi)),
});

export { expect };
