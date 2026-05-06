---
name: nest-smoke-tests
description: "Use when verifying that critical paths of the application still work after a deployment or significant change"
---

---
name: smoke-tests
description: "Post-migration smoke tests — verify that the BFF service works"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

Verify that the BFF service starts correctly and key endpoints respond after a migration or major change.

## Execution Flow

1. Run `npm run build` — verify compilation
2. Run `npm run start` (or `npm run start:dev`) — verify startup
3. Check health endpoint responds with 200
4. Check Swagger endpoint serves the API spec
5. For each migrated module: verify key routes return expected HTTP status
6. Run `npm test` — verify all unit tests pass
7. Report results

## Rules

- Run AFTER migration-execute completes
- STOP if build fails — do not continue with smoke tests
- Report all failures with details
