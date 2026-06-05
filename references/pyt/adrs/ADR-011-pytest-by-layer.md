# ADR-011: pytest Test Strategy by Layer

## Status

Accepted

## Decision

The default testing framework is pytest, organized by solution layer, using `conftest.py` fixtures and factory functions for test data.

### Conventions

- **AAA pattern** (Arrange-Act-Assert) is mandatory; one behavior per test
- **Fixtures** in `conftest.py` provide dependency setup; scope is `function` by default, `session` only for expensive resources (e.g. DB engine)
- **Factory functions** (or factory-boy) create test entities with sensible defaults and overrides
- **pytest-asyncio** for async tests; **AsyncMock** for mocking async ports in unit tests
- Naming: `test_{method}_{scenario}_{expected_result}`

## Consequences

- `tests/application.Tests` validates use case orchestration
- `tests/core.Tests` validates domain behavior
- Tests remain aligned with architectural boundaries
- Factory fixtures eliminate duplicate test-data setup across test files
