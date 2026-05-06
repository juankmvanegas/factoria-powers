# ADR-011: pytest with Fixtures and Factory Pattern

## Status
Accepted

## Date
2025-06-01

## Context
A consistent testing strategy is essential for maintaining code quality and enabling confident refactoring. We need a test framework that supports async testing, provides powerful fixture mechanisms for dependency setup, and encourages patterns that keep tests readable and maintainable.

## Decision
We adopt **pytest** as the test framework with **conftest.py fixtures** and **factory functions** (or factory-boy) for test data creation.

### Test Structure

```
tests/
  conftest.py                    → Shared fixtures (session, module, function scope)
  architecture/
    test_layer_contracts.py      → import-linter verification
  unit/
    application/
      test_create_note.py        → Use case tests with mocked ports
  integration/
    infrastructure/
      test_note_repository.py    → Repository tests against real DB
    api/
      test_note_router.py        → HTTP endpoint tests
```

### Fixture Strategy

```python
# tests/conftest.py
@pytest.fixture
def sample_note() -> Note:
    return Note(id=uuid4(), title="Test Note", content="Content")

@pytest.fixture
def note_factory():
    def _create(**overrides) -> Note:
        defaults = {"id": uuid4(), "title": "Note", "content": "Content"}
        return Note(**{**defaults, **overrides})
    return _create
```

### Key Design Decisions

- **AAA pattern** (Arrange-Act-Assert) is mandatory for all tests
- **One behavior per test** — NEVER test multiple behaviors in a single test function
- **Factory functions** for creating test entities with sensible defaults and overrides
- **factory-boy** (optional) for entities with complex relationships
- **pytest-asyncio** for async test functions
- **AsyncMock** for mocking async ports in unit tests
- Fixture scoping: `function` by default, `session` only for expensive resources (DB engine)

### Naming Convention

```
test_{method}_{scenario}_{expected_result}
```

## Consequences
### Positive
- pytest is the de facto standard for Python testing — large ecosystem of plugins
- Fixtures provide clean dependency injection for tests
- Factory pattern eliminates duplicate test data setup across test files
- AAA pattern keeps tests readable and consistently structured
- Async support via pytest-asyncio enables testing of async use cases

### Negative
- Complex fixture hierarchies can become hard to debug
- Factory functions add another layer of abstraction in test setup
- pytest-asyncio configuration requires attention (event loop management)

### Neutral
- The pattern mirrors the testing approach in .NET (replacing xUnit fixtures with pytest fixtures)
- Test data factories replace NSubstitute-style builders with Python equivalents
