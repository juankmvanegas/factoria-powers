---
name: pyt-verify-logic
description: "Use when business logic from a legacy system needs to be verified against the migrated implementation"
---

---
name: verify-logic
description: "Deep business logic verification against legacy source code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Perform deep verification that migrated business logic produces identical results to the legacy implementation. Compares test results, data transformations, edge cases, and error handling between old and new code.

## When to Use

- After migrating a module from Django/Flask to FastAPI
- When business logic equivalence must be proven
- As a validation gate before decommissioning legacy code
- When stakeholders need confidence that migration preserved behavior

## Execution Flow â€” 6 Strict Steps

1. **Identify logic to verify** â€” Select the migrated module or use case. Load both:
   - Legacy source code (original Django/Flask implementation)
   - New implementation (Clean Architecture use case)

2. **Extract test scenarios from legacy** â€” Analyze legacy code for:
   - Happy path flows (normal input â†’ expected output)
   - Validation rules (what inputs are rejected and how)
   - Edge cases (empty inputs, boundary values, null handling)
   - Error handling (what exceptions are raised and when)
   - Side effects (database writes, event emissions, notifications)

3. **Create equivalence tests** â€” For each scenario:
   - Define input data that exercises the scenario
   - Document expected output from legacy behavior
   - Write pytest test that runs the new implementation with same input
   - Assert output matches legacy expected output
   - Save to `tests/equivalence/test_{module}_equivalence.py`

4. **Test data transformations** â€” Verify:
   - Input parsing produces same internal representation
   - Business calculations yield identical results
   - Output formatting matches (field names, types, structure)
   - Date/time handling is consistent
   - Numeric precision matches (float rounding, decimal handling)

5. **Test edge cases** â€” Specifically verify:
   - Empty collections ([], {}, None)
   - Boundary values (0, -1, MAX_INT, empty string)
   - Unicode and special characters
   - Concurrent access patterns (if applicable)
   - Missing optional fields
   - Legacy quirks that may have been intentional

6. **Generate verification report** â€” Output to `.cloud/planning/logic-verification-{module}.md`:
   - Scenarios tested (count and list)
   - Pass/fail per scenario
   - Behavioral differences found (if any)
   - Differences classified: bug-in-legacy (OK to diverge) vs regression (must fix)
   - Confidence level: High (all pass) / Medium (minor differences) / Low (significant gaps)

## Auto-Shielding

- NEVER assume business logic is correct without testing
- NEVER dismiss differences as "improvements" without user approval
- ALWAYS test edge cases, not just happy paths
- ALWAYS document every behavioral difference, even if intentional

## Rules

- Every migrated use case MUST pass logic verification before the module is marked complete
- Behavioral differences MUST be classified as intentional or regression
- If a legacy "bug" was relied upon by users, it may need to be preserved
- Equivalence tests are kept permanently as regression protection
- If legacy code has no tests, create scenarios from code analysis and document assumptions
- Numeric precision differences MUST be explicitly verified (especially financial calculations)
