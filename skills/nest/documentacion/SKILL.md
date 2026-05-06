---
name: nest-documentacion
description: "Use when documentation (CHANGELOG, README, API docs, comments) needs to be generated or updated after code changes"
---

---
name: documentacion
description: "Auto-generate and update documentation after code changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Skill: Documentación

## Activates When

After code changes are completed and tests pass.

## Responsibilities

1. Update `CHANGELOG.md` with changes (Added, Changed, Fixed, Removed)
2. Update `src/api/contrato-de-api.yml` if endpoints changed
3. Update `.cloud/architecture/current.md` if architecture changed
4. Update `.cloud/planning/drp-current.md` if working from a DRP

## Rules

- Auto-activated — runs at the end of every code-producing chain
- NEVER runs if tests are failing
- Follow Keep a Changelog format
- Keep OpenAPI spec in sync with controllers
