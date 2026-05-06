---
name: nest-validate-contracts
description: "Use when checking that API contracts between frontend and backend (or between microservices) are still honored"
---

---
name: validate-contracts
description: "Validate API contract compatibility between Swagger spec and code"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Validate Contracts

## Purpose

Validate that the OpenAPI spec (`contrato-de-api.yml`) matches the actual controllers and DTOs in the codebase.

## Execution Flow

1. Read `src/api/contrato-de-api.yml`
2. Scan all controllers in `src/api/controllers/`
3. For each endpoint in the spec: verify controller method exists with matching route, method, and parameters
4. For each DTO referenced: verify it exists in `src/application/dtos/` with matching fields
5. Check for undocumented endpoints (in code but not in spec)
6. Check for orphaned spec entries (in spec but not in code)
7. Report discrepancies with structured validation format

## Validation Output Format (Retry-Friendly)

For each discrepancy, use this structured format:

```markdown
### DRIFT: [drift-id]
- **direction**: spec→code | code→spec
- **severity**: BLOCKER
- **endpoint**: [HTTP method] [path] (e.g., GET /api/v1/notes)
- **field**: [specific field or parameter that differs]
- **expected** (from spec): [what the spec defines]
- **actual** (in code): [what the code implements, or "MISSING"]
- **fix**: [specific action — e.g., "Add @Get('notes') method to NotesController"]
```

This format enables automated retry: the agent receiving these results knows exactly
which endpoint drifted, in which direction, and what specific fix is needed.

## Rules

- Read-only — NEVER auto-fix
- Flag discrepancies as BLOCKER
- Report both directions: spec→code and code→spec
- ALWAYS include expected vs actual for each drift — never generic messages
