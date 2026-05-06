# ADR-005: Repository Pattern with SQLAlchemy Async

## Status
Accepted

## Date
2025-06-01

## Context
Data access is one of the most critical concerns in any backend service. We need a pattern that decouples business logic from database technology, supports async operations for non-blocking I/O, and enables easy testing through mocking. The chosen approach must also support transactions spanning multiple repository operations.

## Decision
We adopt the **Repository Pattern** with **SQLAlchemy 2.0 async sessions**.

### Port Definition (Application Layer)

Ports are defined as `typing.Protocol` in the Application layer:

```python
from typing import Protocol

class NoteRepositoryPort(Protocol):
    async def get_by_id(self, note_id: UUID) -> Note | None: ...
    async def save(self, note: Note) -> Note: ...
    async def delete(self, note_id: UUID) -> None: ...
    async def list_all(self, offset: int = 0, limit: int = 50) -> list[Note]: ...
```

### Implementation (Infrastructure Layer)

Repositories are implemented in Infrastructure using SQLAlchemy 2.0:

```python
class SQLAlchemyNoteRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, note_id: UUID) -> Note | None:
        result = await self._session.get(NoteModel, note_id)
        return result.to_domain() if result else None
```

### Key Design Decisions

- **AsyncSession** for all database operations (non-blocking I/O)
- **Unit of Work pattern** for transaction management — the session acts as the unit of work
- ORM models (Infrastructure) are mapped to domain entities via explicit `to_domain()` / `from_domain()` methods
- Repositories NEVER return ORM models to the Application layer — always domain entities
- `select()` style queries (SQLAlchemy 2.0) instead of legacy `Query` API

## Consequences
### Positive
- Business logic is completely decoupled from SQLAlchemy
- Use cases can be tested with `AsyncMock` ports (no database needed)
- Async sessions provide non-blocking database access suitable for FastAPI
- Repository implementations can be swapped (e.g., from PostgreSQL to MongoDB) without changing use cases
- Unit of Work via session manages transactions consistently

### Negative
- Mapping between ORM models and domain entities adds boilerplate
- Developers must understand both the domain model and the ORM model
- Async session management requires careful handling (session scoping, connection pooling)

### Neutral
- SQLAlchemy 2.0 is a mature, well-documented ORM with strong community support
- The pattern is consistent with the Repository Pattern used in the .NET factory (replacing EF Core with SQLAlchemy)
