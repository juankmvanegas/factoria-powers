# Testing Policy — Python / FastAPI

> All production code MUST have tests. No exceptions.

---

## 1. Mandatory Testing

- Every use case, service, repository, and router MUST have corresponding tests
- No code reaches `main` branch without passing all test suites
- Test coverage is measured and enforced in CI/CD
- Pull requests with failing tests are automatically blocked

---

## 2. Test Framework Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **pytest** | 8.x+ | Test runner and framework |
| **pytest-asyncio** | 0.24+ | Async test support |
| **httpx** | 0.27+ | Async HTTP client for API testing (TestClient alternative) |
| **pytest-cov** | latest | Coverage measurement and reporting |
| **factory-boy** | latest (optional) | Test data factories |
| **pytest-mock** | latest | Fixture-based mocking (`mocker` fixture) |
| **unittest.mock** | stdlib | AsyncMock for async mocking |
| **import-linter** | latest | Architecture contract verification |
| **Faker** | latest (optional) | Realistic test data generation |

---

## 3. Test Organization

```
tests/
  conftest.py                    → Shared fixtures (db session, client, factories)
  architecture/
    test_layer_contracts.py      → import-linter contract verification (IMMUTABLE)
  unit/
    domain/
      test_entities.py           → Domain entity behavior tests
      test_value_objects.py      → Value object validation tests
      test_exceptions.py         → Exception hierarchy tests
    application/
      test_create_note.py        → Use case unit tests
      test_update_note.py
      test_delete_note.py
  integration/
    infrastructure/
      test_note_repository.py    → Repository against real DB (testcontainers)
      test_external_client.py    → External service integration
    api/
      test_note_router.py        → Full HTTP request/response cycle
      test_auth_router.py
      test_exception_handlers.py → Error response format verification
```

### Layer Testing Responsibilities

| Layer | Test Type | What to Test |
|-------|-----------|-------------|
| Domain | Unit | Entity behavior, value object validation, domain services |
| Application | Unit | Use case logic with mocked ports |
| Infrastructure | Integration | Repository implementations against real database |
| API | Integration | Full HTTP cycle, status codes, response shapes, auth |

---

## 4. AAA Pattern

All tests MUST follow the **Arrange-Act-Assert** pattern:

```python
async def test_create_note_valid_input_returns_note():
    # Arrange
    repo = AsyncMock(spec=NoteRepositoryPort)
    repo.save.return_value = Note(id=uuid4(), title="Test", content="Body")
    use_case = CreateNoteUseCase(repo)
    input_data = NoteCreateInput(title="Test", content="Body")

    # Act
    result = await use_case.execute(input_data)

    # Assert
    assert result.title == "Test"
    repo.save.assert_called_once()
```

- **Arrange**: Set up test data, mocks, and dependencies
- **Act**: Execute the single behavior under test
- **Assert**: Verify the expected outcome
- ONE behavior per test — NEVER test multiple behaviors in a single test function

---

## 5. Test Naming Convention

All test functions MUST follow the pattern:

```
test_{method}_{scenario}_{expected_result}
```

Examples:

```python
def test_create_note_valid_input_returns_note(): ...
def test_create_note_empty_title_raises_validation_error(): ...
def test_get_note_nonexistent_id_raises_not_found(): ...
def test_delete_note_unauthorized_user_raises_forbidden(): ...
def test_list_notes_empty_database_returns_empty_list(): ...
```

---

## 6. Parametrize for Multiple Scenarios

Use `@pytest.mark.parametrize` when testing the same behavior with different inputs:

```python
@pytest.mark.parametrize("title,expected_valid", [
    ("Valid Title", True),
    ("", False),
    ("A" * 256, False),
    ("Normal Note", True),
])
def test_note_title_validation(title: str, expected_valid: bool):
    if expected_valid:
        note = Note(title=title, content="body")
        assert note.title == title
    else:
        with pytest.raises(ValidationError):
            Note(title=title, content="body")
```

- Group related scenarios into a single parametrized test
- Use descriptive parameter IDs when scenarios are not self-explanatory

---

## 7. Async Tests

All async test functions MUST use the `@pytest.mark.asyncio` decorator:

```python
@pytest.mark.asyncio
async def test_create_note_valid_input_returns_note():
    ...
```

