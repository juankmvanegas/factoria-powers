# Testing Policy

> **Mandatory**: All production code must have tests. No code is delivered without tests. This policy is not optional and cannot be skipped by user request.

Adapted from enterprise testing standards for the NestJS BFF context.

## 1. Test Organization

### Project Structure
```
test/
  unit-testing/
    services/                  - Application service unit tests
    common/
      helpers/                 - Helper tests
      utilities/               - Utility tests
  datasets/
    mocks/                     - Shared mock data and test doubles
```

### File Naming
- Test files: `[feature].test.ts`
- Mock files: `[feature].mock.ts`
- Test datasets: `[feature].dataset.ts`
- Location: tests mirror the source structure under `test/unit-testing/`

## 2. Testing Frameworks

| Package | Version | Purpose |
|---|---|---|
| Jest | 29.x | Test framework and runner |
| @nestjs/testing | 10.x | Test module creation and DI |
| @golevelup/ts-jest | 0.4.x | Advanced mocking utilities (createMock) |
| ts-jest | 29.x | TypeScript support for Jest |
| supertest | 6.x | HTTP integration testing (e2e) |

## 3. Mandatory Rules

### AAA Pattern
Every test must follow Arrange-Act-Assert. Comments `// Arrange`, `// Act`, `// Assert` are required.

### Test Naming
- Describe blocks: class or module name (`NotesService`)
- Nested describe: method name (`getNoteById`)
- It blocks: `should [expected behavior] when [scenario]`

### Test Module Setup
Every unit test must create a `TestingModule` via `Test.createTestingModule()` with mocked providers using `createMock<T>()`.

### What to Test
- Application services (`application/services/`) — primary target
- Helpers and utilities (`application/common/`)
- Custom exception logic
- DTO transformations (if custom logic exists)

### What NOT to Test (in unit tests)
- Infrastructure implementations — use mocks instead
- Controllers directly — covered by e2e tests
- NestJS framework code (modules, decorators behavior)
- Third-party library internals

## 4. Test Doubles Usage

| Type | When to Use | Implementation |
|---|---|---|
| Mock function | Replace a method with controlled behavior | `jest.fn().mockResolvedValue(data)` |
| Spy | Observe calls without changing behavior | `jest.spyOn(service, 'method')` |
| Auto-mock | Full class/interface mock | `createMock<IService>()` from @golevelup/ts-jest |
| Dataset mock | Shared test data | Exported objects from `datasets/mocks/` |

### Rules
- Mock data lives in `test/datasets/mocks/`, shared across test files
- Use `createMock<T>()` for auto-mocking interfaces
- One behavior per test method
- Reset mocks between tests (`jest.clearAllMocks()` in `beforeEach`)

## 5. Coverage Requirements

### Minimum Thresholds

| Metric | Minimum |
|---|---|
| Line coverage | 90% |
| Branch coverage | 90% |
| Function coverage | 90% |
| Statement coverage | 90% |

### Coverage Exclusions
- Module files (`*.module.ts`) — DI wiring only
- DTO files (`*.dto.ts`) — data structures with decorators only
- Interface files (`*.interface.ts`) — type definitions
- Index/barrel files (`index.ts`) — re-exports only
- `main.ts` — bootstrap, tested via e2e

## 6. CI/CD Integration

### Pipeline Execution Order
1. **Lint** — ESLint strict rules must pass
2. **Unit Tests** — `npm run test` (all `*.test.ts` files)
3. **Coverage Check** — Must meet 90% thresholds
4. **SonarCloud Quality Gate** — Must pass all quality checks

### Rules
- All tests run as gates before deployment
- Test failures block the pipeline
- Coverage below threshold blocks the pipeline
- No skipped tests allowed in CI (`it.skip`, `describe.skip` forbidden in committed code)

## 7. Test Design Principles

### Single Responsibility
- Each test file tests ONE service or class
- Each `it()` block tests ONE behavior

### Independence
- Tests must not depend on execution order
- Tests must not share mutable state
- Each test creates its own test module and mocks

### Edge Cases (mandatory per test suite)
- Happy path (valid input, expected output)
- Error path (invalid input, exception thrown)
- Edge cases (empty input, null values, boundary values)
- Async error handling (rejected promises, timeouts)
