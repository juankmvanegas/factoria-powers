---
name: python-migration-execute
description: "Use when the migration plan is approved and actual code migration should begin phase by phase"
---

---
name: migration-execute
description: "Execute ONE approved module migration from legacy to Clean Architecture"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Execute the migration of a single approved module from the migration plan. Follows the plan's source-to-target mapping, creates Clean Architecture components, verifies business logic equivalence, and validates with tests.

## When to Use

- After `migration-plan` has been approved for the target module
- To migrate one module at a time with full validation
- Each invocation handles exactly ONE module

## Execution Flow — 8 Strict Steps

1. **Load module plan** — Read `.cloud/planning/migration-plan.md`. Identify the next approved, unexecuted module. Load its source → target mapping.

2. **Read legacy source** — Load all source components for this module. Understand the business logic, data flow, and edge cases.

3. **Create domain layer** — Following the mapping:
   - Create entities in `domain/entities/`
   - Define port interfaces in `domain/ports/`
   - Add domain exceptions if needed
   - Verify: zero framework imports

4. **Create application layer** — Following the mapping:
   - Create use cases in `application/use_cases/`
   - Define DTOs in `application/dtos/`
   - Wire use case dependencies via constructor injection
   - Verify: only imports from domain

5. **Create infrastructure layer** — Following the mapping:
   - Implement adapters in `infrastructure/adapters/`
   - Create SQLAlchemy models in `infrastructure/persistence/`
   - Implement repository classes
   - Configure dependency injection
   - Verify: implements domain port interfaces

6. **Create API layer** — Following the mapping:
   - Create router in `api/routers/`
   - Define request/response schemas in `api/schemas/`
   - Wire dependencies
   - Register router in main.py
   - Verify: uses application DTOs, not infrastructure directly

7. **Test and validate** — Comprehensive testing:
   - Unit tests for each use case with `AsyncMock` ports
   - Integration tests for each endpoint with `httpx.AsyncClient`
   - Business logic equivalence tests (compare output with legacy for same inputs)
   - Architecture tests (import-linter contracts)
   - Run: `pytest --tb=short`, `ruff check`, `mypy`

8. **Update progress** — Mark module as "done" in migration plan. Update `.cloud/planning/progress-migration.md`. Document any deviations or decisions made.

## Auto-Shielding

- NEVER migrate more than one module per invocation
- NEVER skip the business logic equivalence verification
- NEVER proceed if tests fail — fix first
- ALWAYS verify that migrated endpoints produce identical responses to legacy
- If a deviation from the plan is needed, DOCUMENT it before proceeding

## Rules

- One module per execution — no exceptions
- Layer order is IMMUTABLE: domain → application → infrastructure → api → tests
- Every legacy signal handler MUST have an equivalent mechanism (events, hooks, or explicit calls)
- Every legacy middleware MUST be accounted for (FastAPI middleware or dependencies)
- If the module has external integrations, create adapter interfaces in the domain and concrete implementations in infrastructure
- Test coverage for the migrated module MUST be >= 80%
