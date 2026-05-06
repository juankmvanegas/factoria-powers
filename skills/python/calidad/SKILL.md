---
name: python-calidad
description: "Use when code quality needs to be checked — linting, conventions, patterns, and coding standards compliance"
---

---
name: calidad
description: "Auto-skill for pytest testing, quality gates, and architecture validation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Calidad (Auto-Activated)

## Activation Trigger

This skill activates automatically when tests are written or modified, or when quality validation is needed.

## Purpose

Enforce testing standards, quality gates, and architecture validation rules for all Python/FastAPI code.

## Enforcement Rules

### AAA Pattern (Mandatory)

Every test MUST follow Arrange-Act-Assert:

```python
async def test_create_order_with_valid_data_returns_order():
    # Arrange
    repository = AsyncMock(spec=OrderRepository)
    use_case = CreateOrderUseCase(repository=repository)
    command = CreateOrderCommand(customer_id=uuid4(), items=[...])

    # Act
    result = await use_case.execute(command)

    # Assert
    assert result.id is not None
    assert result.status == "pending"
    repository.save.assert_called_once()
```

- Clearly separate the three sections with comments
- NEVER combine Act and Assert in the same statement

### Test Naming Convention

Format: `test_{method}_{scenario}_{expected}`

Examples:
- `test_create_order_with_valid_data_returns_order`
- `test_create_order_with_empty_items_raises_validation_error`
- `test_get_order_with_nonexistent_id_returns_none`

- Use snake_case
- Be descriptive — the name should explain the test without reading the body
- NEVER use generic names like `test_1`, `test_order`, `test_success`

### Async Testing with pytest-asyncio

- Use `@pytest.mark.asyncio` decorator for async tests
- Configure `asyncio_mode = "auto"` in pytest.ini or pyproject.toml
- Use `AsyncMock` for mocking async dependencies
- NEVER use `asyncio.run()` inside tests

### Test Doubles (pytest-mock)

- Use `AsyncMock(spec=ProtocolClass)` to mock Protocol-based ports
- Use `mocker.patch()` sparingly — prefer constructor injection
- NEVER mock what you don't own (mock the port, not the library)
- Use factories (or `pytest-factoryboy`) for complex test data

### One Behavior Per Test

- Each test MUST verify exactly ONE behavior
- Use parametrize for variations of the same behavior
- Split multi-assertion tests into separate tests unless assertions verify the same behavior

```python
@pytest.mark.parametrize("invalid_email", ["", "not-email", "@missing.com"])
async def test_create_user_with_invalid_email_raises_validation_error(invalid_email):
    ...
```

### conftest.py Fixture Organization

- Place shared fixtures in `conftest.py` at the appropriate level
- `tests/conftest.py` — global fixtures (db session, app client)
- `tests/unit/conftest.py` — unit test fixtures (mocks, factories)
- `tests/integration/conftest.py` — integration fixtures (test db, containers)
- Use `yield` fixtures for setup/teardown
- Scope fixtures appropriately (`session`, `module`, `function`)

### import-linter Architecture Validation

Configure in `pyproject.toml`:

```toml
[tool.importlinter]
root_packages = ["app"]

[[tool.importlinter.contracts]]
name = "Domain has no external dependencies"
type = "independence"
modules = ["app.domain"]

[[tool.importlinter.contracts]]
name = "Presentation does not import Infrastructure"
type = "forbidden"
source_modules = ["app.presentation"]
forbidden_modules = ["app.infrastructure"]

[[tool.importlinter.contracts]]
name = "Clean Architecture layers"
type = "layers"
layers = ["app.presentation", "app.application", "app.domain"]
```

- Run `lint-imports` as part of CI pipeline
- NEVER add exceptions or ignore rules — fix the architecture violation

### Quality Gates (ALL Must Pass)

1. **ruff check** — Linting (zero violations allowed)
2. **ruff format --check** — Formatting consistency
3. **mypy --strict** — Static type checking (zero errors allowed)
4. **pytest** — All tests pass
5. **pytest --cov** — Minimum 90% coverage
6. **lint-imports** — Architecture contracts satisfied

### Coverage Requirements

- Minimum 90% line coverage
- Domain layer: 100% coverage required
- Application layer: 95% coverage required
- Infrastructure layer: 80% coverage required (integration tests cover the rest)
- Presentation layer: 85% coverage required
- NEVER reduce coverage thresholds

## Source of Truth

`.cloud/policies/testing-policy.md`

## Auto-Shielding

If any rule above is violated during test generation or modification, the skill MUST:
1. Fix the violation immediately
2. Log the fix in the current session context
3. NEVER ask the user whether to comply — compliance is mandatory
