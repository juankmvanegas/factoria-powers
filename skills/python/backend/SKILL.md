---
name: python-backend
description: "Use when backend-specific implementation guidance is needed for this factory's backend stack"
---

---
name: backend
description: "Auto-skill for Python/FastAPI backend — applies Clean Architecture 4 layers, DI, Pydantic, and enterprise standards"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Backend (Auto-Activated)

## Activation Trigger

This skill activates automatically when Python/FastAPI code is written or modified.

## Purpose

Enforce Clean Architecture 4-layer structure, dependency injection, and enterprise coding standards across all Python/FastAPI backend code.

## Enforcement Rules

### Clean Architecture 4 Layers

1. **Domain** (`domain/`) — Entities, value objects, domain events, repository protocols. ZERO external dependencies.
2. **Application** (`application/`) — Use cases, DTOs (Pydantic BaseModel), port interfaces (Protocol). Depends only on Domain.
3. **Infrastructure** (`infrastructure/`) — Repository implementations, external service adapters, ORM models. Depends on Domain + Application.
4. **Presentation** (`presentation/`) — FastAPI routers, request/response schemas, middleware. Depends on Application only.

### Dependency Flow

- Domain depends on NOTHING
- Application depends on Domain
- Infrastructure depends on Domain + Application
- Presentation depends on Application
- NEVER import from Infrastructure in Presentation — use DI

### Type Hints

- ALL functions MUST have type hints on parameters and return types
- Use `from __future__ import annotations` for forward references
- Use `Optional[T]` or `T | None` consistently (prefer `T | None` for Python 3.10+)

### Dependency Injection

- Use FastAPI `Depends()` for all dependency injection
- Define ports as `Protocol` classes in Application layer
- Register adapters in Infrastructure layer
- Wire dependencies in `presentation/dependencies.py`

### Pydantic DTOs

- ALL data transfer objects MUST be Pydantic `BaseModel` subclasses
- Use `model_validator` for complex validation
- Use `Field()` with descriptions for API documentation
- Separate request and response models (never reuse domain entities as DTOs)

### Logging

- Use `structlog` for all logging — NEVER use `print()` or stdlib `logging` directly
- Bind context variables at request level
- Log at appropriate levels: debug for flow, info for business events, warning for recoverable issues, error for failures

### Exception Hierarchy

```
DomainError (base)
├── BusinessError — business rule violations
├── NotFoundError — entity not found
├── ValidationError — domain validation failures
├── ConflictError — concurrent modification / duplicate
└── AuthorizationError — permission denied
```

- Raise domain exceptions in Domain/Application layers
- Map to HTTP status codes in Presentation layer exception handlers

### FastAPI Router Conventions

- Use `APIRouter` with `prefix` and `tags` for every router
- Group endpoints by feature/aggregate
- Use dependency injection for common concerns (auth, pagination)
- Return Pydantic response models, never raw dicts

### Async/Await Patterns

- ALL I/O operations MUST be async (`async def` + `await`)
- Use `asyncio.gather()` for concurrent independent operations
- NEVER use synchronous I/O in async context (blocks event loop)
- Use `run_in_executor()` for unavoidable sync operations

### Alembic Migrations

- Every schema change MUST have an Alembic migration
- NEVER modify models without generating a migration
- Migrations MUST be reversible (implement `downgrade()`)

### Configuration

- Use Pydantic `BaseSettings` for all configuration
- Load from environment variables with `.env` file support
- NEVER hardcode configuration values
- Validate all configuration at startup

## Source of Truth

`.cloud/policies/coding-standards.md`

## Auto-Shielding

If any rule above is violated during code generation or modification, the skill MUST:
1. Fix the violation immediately
2. Log the fix in the current session context
3. NEVER ask the user whether to comply — compliance is mandatory
