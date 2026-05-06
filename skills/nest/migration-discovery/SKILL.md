---
name: nest-migration-discovery
description: "Use when the migration constraints are approved and legacy code analysis needs to begin"
---

---
name: migration-discovery
description: "Migration step 1: Extract contracts from legacy BFF"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Step 1 of the migration workflow. Read-only analysis of the legacy BFF to extract all contracts, integrations, and technical debt.

## Execution Flow

1. Read the legacy BFF project at the provided path
2. Extract and document in `.cloud/planning/legacy-discovery/`:
   - `api-contracts.md` — All endpoints, methods, request/response shapes
   - `backend-integrations.md` — External microservice calls, HTTP/gRPC clients
   - `orchestration-logic.md` — Data aggregation, transformation patterns
   - `middleware-config.md` — Guards, interceptors, pipes, filters, CORS
   - `red-flags.md` — Business logic in BFF, hardcoded values, security issues
3. Provide confidence score (1-10) per module
4. Wait for team review

## Rules

- Read only — NEVER modify legacy code
- Be exhaustive — capture every contract
- Flag any business logic as a CRITICAL red flag (BFF should have none)
