# Testing Policy — Factoria Next.js 14

> **MANDATORY POLICY.** All production code must have tests.
> No code is delivered without tests. No exceptions.

---

## 1. Fundamental Principle

All code that reaches production MUST be backed by automated tests. Tests are first-class citizens: they are written, reviewed, and maintained with the same rigor as production code.

- Code without tests is NOT approved in code review.
- Broken tests block the CI/CD pipeline.
- Architecture tests are immutable: the code is fixed, NEVER the test.

---

## 2. Testing Stack

| Tool | Version | Purpose |
|-------------|---------|-----------|
| Jest | 29.x | Test runner and assertion framework |
| React Testing Library | 14.x | React component testing |
| jest-environment-jsdom | 29.x | DOM environment for component tests |
| @testing-library/user-event | 14.x | User interaction simulation |
| Playwright | Latest | End-to-end (E2E) tests |
| @testing-library/jest-dom | Latest | Additional DOM matchers |

### 2.1 Base Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.enum.ts',
  ],
};
```

---

## 3. Test File Structure

### 3.1 Naming Convention

| Source file | Test file |
|----------------|-----------------|
| `notes.service.ts` | `notes.service.test.ts` |
| `api-notes.adapter.ts` | `api-notes.adapter.test.ts` |
| `notes-table.tsx` | `notes-table.test.tsx` |
| `use-notes.ts` | `use-notes.test.ts` |
| `notes.store.ts` | `notes.store.test.ts` |
| `app/api/notes/route.ts` | `app/api/notes/route.test.ts` |

### 3.2 Location

- The test file is placed next to the source file (co-located).
- NEVER create separate `__tests__` folders.
- E2E tests (Playwright) go in the `e2e/` folder at the project root.

```
src/application/notes/
  use-cases/
    notes.use-cases.ts
  adapters/
    notes.adapter.ts
src/infrastructure/notes/
  adapters/
    api-notes.adapter.ts
    api-notes.adapter.test.ts      ← Test next to the file
src/presentation/notes/
  components/
    notes-table.tsx
    notes-table.test.tsx           ← Test next to the component
e2e/
  notes.spec.ts                    ← E2E tests
```

---

## 4. Mandatory Rules

### 4.1 AAA Pattern (Arrange-Act-Assert)

Every test MUST explicitly follow the AAA pattern:

```typescript
it('should return notes list when service is called', () => {
  // Arrange
  const mockAdapter = createMockNotesAdapter();
  const service = new NotesService(mockAdapter);

  // Act
  const result = await service.getNotes();

  // Assert
  expect(result).toHaveLength(3);
  expect(result[0].title).toBe('First Note');
});
```

### 4.2 Test Naming

- Mandatory format: `should [expected behavior] when [scenario]`
- The name must describe the behavior, NOT the implementation.

```typescript
// CORRECT
it('should return empty array when no notes exist', () => { ... });
it('should throw error when adapter rejects with 500', () => { ... });
it('should display loading spinner when data is fetching', () => { ... });

// INCORRECT
it('test getNotes', () => { ... });
it('works correctly', () => { ... });
it('should call the mock', () => { ... });
```

### 4.3 describe/it Structure

- `describe()` groups by class/function/component and then by method or feature.
- `it()` for each individual case.
- One behavior per test.

```typescript
describe('NotesService', () => {
  describe('getNotes', () => {
    it('should return notes list when adapter returns data', () => { ... });
    it('should return empty array when adapter returns empty', () => { ... });
    it('should throw error when adapter rejects', () => { ... });
  });

  describe('createNote', () => {
    it('should return created note when input is valid', () => { ... });
    it('should throw validation error when title is empty', () => { ... });
  });
});
```

### 4.4 Mocking

- Use `jest.mock()` to mock services, adapters, and external modules.
- NEVER mock the unit under test — only its dependencies.
- Create factory functions for reusable mocks.

```typescript
// Correct: mock the dependency
const mockAdapter: jest.Mocked<NotesAdapter> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
};

// INCORRECT: mock the unit under test
jest.mock('./notes.service'); // DO NOT do this if you are testing NotesService
```

### 4.5 Component Testing

- Use `render()` from React Testing Library.
- Use `screen` for DOM queries.
- Use `@testing-library/user-event` for user interactions.
- NEVER test implementation details (internal state, private methods).
- Test what the user sees and does.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should display note title when note is rendered', () => {
  // Arrange
  render(<NoteCard note={mockNote} />);

  // Act — no action needed for render test

  // Assert
  expect(screen.getByText('My Note Title')).toBeInTheDocument();
});

it('should call onDelete when delete button is clicked', async () => {
  // Arrange
  const onDelete = jest.fn();
  render(<NoteCard note={mockNote} onDelete={onDelete} />);

  // Act
  await userEvent.click(screen.getByRole('button', { name: /delete/i }));

  // Assert
  expect(onDelete).toHaveBeenCalledWith(mockNote.id);
});
```

---

## 5. Coverage per Artifact Type

### 5.1 Mandatory Coverage Matrix

| Artifact | Tests Required | Target Coverage | Mandatory |
|-----------|------------------|-------------------|-------------|
| Application Services | YES — all business logic | 100% | YES |
| Infrastructure Adapters | YES — HTTP calls, response mapping | 100% | YES |
| Route Handlers | YES — request/response contracts | 100% | YES |
| Hooks with logic | YES — flows and states | 100% | YES |
| Stores (Zustand) | YES — actions and selectors | 100% | YES |
| Components with significant logic | CONDITIONAL — only if they have business logic or complex flows | 80%+ | CONDITIONAL |
| Simple display components | NO — if they only render props | N/A | NO |
| DTOs and Enums | NO — they are types, not logic | N/A | NO |
| Barrel files (index.ts) | NO — only re-exports | N/A | NO |

