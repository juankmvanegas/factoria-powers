---
name: nest-update-architecture
description: "Use when the architecture documentation must reflect recent changes — after an ADR is accepted, new service types added, or new infrastructure providers introduced"
---

---
name: update-architecture
description: "Update architecture documentation after code changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Update Architecture

## Purpose

Update architecture documentation to reflect the current state of the NestJS BFF project.

## Execution Flow

1. Read current `.cloud/architecture/current.md`
2. Scan `src/` for actual module structure, services, integrations
3. Compare documented state vs actual state
4. Update architecture document with: layer details, module list, integration map, cross-cutting concerns
5. Verify consistency between documentation and code

## Rules

- NEVER modify code — only documentation
- Keep architecture diagram in sync with textual descriptions
- Document all external backend service integrations
