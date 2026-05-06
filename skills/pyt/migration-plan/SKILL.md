---
name: pyt-migration-plan
description: "Use when legacy discovery is complete and the migration execution plan needs to be drafted"
---

---
name: migration-plan
description: "Generate module-by-module migration plan from legacy to Clean Architecture"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Generate a detailed module-by-module migration plan that maps legacy components to Clean Architecture target components. Each module has an approval gate before execution begins.

## When to Use

- After `migration-discovery` has produced the complete legacy inventory
- When planning the actual migration work before writing any code
- To establish execution order and dependencies between migration modules

## Execution Flow â€” 6 Strict Steps

1. **Load discovery artifacts** â€” Read all files from `.cloud/planning/legacy-discovery/`. Load `migration-constraints.md`. Verify completeness.

2. **Identify migration modules** â€” Group related components into migration units:
   - Each module should be independently deployable/testable
   - Group by business domain, not by technical layer
   - Example: "User Management" module = User model + auth views + user serializer + user routes

3. **Map each module** â€” For each module, create the mapping:
   - **Source components**: Django/Flask models, views, forms, signals, routes
   - **Target domain layer**: Entities, value objects, port interfaces, domain exceptions
   - **Target application layer**: Use cases, DTOs, application services
   - **Target infrastructure layer**: SQLAlchemy models, repository implementations, adapters
   - **Target API layer**: FastAPI routers, Pydantic schemas, dependency injection
   - **Test requirements**: Unit tests, integration tests, equivalence tests

4. **Determine execution order** â€” Order modules by:
   - Dependency graph (modules that others depend on go first)
   - Risk level (lower risk first to build confidence)
   - Business criticality (critical paths get early attention)

5. **Generate migration plan document** â€” Write to `.cloud/planning/migration-plan.md`:
   - Module list with execution order
   - Per-module: source â†’ target mapping, estimated complexity, dependencies
   - Approval gates between modules
   - Rollback strategy per module
   - Total estimated phases

6. **Present for approval** â€” Show the plan to the user. Each module must receive explicit approval before `migration-execute` begins. Mark approved modules in the plan.

## Auto-Shielding

- NEVER skip the module approval gate
- NEVER plan a module that depends on an unapproved module
- ALWAYS include rollback strategy for each module
- ALWAYS verify that all discovery items are covered by at least one module

## Rules

- Every legacy component MUST appear in exactly one migration module
- Modules MUST be ordered by dependency (no forward references)
- Each module MUST have a clear "done" definition with test criteria
- Signal handlers and middleware get their own explicit mapping entries
- The plan is a living document â€” update it as execution reveals new information
- Maximum module size: 10 source components (split larger modules)
