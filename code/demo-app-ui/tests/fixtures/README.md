# UI fixture layer

Import `test` from `tests/fixtures/test.ts` in UI E2E specs.

Available fixtures:

| Fixture | Type | Purpose |
|---|---|---|
| `page` | Playwright `Page` | Unauthenticated browser page |
| `adminPage` | Playwright `Page` | Browser page authenticated as admin |
| `claimantPage` | Playwright `Page` | Browser page authenticated as claimant |
| `loginPage` | `LoginPage` | Login page object on the unauthenticated page |
| `claimsPage` | `ClaimsPage` | Claims page object backed by `claimantPage` |
| `adminDashboardPage` | `AdminDashboardPage` | Dashboard page object backed by `adminPage` |

Example:

```ts
import { test, expect } from '../fixtures/test';

test('admin can load dashboard', async ({ adminDashboardPage }) => {
  await adminDashboardPage.goto();
  await adminDashboardPage.expectLoaded();
});

test('claimant can view claims', async ({ claimsPage }) => {
  await claimsPage.goto();
  await expect(claimsPage.headings.page).toBeVisible();
});
```

The fixture layer owns browser-context cleanup. API data setup and cleanup will be added separately after the UI fixture layer is approved.
