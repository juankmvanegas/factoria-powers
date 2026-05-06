---
name: kot-verify-logic
description: "Verify business logic against specification"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Verify Logic — Logic Verification

## Purpose

Analyze ViewModel and UseCase code to verify they correctly implement the requirements defined in the PRP/DRP or specification.

## Inputs

1. **Specification** (at least one):
   - Feature PRP/DRP
   - Acceptance criteria
   - User story
   - Jira/Azure DevOps ticket

2. **Code to verify**:
   - Specific ViewModel
   - Specific UseCase
   - Or automatically detect from recent changes

## Verifications

### 1. UI States
- [ ] All defined states are represented in UiState
- [ ] Initial state is correct
- [ ] State transitions are valid
- [ ] No orphan states (without transition to them)

```kotlin
// Verify that UiState covers all cases
data class LoginUiState(
    val cargando: Boolean,    // When is it used?
    val error: String?,       // When is it set?
    val exito: Boolean        // When does it change to true?
)
```

### 2. Error Flows
- [ ] All possible errors are handled
- [ ] Result.Error is processed correctly
- [ ] No empty catches
- [ ] Errors are communicated to the user

### 3. Input Validations
- [ ] Inputs are validated before processing
- [ ] Validations are sufficient per spec
- [ ] Error messages are clear

### 4. Side Effects
- [ ] Analytics events fire where appropriate
- [ ] Navigation occurs at the correct time
- [ ] Loading states are handled correctly

### 5. Edge Cases
- [ ] What happens if the list is empty?
- [ ] What happens if there is no connection?
- [ ] What happens if the token has expired?
- [ ] What happens if the user cancels?

## Output

```markdown
# Logic Verification — [ViewModel/UseCase]

## Spec Reference
[Link to PRP/DRP or ticket]

## Acceptance Criteria Verification

| Criterion | Implemented | Evidence |
|-----------|-------------|----------|
| User can log in | ✅ | `login()` on line 45 |
| Error shown with invalid credentials | ✅ | `UiState.error` |
| Loading shown during request | ❌ | **MISSING** |

## Gaps Found

### 🔴 Critical
- [ ] Loading state is not handled (criterion X)

### 🟡 Minor
- [ ] No retry on network error

## Recommendations
1. Add `cargando = true` before calling the UseCase
2. Implement retry with exponential backoff
```

## Rules

1. DO NOT approve if there are critical gaps
2. Document minor gaps but they do not block
3. Always reference specific code lines
4. Verify against spec, not against assumptions
