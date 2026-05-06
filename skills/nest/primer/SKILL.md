---
name: nest-primer
description: "Use at the start of a session to load the full factory context when the automatic bootstrap did not run or needs to be refreshed"
---

---
name: primer
description: "Load and understand the current project context"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Primer

## Purpose

Load the full context of the current NestJS BFF project to understand its state before working on it.

## Execution Flow

1. Read `package.json` — dependencies, scripts, project name
2. Scan `src/` structure — modules, controllers, services
3. Read `src/api/contrato-de-api.yml` — current API spec
4. Scan `src/infrastructure/services/` — external integrations
5. Scan `src/application/services/` — use cases
6. Scan `test/` — test coverage and structure
7. Read `.cloud/` — planning docs, ADRs, audit trail
8. Read `CHANGELOG.md` if exists
9. Present summary to user

## Output

```
═══ Project Context ═══
Name: [project-name]
NestJS: [version]
Modules: [count]
Services: [list]
Integrations: [list of backend services]
Tests: [count] files, [coverage]%
Last Change: [date]
═══════════════════════
```

## Rules

- Read-only — NEVER modify anything
- Load EVERYTHING before reporting
