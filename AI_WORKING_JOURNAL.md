# AI Working Journal

This journal records significant decisions made while reviewing and extending the QA automation for the Demo App. It is intentionally concise and records accepted, challenged, and overridden assumptions.

## 2026-11-22 — Source and architecture review

- Accepted: the repository README and architecture documentation as the initial system map.
- Verified: the source implements a Next.js UI, BFF, Claims Service, Keycloak, PostgreSQL, Redis, Kafka, and WebSocket event flow.
- Challenged: treating Debezium as always-on. The application supports it as an alternative to direct Kafka events; running both can duplicate notifications.
- Decision: prioritize authentication, authorization, claim transitions, cache consistency, API contracts, and realtime routing before broad UI coverage.

## 2026-11-22 — UI build investigation

- Accepted: the first UI build failure was a real TypeScript defect: `react-hot-toast` options do not support `onClick`.
- Decision: preserve clickable notification behavior with a custom toast.
- Constraint: the hook is a `.ts` file, so JSX was not introduced; `createElement` was used instead.
- Discovered: the UI BFF fallback pointed to port `8080`, the Claims Service, instead of the BFF on `8090`.
- Fix accepted: changed the non-WireMock fallback to `http://localhost:8090`.

## 2026-11-22 — Backend build investigation

- Discovered: `UpdateClaimStatusUseCase` gained an `ApplicationEventPublisher` constructor dependency while its unit test still used the old constructor.
- Fix accepted: updated the test to inject a mocked publisher.
- Discovered: the repository Maven wrapper is incomplete and local Maven initially targeted an unwritable `C:\.m2` directory.
- Decision: document a project-local Maven repository workaround; do not commit generated dependency caches.

## 2026-11-22 — Public repository hygiene

- Challenged: committing `docker/compose/.env` to a public repository because it contains environment credentials.
- Decision: exclude `.env`, add `.env.example`, and exclude generated `target/` and `node_modules/` artifacts.
- Result: the cleaned project was pushed to the public GitHub repository.

## Test strategy decisions

- Accepted: real services for critical happy paths such as login, claim submission, and admin status updates.
- Accepted: route mocking for deterministic 401, 403, 404, 500, empty, timeout, and WebSocket failure cases.
- Rejected: database writes directly from browser tests; setup should use API fixtures or an approved test-data endpoint.
- Rejected: using Playwright for load testing; load testing belongs in k6, Gatling, or JMeter.
- Deferred: full CDC coverage until the environment can isolate CDC mode from direct Kafka mode.
