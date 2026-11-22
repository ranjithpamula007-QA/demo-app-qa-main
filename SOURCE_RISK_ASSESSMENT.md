# Source Risk Assessment

This assessment was completed before adding E2E tests by reviewing the UI, BFF, Claims Service, security configuration, domain logic, persistence, cache, Kafka consumers, CDC support, and WebSocket routing.

## Highest-risk areas

1. **Authentication and authorization — P0.** Keycloak issues JWTs; the BFF stores access and refresh tokens in cookies, validates JWT roles, applies CSRF protection, refreshes expired sessions, and the Claims Service also enforces admin permissions. A mismatch can cause privilege escalation, account lockout, or broken login.
2. **Claim status transitions — P0.** The domain state machine controls `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, and terminal `CLOSED` transitions. Invalid transitions must not persist or emit events.
3. **Realtime event delivery — P0.** A claim write can travel through direct Kafka or Debezium CDC, then a BFF consumer, role-based WebSocket routing, and UI state/toast handling. Direct Kafka and CDC must not run together because duplicate notifications are possible.
4. **Dashboard cache consistency — P1.** Dashboard aggregates are cached in Redis with fallback behavior and explicit flush operations. Stale, partially refreshed, or incorrectly authorized statistics would affect operational decisions.
5. **BFF/Claims/UI contracts — P1.** Generated OpenAPI clients, DTO mappers, JWT propagation, downstream errors, timestamps, amounts, and status enums cross multiple service boundaries.
6. **Claim validation and persistence — P1.** Domain rules validate dates, descriptions, locations, and amounts; UI schemas, generated DTOs, database mappings, and Liquibase must agree.

## Test priorities

- First: role isolation, login/refresh/logout, protected routes, and admin authorization.
- Next: every valid and invalid claim status transition and persistence outcome.
- Then: claim creation validation, BFF error mapping, and dashboard cache hit/miss/flush behavior.
- Finally: direct-Kafka and isolated CDC realtime flows, including duplicate, malformed, delayed, and disconnected event cases.

## Deliberate scope boundaries

- Use Playwright for browser journeys, not load testing.
- Use API fixtures for test data rather than direct database writes from UI tests.
- Use deterministic mocks for failure states and real services for critical happy paths.
- Keep CDC coverage separate from direct Kafka coverage.
