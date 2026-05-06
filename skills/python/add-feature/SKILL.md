---
name: python-add-feature
description: "Use when the user wants to add a new feature, endpoint, component, or module to the current project"
---

---
name: add-feature
description: "Add a new feature following the immutable layer execution order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Implement a new feature in a Python/FastAPI project following the strict Clean Architecture layer order. Each layer is completed and validated before moving to the next.

## When to Use

- Adding a new endpoint or business capability
- Implementing a new use case that spans multiple layers
- Any feature that requires domain entities, application logic, and API exposure

## Execution Flow — 6 Strict Steps

### Step 1: Domain Layer

- Create or update **entities** in `domain/entities/` — pure Python classes, dataclasses, or Pydantic base models with no framework dependencies
- Define **port interfaces** in `domain/ports/` — abstract base classes (ABC) for repositories, external services
- Add **domain exceptions** in `domain/exceptions.py` if needed
- Validate: no imports from application, infrastructure, or api layers

### Step 2: Application Layer

- Create **use case** in `application/use_cases/` — single class with `async execute()` method
- Define **DTOs** in `application/dtos/` — Pydantic models for input/output
- Use case receives ports via constructor injection, never instantiates infrastructure
- Validate: only imports from domain layer

### Step 3: Infrastructure Layer

- Implement **adapters** in `infrastructure/adapters/` — concrete implementations of domain ports
- Add **persistence** in `infrastructure/persistence/` — SQLAlchemy models, repository implementations
- Configure **dependency wiring** in `infrastructure/config/` — FastAPI dependency injection setup
- Validate: implements domain port interfaces

### Step 4: API Layer

- Create **router** in `api/routers/` — FastAPI router with endpoint definitions
- Define **schemas** in `api/schemas/` — request/response Pydantic models (API-specific)
- Wire **dependencies** in `api/dependencies.py` — FastAPI `Depends()` for use case injection
- Register router in `main.py`
- Validate: uses application DTOs, never accesses infrastructure directly

### Step 5: Tests

- **Unit tests** — test use case with mocked ports using `AsyncMock`
- **Integration tests** — test endpoint with `httpx.AsyncClient` and test database
- **Architecture tests** — verify import-linter contracts still pass
- Run full test suite: `pytest --tb=short`

### Step 6: Documentation

- Update API documentation if needed (FastAPI auto-generates OpenAPI)
- Update CHANGELOG.md with feature entry
- Update architecture docs in `.cloud/` if structural changes were made

## Auto-Shielding

- NEVER skip a layer step or reorder the execution
- NEVER import from a higher layer into a lower layer
- ALWAYS run `import-linter` after implementation to verify contracts
- ALWAYS run `ruff check` and `mypy` before considering the feature complete

## Rules

- Domain entities MUST NOT import FastAPI, SQLAlchemy, or any framework
- Use cases MUST receive dependencies via constructor (dependency injection)
- API schemas and domain entities MUST be separate classes (no shared models)
- Every use case MUST have at least one unit test
- Every endpoint MUST have at least one integration test
- Architecture tests are IMMUTABLE — fix the code, never the test