### 5.2 Definition of "Significant Logic" in Components

A component has significant logic if it meets at least one of these criteria:
- Contains conditional logic that affects rendering.
- Handles forms with validation.
- Has side effects (useEffect with logic).
- Transforms data before rendering.
- Manages complex state (more than 2 interrelated useState).

---

## 6. Mandatory Edge Cases

For EACH service, adapter, and route handler, the following scenarios MUST have tests:

### 6.1 Empty Responses

```typescript
it('should return empty array when API returns no data', () => { ... });
it('should handle null response gracefully', () => { ... });
it('should handle undefined fields in response', () => { ... });
```

### 6.2 HTTP Errors

```typescript
it('should throw unauthorized error when API returns 401', () => { ... });
it('should throw not found error when API returns 404', () => { ... });
it('should throw bad request error when API returns 400', () => { ... });
it('should throw server error when API returns 500', () => { ... });
```

### 6.3 Promise Rejection

```typescript
it('should handle network error when fetch rejects', () => { ... });
it('should handle timeout when request takes too long', () => { ... });
```

### 6.4 Invalid Parameters

```typescript
it('should throw validation error when id is empty string', () => { ... });
it('should throw validation error when required field is missing', () => { ... });
it('should handle special characters in input', () => { ... });
```

### 6.5 Authentication State

```typescript
it('should redirect to login when session is expired', () => { ... });
it('should display user data when session is active', () => { ... });
it('should return 401 when route handler receives no session', () => { ... });
```

### 6.6 Rendering Context

```typescript
it('should render correctly as Server Component', () => { ... });
it('should hydrate correctly as Client Component', () => { ... });
```

---

## 7. CI/CD Pipeline — Execution Order

### 7.1 Mandatory Sequence

The pipeline executes the following stages in strict order. If a stage fails, the subsequent ones are NOT executed:

```
1. Lint          → next lint (zero warnings, zero errors)
2. Build         → next build (successful compilation)
3. Unit Tests    → npm test -- --watchAll=false (all pass)
4. E2E Tests     → npx playwright test (only in CI)
```

### 7.2 Detail per Stage

| Stage | Command | Success Criteria | Environment |
|-------|---------|-------------------|---------|
| Lint | `next lint` | Zero warnings, zero errors | Local + CI |
| Build | `next build` | Successful compilation without TypeScript errors | Local + CI |
| Unit Tests | `npm test -- --watchAll=false` | 100% of tests pass | Local + CI |
| E2E Tests | `npx playwright test` | All scenarios pass | CI only |

### 7.3 Pipeline Rules

- A failed test BLOCKS the merge. No exceptions.
- Flaky (intermittent) tests are treated as bugs and fixed immediately.
- NEVER use `.skip()` or `.only()` in commits to the main branch.
- NEVER disable tests to make the pipeline pass.

---

## 8. Metrics and Thresholds

### 8.1 Mandatory Metrics

| Metric | Threshold | Mandatory |
|---------|--------|-------------|
| Tests pass | 100% | YES — Blocks merge if any fail |
| Build without errors | 100% | YES — Blocks merge if it fails |
| Lint without errors | 100% | YES — Blocks merge if there are errors |
| Lint without warnings | 100% | YES — Warnings are treated as errors |
| Services with tests | 100% | YES — Every service has a test |
| Adapters with tests | 100% | YES — Every adapter has a test |
| Route Handlers with tests | 100% | YES — Every route handler has a test |
| Hooks with logic tested | 100% | YES — Every hook with logic has a test |
| Stores tested | 100% | YES — Every store has a test |

### 8.2 Coverage Metrics

- Global coverage is NOT a quality metric on its own.
- What matters is that mandatory artifacts (section 5.1) have tests.
- High coverage without meaningful tests is worse than moderate coverage with quality tests.

---

## 9. Best Practices

### 9.1 Tests as Documentation

- Tests are the living documentation of the system's behavior.
- A new developer should be able to understand what a service does by reading its tests.
- Descriptive names and the AAA pattern make tests self-explanatory.

### 9.2 Test Independence

- Each test MUST be independent of others.
- NEVER depend on execution order.
- Use `beforeEach` for setup, `afterEach` for cleanup.
- NEVER share mutable state between tests.

### 9.3 Speed

- Unit tests MUST execute in less than 30 seconds for the full suite.
- If a test is slow, it is probably doing too much or not mocking correctly.
- E2E tests are inherently slower — optimize with parallelism in CI.

### 9.4 Maintainability

- Extract test data into factories or fixtures.
- Create helpers for repetitive patterns (rendering with providers, creating mocks).
- Review and update tests when the code behavior changes.
- NEVER copy and paste tests — refactor into shared functions.

---

## 10. Testing Violation Severity Table

| Severity | Violation | Action |
|-----------|-----------|--------|
| **CRITICAL** | Service/Adapter/Route Handler without tests | Merge blocked. Tests must be added. |
| **CRITICAL** | Disabled test (.skip) on main branch | Merge blocked. Reactivate or remove the test. |
| **CRITICAL** | Test pipeline disabled or bypassed | Merge blocked. Restore the pipeline. |
| **HIGH** | Test without AAA pattern | Correction required before merge. |
| **HIGH** | Test that depends on another test (execution order) | Correction required before merge. |
| **HIGH** | Missing mandatory edge cases (section 6) | Correction required before merge. |
| **MEDIUM** | Test naming does not follow convention | Correction required. May be approved with a correction plan. |
| **MEDIUM** | Excessive mocking that does not reflect real behavior | Correction required. Review mock strategy. |
| **LOW** | Duplicated or redundant test | Warning. Clean up in next iteration. |
| **LOW** | Missing helper/factory for test data | Warning. Refactor when possible. |
