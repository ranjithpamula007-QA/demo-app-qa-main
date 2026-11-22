# Playwright Test Strategy

## 1. Objective

Build a reliable end-to-end automation suite for the Demo App UI, validating authentication, claimant workflows, administrator workflows, authorization, API failure handling, and real-time claim updates.

The suite should validate the application through the browser and BFF boundary. Business data should be created through APIs or approved test fixtures rather than by driving setup screens.

## 2. Application scope

### Authentication

- Login with valid admin credentials.
- Login with valid claimant credentials.
- Invalid email or password.
- Required-field validation.
- Logout and session cleanup.
- Expired or invalid session behavior.
- Protected-route redirects.

### Claimant journeys

- Open the claims list.
- Submit a valid claim through the claim wizard.
- Validate required and invalid claim fields.
- View claim details.
- Verify claim status and progress.
- Verify a real-time status-change notification.

### Administrator journeys

- Load dashboard statistics.
- Refresh dashboard statistics.
- Flush dashboard cache.
- View, filter, and open claims.
- Update claim status.
- Validate invalid status transitions.
- View users.
- Verify claimant access is denied for admin routes.

### Resilience and UX

- Loading states.
- Empty states.
- 401, 403, 404, and 500 API responses.
- Network timeout and offline behavior.
- WebSocket disconnect and reconnect behavior.
- Responsive layout and basic accessibility.

## 3. Recommended repository structure

```text
code/demo-app-ui/tests/
├── e2e/
│   ├── auth/
│   ├── claimant/
│   ├── admin/
│   ├── authorization/
│   ├── error-handling/
│   └── realtime/
├── pages/
│   ├── components/
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── ClaimsPage.ts
│   ├── ClaimWizardPage.ts
│   ├── ClaimDetailsPage.ts
│   ├── AdminDashboardPage.ts
│   ├── AdminClaimsPage.ts
│   └── AdminUsersPage.ts
├── fixtures/
│   ├── test.ts
│   ├── auth.fixture.ts
│   ├── api.fixture.ts
│   └── data.fixture.ts
├── api/
│   ├── AuthApi.ts
│   ├── ClaimsApi.ts
│   ├── AdminApi.ts
│   └── TestDataApi.ts
├── data/
│   ├── users.ts
│   ├── claims.ts
│   ├── statuses.ts
│   └── invalid-data.ts
├── mocks/
│   ├── auth.mock.ts
│   ├── claims.mock.ts
│   ├── admin.mock.ts
│   └── websocket.mock.ts
└── utils/
    ├── assertions.ts
    ├── cleanup.ts
    └── test-ids.ts
```

## 4. Test layers

### Smoke suite

Run on every build:

1. Admin can log in and load the dashboard.
2. Claimant can log in and load claims.
3. Claimant can submit a valid claim.
4. Admin can update a claim status.
5. Claimant cannot access admin routes.

### Regression suite

Run for pull requests and scheduled builds:

- Complete claimant journey.
- Complete admin journey.
- Validation and negative cases.
- Session and authorization cases.
- Cache, empty-state, and API error cases.
- Real-time status update cases.

### Cross-browser suite

Run at least on Chromium and Firefox. Add WebKit if the application has Safari users or browser-specific defects.

## 5. Page Object Model rules

Each page object should contain:

- Stable locators.
- Page navigation.
- User actions.
- Small page-level state checks.

Tests should contain business intent and assertions. Avoid putting complete scenarios inside page objects.

Prefer locators in this order:

1. `getByRole`.
2. `getByLabel`.
3. `getByText`.
4. `getByTestId` when an accessible locator is not suitable.

Recommended selector examples:

```ts
page.getByRole('button', { name: 'Submit claim' });
page.getByLabel('Claim amount');
page.getByTestId('claim-status');
```

## 6. Planned functional coverage

The target suite is organized by business risk. Counts below are planning targets, not a requirement that every test be a separate file. Tests should be data-driven where the same rule has multiple valid states.

