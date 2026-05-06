---
name: next-verify-logic
description: "Use when business logic from a legacy system needs to be verified against the migrated implementation"
---

---
name: verify-logic
description: "Verify business logic against original legacy code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Deep verification of business logic in the migrated Next.js code against the original legacy implementation. Compares service behavior, data transformations, conditional logic, edge cases, and error handling to ensure functional equivalence.

## Execution Flow — 5 Steps

### Step 1: Load Legacy Reference

Read the legacy code from the path provided during migration discovery:
- Legacy services/controllers with business logic
- Data transformation functions
- Validation rules and edge case handling
- Error codes and messages

Source: `.cloud/planning/legacy-discovery/` contracts and original files.

### Step 2: Load Migrated Code

Read the corresponding Next.js implementation:
- `src/application/use-cases/*.ts` — use case implementations
- `src/domain/entities/*.ts` — domain entities and rules
- `src/infrastructure/adapters/*.ts` — external service adapters
- `app/api/*/route.ts` — API route handlers

### Step 3: Compare Logic Point by Point

For each business function, verify:

| Aspect | Legacy | Migrated | Match? |
|--------|--------|----------|--------|
| Input validation rules | `if (x < 0) throw` | `z.number().min(0)` | ✅ Equivalent |
| Calculation formula | `total = qty * price * (1 - discount)` | `total = qty * price * (1 - discount)` | ✅ Exact |
| Conditional branches | 5 branches | 4 branches | ❌ Missing branch |
| Error codes returned | `ERR_001, ERR_002, ERR_003` | `ERR_001, ERR_002` | ❌ Missing ERR_003 |
| Null/undefined handling | `if (x == null)` | `x ?? defaultValue` | ⚠️ Different approach, same result |
| Date formatting | `MM/dd/yyyy` | `yyyy-MM-dd` | ❌ Format changed |

### Step 4: Classify Findings

| Category | Description | Action |
|----------|-------------|--------|
| **MATCH** | Logic is functionally equivalent | No action |
| **EQUIVALENT** | Different implementation, same result | Document the difference |
| **GAP** | Missing logic branch or edge case | BLOCKER — must implement |
| **DIVERGENCE** | Different behavior intentionally | Requires ADR justification |
| **IMPROVEMENT** | Migrated code handles cases legacy missed | Document as enhancement |

### Step 5: Report

```
Logic Verification — {Module Name}
════════════════════════════════════

Functions verified: 12
  ✅ MATCH: 8
  ✅ EQUIVALENT: 2
  ❌ GAP: 1 — calculateDiscount() missing tier-3 branch
  ⚠️ DIVERGENCE: 1 — date format changed (requires ADR)

Gaps requiring resolution:
  1. calculateDiscount(): legacy has 3 discount tiers, migrated has 2
     Legacy: src/services/discount.service.ts:45
     Migrated: src/application/use-cases/calculate-discount.ts:32
     Fix: Add tier-3 logic (discount > 25% for orders > $10,000)

Overall: FAIL — 1 gap must be resolved before approval
```

## Rules

- NEVER approve a migration step with unresolved GAPS
- ALWAYS compare line-by-line for critical business calculations
- NEVER assume equivalent behavior without verifying edge cases
- ALWAYS document DIVERGENCES with an ADR explaining why the change was made
- ALWAYS check error handling paths, not just happy paths
- If legacy code has bugs that were preserved in production, document as IMPROVEMENT (not GAP) and ask user whether to fix or preserve the bug
