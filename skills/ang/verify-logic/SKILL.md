---
name: ang-verify-logic
description: "Use when business logic from a legacy system needs to be verified against the migrated implementation"
---

---
name: verify-logic
description: "Deep logic verification against the original legacy Angular code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Verify that the logic of the migrated/generated code is faithful to the original legacy Angular code. Quality gate BEFORE unit tests.

## Execution Context

Runs from the **DESTINATION project**. Reads the **LEGACY project** remotely. **NEVER modifies the legacy.**

## When it activates

- **Automatically**: After `/migration-execute` and BEFORE `/generate-tests`
- **Manually**: When the user invokes `/verify-logic`

## Prerequisites

- `.cloud/planning/migration-constraints.md` with the **Legacy Path** must exist
- New generated code must exist

## Execution Flow

### Phase 1: Correspondence Mapping

```
LEGACY                              NEW
──────                              ───
ComponentX.ts        ──────►        XPage (Presentation/views/)
ServiceX.ts          ──────►        XUseCases + XService (Application/)
ApiServiceX.ts       ──────►        XAdapter + ApiBffXService (Infrastructure + Application)
ModelX.ts            ──────►        X.output.ts / X.input.ts (Application/dtos/)
GuardX.ts            ──────►        XGuard (Infrastructure/services/msal/)
```

### Phase 2: Legacy Logic Extraction

For EACH legacy service/component, extract:

#### 2.1 Business Logic
- `if/else` conditions, `switch`, ternaries
- Data validations
- Data transformations (map, filter, reduce in streams)
- Conditional flows based on state
- Subscriptions and their handling logic

#### 2.2 Side Effects
- API calls (HTTP)
- Event dispatching
- Storage writes (localStorage, sessionStorage)
- Programmatic navigation
- Shared state updates

#### 2.3 Error Handling
- catchError in observables
- Error handlers in subscribe
- Interceptor behavior
- Specific error messages
- Fallback behavior

#### 2.4 Edge Cases
- Null/undefined values
- Empty arrays
- Observable that doesn't emit
- HTTP errors by status code
- Auth state (logged/not logged)

### Phase 3: Verification Against New Code

```
VERIFICATION BY SERVICE: [ServiceName]
════════════════════════════════════════

BUSINESS LOGIC
  ✅ [Description] — Found at line X
  ❌ [Description] — NOT FOUND
  ⚠️ [Description] — Found but DIFFERS

SIDE EFFECTS
  ✅ [HTTP call to /endpoint] — Found
  ❌ [Event X dispatch] — NOT FOUND

ERROR HANDLING
  ✅ [catchError in getAllNotes] — Found
  ❌ [Fallback to cache when API fails] — NOT FOUND

EDGE CASES
  ✅ [Empty array returns []] — Found
  ⚠️ [Null check] — Legacy uses optional chaining, new uses guard clause

SUMMARY:
  Total elements: N
  ✅ Verified: X
  ❌ Missing: Y
  ⚠️ Differ: Z
  Logic coverage: XX%
```

### Phase 4: Consolidated Report

Generate `.cloud/planning/logic-verification/{module}-verification.md`

### Phase 5: Automatic Correction

If coverage < 95%:
1. Present report to the user
2. Ask: **"Do you want me to fix the missing elements?"**
3. If accepted, implement equivalents in new code
4. Re-verify until coverage >= 95%

### Phase 6: Quality Gate

| Metric | Minimum required |
|--------|-----------------|
| Business logic coverage | >= 95% |
| Critical missing logic | 0 |
| Missing side effects | 0 |
| Documented edge cases | 100% reviewed |

## Rules

- NEVER assume logic is complete without verifying against the legacy
- NEVER modify the legacy code
- NEVER skip verification — it is a mandatory gate
- ALWAYS verify ALL public methods
- ALWAYS look for hidden logic in pipes, directives, and helpers in the legacy
