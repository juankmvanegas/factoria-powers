---
name: ang-primer
description: "Use at the start of a session to load the full factory context when the automatic bootstrap did not run or needs to be refreshed"
---

---
name: primer
description: "Load complete Angular project context at session start"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Purpose

Load all Angular project context to operate with complete knowledge.

## Execution Flow

1. Read `BUSINESS_LOGIC.md`
2. Read `angular.json` (structure, configs)
3. Read `package.json` (dependencies)
4. Read `tsconfig.json` (TS configuration)
5. Scan `src/application/abstractions/` (use cases and adapters)
6. Scan `src/application/services/` (implementations)
7. Scan `src/presentation/views/` (existing views)
8. Scan `src/infrastructure/services/` (concrete adapters)
9. Read `CHANGELOG.md`
10. Read `.cloud/architecture/current.md` if it exists
11. Check migration status if `.cloud/planning/` exists

Present executive summary to the user.
