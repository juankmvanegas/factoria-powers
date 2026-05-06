---
name: nest-migration-plan
description: "Use when legacy discovery is complete and the migration execution plan needs to be drafted"
---

---
name: migration-plan
description: "Migration step 2: Generate migration plan module by module"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Step 2 of the migration workflow. Generate a detailed migration plan breaking the legacy BFF into modules to be migrated one at a time.

## Execution Flow

1. Read `.cloud/planning/legacy-discovery/` files
2. Read all ADRs including migration-specific ones
3. Group endpoints and integrations into logical modules
4. Define migration order based on dependencies
5. For each module, plan:
   - application: interfaces, DTOs, services
   - infrastructure: external service clients
   - api: controllers
   - Tests: Jest test files
6. Generate `.cloud/planning/migration-plan.md`
7. Wait for explicit team approval

## Rules

- NEVER proceed to execution without team approval
- One module at a time — no batch migrations
- Document dependencies between modules
- Include rollback strategy per module