- Configure `asyncio_mode = "auto"` in `pyproject.toml` to avoid decorator on every test (recommended)
- Use `httpx.AsyncClient` for async API testing
- NEVER mix sync and async test patterns in the same test function

---

## 8. Test Doubles

### AsyncMock for Async Ports

```python
from unittest.mock import AsyncMock

repo = AsyncMock(spec=NoteRepositoryPort)
repo.get_by_id.return_value = sample_note
```

### pytest-mock for Fixture-Based Mocking

```python
async def test_use_case_logs_on_creation(mocker):
    mock_logger = mocker.patch("app.application.use_cases.create_note.logger")
    ...
    mock_logger.info.assert_called_once()
```

### Factory Functions for Test Data

```python
# tests/conftest.py
@pytest.fixture
def sample_note() -> Note:
    return Note(
        id=uuid4(),
        title="Sample Note",
        content="Sample content for testing",
        created_at=datetime.now(UTC),
    )

@pytest.fixture
def note_factory():
    def _create(**overrides) -> Note:
        defaults = {"id": uuid4(), "title": "Note", "content": "Content"}
        return Note(**{**defaults, **overrides})
    return _create
```

- Prefer factory functions over complex fixture hierarchies
- Use `factory-boy` for entities with many fields or complex relationships
- NEVER use production data in tests

---

## 9. Architecture Tests are IMMUTABLE

**When architecture tests fail, fix the CODE, NEVER the contract.**

Architecture tests defined in `tests/architecture/` verify layer boundary compliance using `import-linter`. These tests are considered the source of truth for the system's structural integrity.

### Rules

- Architecture test files MUST NOT be modified without explicit architectural review
- If a contract fails, the offending import in production code MUST be corrected
- New layers or modules require NEW contracts — existing contracts are NEVER relaxed
- Contract definitions live in `pyproject.toml` under `[tool.importlinter]`

---

## 10. Coverage Requirements

| Metric | Minimum Threshold |
|--------|------------------|
| Overall line coverage | **90%** |
| Domain layer coverage | **95%** |
| Application layer coverage | **95%** |
| Infrastructure layer coverage | **85%** |
| API layer coverage | **85%** |
| Branch coverage | **80%** |

- Coverage is measured with `pytest-cov`
- CI fails if any threshold is not met
- Coverage reports are generated in HTML and XML formats
- Exclude from coverage: `__init__.py` files, configuration modules, type stubs

```ini
# pyproject.toml
[tool.coverage.run]
source = ["app"]
omit = ["*/migrations/*", "*/__init__.py"]

[tool.coverage.report]
fail_under = 90
```

---

## 11. CI/CD Test Execution Order

Tests MUST execute in the following strict order in CI/CD pipelines:

```
1. Architecture Tests (import-linter)    → Fail fast on structural violations
2. Lint (Ruff)                           → Code quality and formatting
3. Type Check (mypy --strict)            → Type safety verification
4. Unit Tests (tests/unit/)              → Fast, isolated logic tests
5. Integration Tests (tests/integration/) → Slower, real-dependency tests
```

- If any step fails, subsequent steps are SKIPPED
- Architecture tests run first because they are the cheapest to verify
- Unit tests run before integration tests because they are faster

---

## 12. Test Fixtures Pattern

### conftest.py Scoping

```python
# tests/conftest.py — shared across ALL tests

@pytest.fixture(scope="session")
def event_loop():
    """Create a single event loop for the entire test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db_engine():
    """Database engine shared across the session (created once)."""
    engine = create_async_engine(TEST_DATABASE_URL)
    yield engine
    await engine.dispose()

@pytest.fixture(scope="function")
async def db_session(db_engine):
    """Fresh database session per test (rolled back after each test)."""
    async with AsyncSession(db_engine) as session:
        async with session.begin():
            yield session
            await session.rollback()

@pytest.fixture(scope="function")
async def client(db_session):
    """HTTP test client with overridden dependencies."""
    app.dependency_overrides[get_session] = lambda: db_session
    async with httpx.AsyncClient(app=app, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
```

### Scope Rules

| Scope | Use Case |
|-------|----------|
| `session` | Expensive resources: DB engine, Docker containers |
| `module` | Resources shared within a test file |
| `function` | Default — fresh state per test (PREFERRED) |

- Default to `function` scope unless there is a clear performance reason
- NEVER share mutable state between tests via `session`-scoped fixtures
- Each test MUST be independent and runnable in isolation
