# ADR-007: Jest + React Testing Library for Testing

## Status

Accepted

## Date

2026-04-05

## Context

Next.js projects need a testing strategy that covers unit tests, component tests, and end-to-end tests. The solution must support Server Components, Client Components, Route Handlers, and custom hooks. A testing pattern consistent with Factoria's quality policies is required.

## Decision

Adopt the following testing stack:

- **Jest 29.x** as the primary test runner with `jest-environment-jsdom` for component tests.
- **React Testing Library 14.x** for component tests (Server and Client).
- **Playwright** for end-to-end (E2E) tests.

Testing rules:

- **Mandatory AAA pattern:** Arrange (prepare), Act (execute), Assert (verify). Separated by blank lines.
- **Naming:** `should [behavior] when [scenario]`. Example: `should display error message when login fails`.
- **Mocking:** `jest.mock()` for external dependencies. Never mock the internal implementation of the component.
- **RTL queries:** Priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`. Use `data-testid` only as a last resort.
- **Minimum coverage:** 80% line coverage in Application, 70% in Infrastructure, 60% in Presentation.
- **Location:** Tests next to the tested file: `service.ts` → `service.spec.ts`.

Configuration structure:
```
jest.config.ts          → Main configuration
jest.setup.ts           → Global setup (RTL matchers, global mocks)
playwright.config.ts    → E2E configuration
```

## Alternatives Considered

- **Vitest:** Faster than Jest, compatible with Vite. Discarded because Next.js does not use Vite natively and the integration requires unofficial additional configuration.
- **Cypress for E2E:** Popular but heavier than Playwright and with less multi-browser support. Playwright is the official Next.js recommendation.
- **Testing Library without Jest (via @testing-library/react with Vitest):** Possible but introduces a non-standard tool in the Next.js ecosystem.
- **Storybook for visual tests:** Complementary but does not replace unit/integration tests. Can be added as an additional tool, not as a replacement.

## Consequences

### Positive

- Jest is the best-supported test runner for Next.js (official configuration via `next/jest`).
- React Testing Library promotes tests that verify behavior, not implementation.
- Playwright supports multi-browser (Chromium, Firefox, WebKit) for E2E.
- AAA pattern and consistent naming facilitate test readability and maintenance.
- Alignment with Factoria's testing policies.

### Negative

- Jest with jsdom does not execute real CSS; visual tests require Playwright or Storybook.
- Configuring Jest for Server Components requires specific mocks of `next/navigation` and `next/headers`.
- Playwright E2E requires a running server, which increases CI time.

### Neutral

- Route Handler tests run as integration tests directly against the handler function.
- Custom hooks are tested with `renderHook` from React Testing Library.
- `jest.mock('next/navigation', ...)` is used to mock `useRouter`, `usePathname`, etc.
