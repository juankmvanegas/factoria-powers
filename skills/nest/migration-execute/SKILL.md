---
name: nest-migration-execute
description: "Use when the migration plan is approved and actual code migration should begin phase by phase"
---

---
name: migration-execute
description: "Migration step 3: Execute one module migration at a time"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Step 3 of the migration workflow. Migrate ONE module following the approved migration plan and 3-layer architecture.

## Execution Flow

1. Read `.cloud/planning/migration-plan.md` — find the target module
2. Read all ADRs — they are contracts
3. Generate rollback plan via `/rollback-plan`
4. Execute migration following layer order:
   - **application** — Abstractions, DTOs with class-validator, Services
   - **infrastructure** — Service clients with HttpService, providers
   - **api** — Controllers with Swagger decorators, versioned routes
5. Register all new components in their respective modules
6. Auto-chain: verify-logic → generate-tests → documentacion → audit-trail
7. Run smoke tests
8. Wait for team approval before next module

## Rules

- ONE module at a time
- Follow ADRs strictly — they are contracts
- Follow blueprint patterns from `ing-nes-bff-clean`
- NEVER skip rollback plan generation
- NEVER skip the auto-chain
- Stop on gaps — if something is not covered in the plan, report immediately
