---
name: nest-verify-logic
description: "Use when business logic from a legacy system needs to be verified against the migrated implementation"
---

---
name: verify-logic
description: "Verify application logic against legacy BFF or original specification"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Compare migrated application logic against the legacy BFF to ensure functional equivalence.

## Execution Flow

1. Read legacy discovery files from `.cloud/planning/legacy-discovery/`
2. Read the migrated service code
3. Compare endpoint by endpoint:
   - Same HTTP method and route
   - Same request/response shapes
   - Same orchestration logic (backend service calls)
   - Same error handling behavior
   - Same data transformations
4. Report: matches, differences, gaps
5. Flag any new business logic introduced (BFF violation)

## Rules

- Read-only — NEVER modify code
- Compare behavior, not implementation details
- Flag business logic as CRITICAL (BFF should have none)
- Report completion with match percentage
