---
name: swf-verify-logic
description: "Verify business logic correctness — trace data flow from API to UI, validate transformations, check edge cases"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Verify Logic

## Purpose

Verify business logic correctness by tracing the full data flow from API response to UI rendering. Validates data transformations, mapping correctness, edge case handling, and state management consistency.

## Execution Flow — 6 Strict Steps

### Step 1: Identify Data Flow

For the specified feature or module:

1. Start at the API response model (`ModelosApi/`)
2. Trace through domain model mapping
3. Follow through ViewModel processing
4. End at SwiftUI View rendering
5. Document each transformation step

```
API Response → Mapper → Domain Model → ViewModel → @Published → View
```

### Step 2: Validate API → Domain Mapping

1. Check all fields from API response are mapped (or explicitly ignored)
2. Verify `CodingKeys` match actual JSON keys
3. Verify optional vs non-optional handling:
   - API returns null → property is Optional in domain model
   - API returns default → property has default value
4. Check date parsing formats match API contract
5. Verify number precision (Decimal vs Double for currency)
6. Check string encoding/decoding for special characters

### Step 3: Validate ViewModel Logic

1. For each ViewModel method, trace:
   - Input parameters and validation
   - Combine publisher chain transformations
   - State updates (`@Published` property changes)
   - Error mapping and handling
2. Verify loading state management:
   - `isLoading = true` before async call
   - `isLoading = false` in both success and failure
3. Check error state is cleared on retry
4. Verify no data races on `@Published` properties

### Step 4: Validate Edge Cases

| Edge Case | Check |
|-----------|-------|
| Empty response | View shows empty state, not crash |
| Null fields | Optional handling, no force unwraps |
| Large data sets | Pagination or lazy loading |
| Network timeout | Timeout error message, retry option |
| Invalid data | Graceful degradation, error state |
| Concurrent calls | No duplicate requests, proper cancellation |
| Rapid user input | Debounce or throttle applied |
| Background/foreground | State preserved across app lifecycle |

### Step 5: Validate View Rendering

1. Check that View correctly observes all relevant `@Published` properties
2. Verify conditional rendering handles all states:
   - Loading state → ProgressView
   - Success state → Content view
   - Error state → Error view with retry
   - Empty state → Empty state view
3. Check formatting (dates, numbers, currency) matches requirements
4. Verify accessibility labels on dynamic content

### Step 6: Generate Verification Report

```markdown
# Logic Verification Report — [Feature Name]

## Data Flow
API → [Model] → [Mapper] → [Domain] → [ViewModel] → [View]

## Transformation Checks
| Step | Status | Issues |
|------|--------|--------|
| API → Domain | ✅/❌ | [details] |
| Domain → ViewModel | ✅/❌ | [details] |
| ViewModel → View | ✅/❌ | [details] |

## Edge Case Coverage
| Edge Case | Handled | How |
|-----------|---------|-----|
| Empty response | ✅/❌ | [details] |
| ... | ... | ... |

## Issues Found
- [Severity] [file:line] [description]

## Recommendations
- [Ordered list]
```

## Auto-Shielding

- **ABORT** if the feature has no ViewModel — no logic to verify
- **WARN** if API contract documentation is unavailable — may miss mapping issues
- **WARN** if no tests exist for the feature — suggest generating tests first

## Rules

1. Trace the COMPLETE data flow — do not skip any transformation step
2. Every Optional field must have explicit handling (no silent nil)
3. Currency values must use Decimal, never Double
4. Date formatting must be verified against locale
5. Report with specific file:line references
6. Read-only operation — flag issues but do not fix them
7. If issues are found, suggest invoking `generate-tests` to cover them
