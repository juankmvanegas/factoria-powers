# ADR-011: Jest Test Doubles Pattern

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
Automated testing is essential for a BFF orchestrating multiple backend services. Tests must verify that use cases correctly compose calls, transform data, and handle errors — without calling real backends. A standardized testing approach ensures consistency, speed, and reliability.

## Decision
Adopt Jest as the test framework with a standardized test doubles pattern:

- **Stack**: Jest 29.x, `@nestjs/testing` for TestingModule, `@golevelup/ts-jest` for `createMock<T>()`, ts-jest for TypeScript compilation.
- **Test location**: unit tests co-located with source (`*.spec.ts`), e2e tests in `test/e2e/`. Mock data factories in `test/datasets/mocks/`, backend response fixtures in `test/datasets/fixtures/`.
- **AAA pattern** (Arrange-Act-Assert) mandatory for all tests.
- **Mock data factories**: class-based factory pattern with `create()` and `createList()` methods. No raw objects.
- **Test naming**: `{name}.spec.ts` (unit), `{name}.e2e-spec.ts` (e2e). It blocks: `should {behavior} when {condition}`.
- **Coverage**: minimum 90% (branches, functions, lines, statements) enforced in CI.

Rules:
- Every use case, controller, and infrastructure service must have a `.spec.ts` file.
- Use `createMock<T>()` — do not manually create mock classes.
- Tests must be deterministic — no randomness, no real network calls, no file system access.
- Prefer injected mocks via DI over `jest.spyOn()`.

## Consequences
- AAA pattern makes tests readable and predictable
- `createMock<T>()` eliminates boilerplate for mock creation
- Mock data factories ensure consistent, reusable test data
- 90% coverage ensures new code always has tests
- 90% threshold may lead to low-value tests just to meet the threshold
- Mock data factories require maintenance when models change
