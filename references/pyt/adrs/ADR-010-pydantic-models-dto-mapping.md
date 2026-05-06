# ADR-010: Pydantic Models as DTOs with Built-in Mapping

## Status
Accepted

## Date
2025-06-01

## Context
In layered architectures, data transfer between layers requires mapping mechanisms. In .NET, libraries like AutoMapper handle this concern. Python needs an equivalent strategy that is explicit, type-safe, and does not introduce unnecessary complexity or "magic" mapping behavior.

## Decision
We use **Pydantic models** as both DTOs and the mapping mechanism, leveraging `model_validate()` and `model_dump()` for conversions. No separate mapping library is needed.

### DTO Types and Their Location

| DTO Type | Layer | Purpose |
|----------|-------|---------|
| `{Entity}CreateInput` | Application | Incoming data for creation |
| `{Entity}UpdateInput` | Application | Incoming data for updates |
| `{Entity}Output` | Application | Outgoing response data |
| Domain Entity | Domain | Core business model (also Pydantic) |
| `{Entity}Model` | Infrastructure | SQLAlchemy ORM model |

### Mapping Flow

```
API Request → Pydantic Input DTO → Domain Entity → ORM Model → DB
DB → ORM Model → Domain Entity → Pydantic Output DTO → API Response
```

### Mapping Methods

```python
# Domain Entity (Pydantic BaseModel in Domain layer)
class Note:
    id: UUID
    title: str
    content: str
    created_at: datetime

# Input DTO → Domain Entity
note = Note(id=uuid4(), **input_dto.model_dump(), created_at=datetime.now(UTC))

# ORM Model → Domain Entity
class NoteModel(Base):
    def to_domain(self) -> Note:
        return Note.model_validate(self, from_attributes=True)

    @classmethod
    def from_domain(cls, entity: Note) -> NoteModel:
        return cls(**entity.model_dump())

# Domain Entity → Output DTO
output = NoteOutput.model_validate(note, from_attributes=True)
```

### Key Design Decisions

- Domain entities also use Pydantic `BaseModel` for validation at the domain level
- `model_validate(obj, from_attributes=True)` enables ORM-to-Pydantic mapping without manual field assignment
- `model_dump()` converts Pydantic models to dictionaries for ORM construction
- No AutoMapper equivalent — mappings are explicit and visible in code
- Output DTOs can exclude or rename fields relative to the domain entity

## Consequences
### Positive
- Explicit mapping — no hidden conventions or runtime magic
- Type-safe: mypy verifies mapping correctness at build time
- `from_attributes=True` provides ORM compatibility without custom code
- Single library (Pydantic) handles validation, serialization, and mapping
- Domain entities get validation from Pydantic without third-party imports in Domain layer

### Negative
- Mapping boilerplate in `to_domain()` / `from_domain()` methods
- Pydantic is technically a third-party import in Domain — mitigated by it being the validation foundation
- Complex nested mappings require explicit handling

### Neutral
- The approach replaces AutoMapper (used in .NET factory) with native Pydantic capabilities
- Team must follow the convention of explicit `to_domain()` / `from_domain()` methods consistently
