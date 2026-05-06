---
name: net-verify-logic
description: "Use when business logic from a legacy system needs to be verified against the migrated implementation"
---

---
name: verify-logic
description: "Deep business logic verification against the original legacy code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Verify that the business logic of the migrated/generated code is faithful to the original legacy code. This skill acts as a quality gate BEFORE running unit tests, comparing service by service that every condition, validation, calculation, and business flow exists in the new code.

## Execution Context

This skill runs from the **DESTINATION project** (new). It reads the **LEGACY project** (original) remotely for comparison. **NEVER modifies the legacy.**

## When It Activates

- **Automatically**: After `/migration-execute` and BEFORE `/generate-tests` generates tests
- **Manually**: When the user invokes `/verify-logic`
- **Recommended**: After `/add-feature` if the feature replicates existing logic

## Prerequisites

- `.cloud/planning/migration-constraints.md` with **Legacy Path** documented must exist
- New generated code must exist (at least one migrated service)
- If there is no legacy path, ask the user

## Execution Flow

### Phase 1: Correspondence Mapping

Identify which legacy components correspond to which new components. Generate correspondence table and show to user. If there are legacy components without correspondence, report as **CRITICAL GAP**.

### Phase 2: Legacy Logic Extraction

For EACH legacy service/component, extract and document:
- **Business rules**: if/else conditions, switch, ternaries, validations, calculations, conditional flows
- **Side effects**: calls to other services, events, audit logs, notifications, cascading updates
- **Error handling**: exceptions thrown and under what conditions, error messages, error codes, failure behavior
- **Edge cases**: null/empty values, empty lists, boundary values, concurrency, invalid states

### Phase 3: Verification Against New Code

For EACH element extracted in Phase 2, verify its existence in the new code. Generate verification report with ✅ Verified / ❌ Missing / ⚠️ Differs for each element. Calculate logic coverage percentage.

### Phase 4: Consolidated Report

Generate `.cloud/planning/logic-verification/[module]-verification.md` with executive summary, per-service detail, missing elements, differing elements, and recommendations.

### Phase 5: Automatic Correction

If missing elements are found, present report and ask user if they want corrections. If accepted, implement equivalents respecting Factoria standards. Re-verify until coverage >= 95%.

### Phase 6: Quality Gate

**Criteria to proceed to testing:**

| Metric | Minimum required |
|--------|-----------------|
| Business rule coverage | >= 95% |
| Critical missing rules | 0 |
| Missing side effects | 0 |
| Documented edge cases | 100% reviewed |

If criteria are NOT met → **BLOCK** testing. If met → Approve for testing with verification report as evidence.

## Rules

- NEVER assume logic is complete without verifying against legacy
- NEVER modify legacy code — READ ONLY
- NEVER skip verification — it is a mandatory gate before tests
- ALWAYS verify ALL public methods, not just the main ones
- ALWAYS document intentional differences (e.g., migrated to BusinessException instead of ArgumentException because ADR-013 requires it)
- ALWAYS look for hidden logic: private methods, extensions, helpers, utils in the legacy that contain business rules
- ALWAYS verify logic in stored procedures, triggers, or DB functions if the legacy uses them
- If an element differs but is CORRECT (e.g., intentional improvement), document as "Intentional Difference" with justification
- The 95% coverage applies to business rules. The remaining 5% must be documented as "Not Applicable" with justification
