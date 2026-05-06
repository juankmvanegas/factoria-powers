---
name: nest-dashboard
description: "Use when generating a status overview or metrics report of the current project state"
---

---
name: dashboard
description: "Progress panel for migrations and large projects"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Dashboard

## Purpose

Display a visual progress panel showing the state of a migration or large project implementation.

## Execution Flow

1. Read `.cloud/planning/migration-plan.md` (if exists)
2. Scan `src/` for implemented modules vs planned modules
3. Scan `test/` for test coverage per module
4. Check Swagger spec completeness
5. Generate dashboard with: modules completed, tests passing, coverage %, Swagger coverage, pending items

## Output Format

```
═══ Factoria Dashboard (NestJS BFF) ═══
Module          | Status    | Tests | Coverage | Swagger
────────────────|───────────|───────|──────────|────────
notes           | ✔ Done    | 12/12 | 94%      | ✔
users           | ⏳ WIP    | 5/8   | 72%      | ✔
reports         | ○ Pending | 0/0   | -        | ○
═══════════════════════════════════════
Overall: 1/3 modules | 67% avg coverage
```

## Rules

- Read-only — NEVER modify code
- Always show current state, not cached data
