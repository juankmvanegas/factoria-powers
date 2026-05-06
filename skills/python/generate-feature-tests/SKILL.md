---
name: python-generate-feature-tests
description: "Use when services or components are implemented and need a complete test suite generated following the project testing policy and AAA pattern"
---

---
name: generate-feature-tests
description: "Generate comprehensive pytest test suite for a feature"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Feature Tests

## Purpose

Generate a complete test suite (unit + integration) for a feature across all Clean Architecture layers, following pytest best practices and the project's testing policy.

## Execution Flow â€” 7 Strict Steps

### Step 1: Analyze Feature Code

1. Identify all files belonging to the feature across layers:
   - Domain: entities, value objects, domain services
   - Application: use cases, DTOs, port interfaces
   - Infrastructure: repository implementations, adapters
   - Presentation: API endpoints, request/response models
2. Map dependencies between components
3. Identify external dependencies that need mocking

### Step 2: Generate Domain Layer Tests

```python
# tests/unit/domain/test_{entity}.py
import pytest
from app.domain.entities.{entity} import {Entity}

class TestEntity:
    def test_create_{entity}_with_valid_data_returns_entity(self):
        # Arrange
        data = {...}

        # Act
        entity = Entity(**data)

        # Assert
        assert entity.id is not None

    def test_create_{entity}_with_invalid_data_raises_domain_error(self):
        # Arrange / Act / Assert
        with pytest.raises(ValidationError):
            Entity(invalid_field="bad")
```

- Test ALL entity creation paths (valid + invalid)
- Test ALL value object validation rules
- Test domain service business logic
- 100% coverage required for domain layer

### Step 3: Generate Application Layer Tests

```python
# tests/unit/application/test_{use_case}.py
import pytest
from unittest.mock import AsyncMock
from app.application.use_cases.{use_case} import {UseCase}

class TestUseCase:
    @pytest.mark.asyncio
    async def test_execute_with_valid_command_returns_result(self):
        # Arrange
        repository = AsyncMock(spec=Repository)
        repository.get_by_id.return_value = mock_entity
        use_case = UseCase(repository=repository)

        # Act
        result = await use_case.execute(command)

        # Assert
        assert result is not None
        repository.save.assert_called_once()
```

- Mock ALL ports (repositories, external services)
- Test happy path + ALL error paths
- Verify correct port method calls
- 95% coverage required for application layer

### Step 4: Generate Infrastructure Layer Tests

```python
# tests/integration/test_{repository}.py
import pytest
from app.infrastructure.persistence.{repository} import SqlAlchemy{Repository}

class TestRepository:
    @pytest.mark.asyncio
    async def test_save_and_retrieve_{entity}(self, db_session):
        # Arrange
        repository = SqlAlchemy{Repository}(db_session)
        entity = create_test_entity()

        # Act
        saved = await repository.save(entity)
        retrieved = await repository.get_by_id(saved.id)

        # Assert
        assert retrieved is not None
        assert retrieved.id == saved.id
```

- Use real database (test container or in-memory SQLite)
- Test CRUD operations
- Test query filters and edge cases
- 80% coverage required for infrastructure layer

### Step 5: Generate Presentation Layer Tests

```python
# tests/integration/test_{endpoint}_api.py
import pytest
from httpx import AsyncClient

class TestEndpoint:
    @pytest.mark.asyncio
    async def test_create_{resource}_returns_201(self, client: AsyncClient):
        # Arrange
        payload = {...}

        # Act
        response = await client.post("/api/v1/{resource}", json=payload)

        # Assert
        assert response.status_code == 201
        assert response.json()["id"] is not None

    @pytest.mark.asyncio
    async def test_create_{resource}_with_invalid_data_returns_422(self, client: AsyncClient):
        # Arrange
        payload = {"invalid": "data"}

        # Act
        response = await client.post("/api/v1/{resource}", json=payload)

        # Assert
        assert response.status_code == 422
```

- Test ALL HTTP status codes (success + error)
- Test request validation (422 for invalid input)
- Test authentication/authorization (401, 403)
- 85% coverage required for presentation layer

### Step 6: Generate Shared Fixtures

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest.fixture
async def db_session(engine):
    async with AsyncSession(engine) as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client(db_session):
    app.dependency_overrides[get_session] = lambda: db_session
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
```

### Step 7: Run and Validate

1. Execute `pytest tests/ -v` to verify all tests pass
2. Execute `pytest tests/ --cov=app --cov-report=term-missing` to verify coverage
3. Fix any failing tests
4. Report results to user

## Rules

- EVERY test MUST follow AAA pattern with clear section comments
- EVERY test MUST follow naming convention: `test_{method}_{scenario}_{expected}`
- NEVER use `asyncio.run()` inside tests â€” use `@pytest.mark.asyncio`
- NEVER share state between tests â€” each test is independent
- ONE behavior per test â€” no multi-assertion tests unless verifying the same behavior
- Use `pytest.raises()` for exception testing, not try/except
- Generate `conftest.py` fixtures at appropriate scope levels