| Area | Target cases | Representative coverage |
|---|---:|---|
| Authentication | 8 | valid claimant/admin login, invalid credentials, validation, logout, session persistence, expired session, login API failure, signup entry |
| Authorization and security | 6 | claimant blocked from admin routes, admin-only controls, protected route redirect, unauthorized API response, token/session handling, direct URL access |
| Claimant claims | 10 | empty state, claims list, status display, details modal, refresh, copy ID, navigation, error state, responsive card/table behavior, realtime update visibility |
| Claim submission wizard | 8 | required-field validation, date/amount boundaries, location validation, description validation, back navigation, review accuracy, successful submission, submission failure |
| Admin dashboard | 7 | statistics, status breakdown, refresh, loading state, API failure, admin navigation, claimant denial |
| Admin claim management | 8 | list, status filter, user search, clear filters, valid transitions, confirmation dialog, update success, update failure/terminal status |
| Error and resilience handling | 6 | backend 4xx/5xx, network failure, empty data, retry, stale session, malformed/unavailable response |
| Realtime/WebSocket behavior | 5 | connection states, claim update event, reconnect, disconnect warning, event-driven refresh |
| UI/accessibility smoke checks | 6 | accessible names, keyboard navigation, focus/dialog behavior, form errors, responsive layout, no critical console errors |

Total planning scope: **64 cases**. The current representative E2E baseline covers one high-value workflow per category; the remaining cases should be added incrementally after the baseline is stable.

## 7. Authentication and storage state

Create authenticated storage states once per role:

```text
tests/.auth/admin.json
tests/.auth/claimant.json
```

Use Playwright projects or fixtures to load the correct state. Do not perform UI login in every test. Keep one or two dedicated login tests for the login functionality itself.

Credentials must come from environment variables or CI secrets:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
CLAIMANT_EMAIL
CLAIMANT_PASSWORD
NEXT_PUBLIC_BFF_URL
PLAYWRIGHT_BASE_URL
```

Never commit real credentials, `.env` files, tokens, or storage-state files.

## 7. Test data strategy

Use three data types:

### Fixed reference data

Use fixed users and roles for authentication and authorization tests.

### Generated data

Use Faker or deterministic worker-specific values for claims that require uniqueness.

```ts
const claim = {
  description: `Playwright claim ${testInfo.workerIndex}-${Date.now()}`,
  amount: 1500,
};
```

### Scenario data

Keep invalid and transition-specific data explicit, for example:

- Negative amount.
- Missing description.
- Invalid date.
- `SUBMITTED` to `UNDER_REVIEW` valid transition.
- `CLOSED` to `APPROVED` invalid transition.

## 8. Setup and cleanup

Use API setup and teardown:

```text
before test: create user/claim through API
test: exercise the browser workflow
after test: delete test data by test-run ID
```

Every generated record should include a unique test-run identifier. Cleanup must be safe to repeat and should not delete shared seed users.

If the backend does not expose test-data APIs, add a test-only endpoint or isolated database strategy. Avoid direct database writes from UI tests unless the test environment explicitly supports it.

## 9. Mocking strategy

Use real services for critical happy paths:

- Login.
- Claim submission.
- Claim retrieval.
- Admin status update.

Use Playwright route mocks for deterministic edge cases:

- 401 unauthorized.
- 403 forbidden.
- 404 not found.
- 500 service failure.
- Slow response.
- Empty dashboard.
- WebSocket disconnect.

Do not mix mocked and real responses in one test unless that boundary is the subject of the test.

## 10. Naming and tagging

Test names should describe behavior, not implementation:

```ts
test('@smoke claimant can submit a valid claim', async ({ claimantPage }) => {});
test('@negative rejects a negative claim amount', async ({ claimantPage }) => {});
test('@authorization claimant cannot access the admin dashboard', async ({ page }) => {});
```

Recommended tags:

- `@smoke`
- `@regression`
- `@negative`
- `@authorization`
- `@api-error`
- `@realtime`

## 11. Quality gates

### Pull request gate

- TypeScript compilation passes.
- Smoke tests pass.
- No focused tests such as `test.only`.
- No committed secrets or storage states.
- HTML and JUnit reports are generated.

### Nightly gate

- Full regression suite.
- Chromium and Firefox.
- Retry analysis.
- Accessibility smoke checks.
- Trace and screenshot retention for failures.

## 12. Commands

```powershell
npm ci
npx playwright install chromium
npm run test:e2e -- --grep @smoke
npm run test:e2e
npx playwright show-report
```

## 13. Definition of done

- Every critical user journey has at least one happy-path test.
- Every role boundary has an authorization test.
- Every major API error state has deterministic coverage.
- Tests are independent and parallel-safe.
- Test data is created and cleaned through fixtures.
- Page objects contain actions, not business workflows.
- CI publishes actionable reports and traces.
