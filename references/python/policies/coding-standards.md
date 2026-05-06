# Coding Standards Policy — Python / FastAPI

> Applicable to all Python/FastAPI projects governed by Factoria-Python.
> Violations are flagged during code review and CI/CD pipeline execution.

---

## 1. Architecture Standards

All Python/FastAPI projects MUST follow **Clean Architecture with 4 layers**:

```
Domain  ←  Application  ←  Infrastructure
                                  ↑
                API (composition root) → all
```

### Layer Rules

| Layer | Allowed Dependencies | Purpose |
|-------|---------------------|---------|
| **Domain** | stdlib + `typing` ONLY | Entities, value objects, domain exceptions, domain services |
| **Application** | Domain ONLY | Use cases, ports (Protocol), DTOs (Pydantic) |
| **Infrastructure** | Domain + Application | Port implementations (repos, clients, adapters) |
| **API** | All layers (composition root) | FastAPI routers, dependency injection, exception handlers |

### Absolute Rules

- Domain has **ZERO** third-party imports. Only Python standard library and `typing` are allowed.
- Application depends **ONLY** on Domain. It defines Ports as `typing.Protocol`.
- Infrastructure **implements** Application ports. It NEVER defines business logic.
- API is the **composition root** only. It wires dependencies via `Depends()` and exposes HTTP endpoints.
- Dependency direction is enforced by `import-linter` in CI. Violations block merge.

---

## 2. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Entity | PascalCase domain noun | `Note`, `NoteList`, `User` |
| Value Object | PascalCase descriptor | `EmailAddress`, `Money` |
| Port (interface) | `{Entity}{Role}Port` Protocol | `NoteRepositoryPort`, `EmailSenderPort` |
| Use Case | `{Action}{Entity}UseCase` | `CreateNoteUseCase`, `DeleteUserUseCase` |
| Service (domain) | `{Entity}Service` | `NoteService`, `PricingService` |
| Repository impl | `SQLAlchemy{Entity}Repository` | `SQLAlchemyNoteRepository` |
| DTO Input | `{Entity}CreateInput` / `{Entity}UpdateInput` | `NoteCreateInput`, `NoteUpdateInput` |
| DTO Output | `{Entity}Output` | `NoteOutput`, `UserOutput` |
| Router module | `{entity}_router.py` (snake_case) | `note_router.py`, `user_router.py` |
| Exception | `{Concept}Error` | `NotFoundError`, `BusinessError` |
| ORM Model | `{Entity}Model` | `NoteModel`, `UserModel` |
| Test function | `test_{method}_{scenario}_{expected}` | `test_create_note_valid_input_returns_note` |
| Fixture | descriptive snake_case | `sample_note`, `db_session` |
| Config class | `{Section}Settings` (Pydantic) | `DatabaseSettings`, `RedisSettings` |

---

## 3. Module and Package Rules

- All module names: **snake_case** (`note_repository.py`, `create_note_use_case.py`)
- All class names: **PascalCase** (`CreateNoteUseCase`, `NoteRepositoryPort`)
- All function names: **snake_case** (`create_note`, `get_by_id`)
- All constants: **UPPER_SNAKE_CASE** (`MAX_RETRIES`, `DEFAULT_PAGE_SIZE`)
- Every module MUST start with `from __future__ import annotations`
- Type hints are **MANDATORY** on all function signatures (parameters and return types)
- Use `|` union syntax (Python 3.10+) instead of `Union[]` and `Optional[]`
- Prefer `list[T]`, `dict[K, V]`, `set[T]` over `List`, `Dict`, `Set` from `typing`

---

## 4. Dependency Injection Pattern

FastAPI's `Depends()` is the DI mechanism. Each layer provides factory functions:

```python
# infrastructure/dependencies.py
def get_note_repository(session: AsyncSession = Depends(get_session)) -> NoteRepositoryPort:
    return SQLAlchemyNoteRepository(session)

# application/dependencies.py
def get_create_note_use_case(
    repo: NoteRepositoryPort = Depends(get_note_repository),
) -> CreateNoteUseCase:
    return CreateNoteUseCase(repo)

# api/routers/note_router.py
@router.post("/notes")
async def create_note(
    input: NoteCreateInput,
    use_case: CreateNoteUseCase = Depends(get_create_note_use_case),
) -> NoteOutput:
    return await use_case.execute(input)
```

### Rules

- API routers NEVER import Infrastructure classes directly
- Factory functions return the Port type, not the implementation type
- All DI wiring goes through `Depends()` chains
- NEVER use global mutable state for dependency storage

---

## 5. Error Handling

### Custom Exception Hierarchy

```
DomainError (base)
├── BusinessError          → 400 Bad Request
├── NotFoundError          → 404 Not Found
├── ConflictError          → 409 Conflict
├── ValidationError        → 422 Unprocessable Entity
└── AuthorizationError     → 403 Forbidden
```

### Rules

- All domain errors inherit from `DomainError`
- API layer maps domain errors to HTTP status codes via exception handlers
- NEVER expose stack traces in API responses
- NEVER catch generic `Exception` without re-raising or logging
- Use `raise ... from err` to preserve exception chains
- HTTP responses use a consistent error envelope: `{"error": {"code": "...", "message": "..."}}`

---

## 6. Logging

- Use **structlog** exclusively for all logging
- NEVER use `print()` for any purpose in production code
- NEVER use `logging.basicConfig()` or raw `logging.getLogger()`
- All log output MUST be structured JSON
- Every request MUST carry a correlation ID (`request_id`)
- Log levels: `debug`, `info`, `warning`, `error`, `critical`
- Sensitive data (passwords, tokens, PII) MUST NEVER appear in logs

```python
import structlog
logger = structlog.get_logger()

logger.info("note_created", note_id=note.id, user_id=user.id)
```

---

## 7. Configuration

- Use **Pydantic `BaseSettings`** for all configuration
- `.env` files for local development only
- Environment variables for staging and production
- NEVER hardcode secrets, connection strings, or API keys in source code
- Configuration classes live in `infrastructure/config/`
- Use `Field(default=..., description="...")` for documentation
- Validate configuration at application startup (fail fast)

```python
from pydantic_settings import BaseSettings

class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DB_")
    host: str
    port: int = 5432
    name: str
    user: str
    password: str
```

---

## 8. Code Quality

### Linting and Formatting

- **Ruff** is the sole linter and formatter (replaces black, isort, flake8, pylint)
- Configuration in `pyproject.toml` under `[tool.ruff]`
- Line length: 120 characters maximum
- Import sorting: isort-compatible via Ruff

### Type Checking

- **mypy** in strict mode (`strict = true` in `pyproject.toml`)
- All functions MUST have complete type annotations
- No `# type: ignore` without a specific error code and justification comment
- Use `typing.Protocol` for structural subtyping (ports)

### Async/Await

- All I/O operations MUST use `async/await`
- NEVER use synchronous I/O in async contexts (blocks the event loop)
- Use `asyncio.to_thread()` for unavoidable synchronous operations
- Prefer `httpx.AsyncClient` over `requests`

### Pre-commit

- All projects MUST configure pre-commit hooks:
  - `ruff check --fix`
  - `ruff format`
  - `mypy`
  - Secret detection (`detect-secrets`)

---

## 9. CHANGELOG Format

All projects MUST maintain a `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```

- Every merge to main MUST update the CHANGELOG
- Entries MUST reference the issue/ticket number
- Version numbers follow Semantic Versioning (SemVer)
