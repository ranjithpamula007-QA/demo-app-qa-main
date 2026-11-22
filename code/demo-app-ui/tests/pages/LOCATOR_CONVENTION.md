# Page Object Locator Convention

All page objects group locators by the type of UI element they represent. Every property is a Playwright `Locator`.

| Group | Variable pattern | Locator examples | Use for |
|---|---|---|---|
| Inputs | `inputs.<fieldName>` | `input[name="email"]`, `getByLabel('Email')` | Text, email, password, date, amount, and textarea fields |
| Buttons | `buttons.<actionName>` | `getByRole('button', { name: 'Log In' })` | Submit, refresh, save, cancel, logout, and navigation actions implemented as buttons |
| Links | `links.<destinationName>` | `getByRole('link', { name: /sign up/i })` | Anchor navigation |
| Headings | `headings.<meaningfulName>` | `getByRole('heading', { name: 'My Claims' })` | Page and section identity |
| Text | `text.<meaningfulName>` | `getByText('Total Claims')` | Labels, cards, table headers, and static content |
| Messages | `messages.<stateName>` | `getByRole('alert')` | Errors, success messages, empty states, and warnings |
| Tables | `tables.<meaningfulName>` | `getByRole('table')` | Data tables and row containers |
| Rows | `rows.<meaningfulName>` | `table.getByRole('row')` | Row-level actions and assertions |

## Rules

1. Prefer `getByRole`, `getByLabel`, and `getByText` over CSS selectors.
2. Use CSS selectors only when the element has no reliable accessible locator; keep them specific, such as `input[name="password"]`.
3. Use semantic action names (`buttons.refresh`, `buttons.submit`) rather than visual names (`buttons.blueButton`).
4. Keep selectors in page objects; tests should not contain raw selectors.
5. Keep locators readonly and initialize them in the constructor.
6. Page objects expose actions and small page-state checks; business assertions remain in specs.
7. Add `data-testid` only for dynamic or repeated elements that cannot be identified accessibly.

## Example

```ts
readonly inputs = {
  email: page.locator('input[name="email"]'),
  password: page.locator('input[name="password"]'),
};

readonly buttons = {
  submit: page.getByRole('button', { name: 'Log In' }),
};

readonly headings = {
  page: page.getByRole('heading', { name: 'Log In' }),
};

readonly messages = {
  error: page.getByRole('alert'),
};
```
