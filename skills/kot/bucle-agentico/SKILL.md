---
name: kot-bucle-agentico
description: "Development cycle with auto-correction"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Agentic Loop — Development Cycle with Auto-Correction

## Purpose

Execute the full development cycle: implement → validate → fix → repeat until everything passes. Maximum 3 iterations to avoid infinite loops.

## Flow

```
Implement change
    ↓
security-scan
    ├── FAIL → Fix → Restart from security-scan
    └── PASS ↓
verify-logic
    ├── FAIL → Fix → Restart from verify-logic
    └── PASS ↓
generate-tests
    ↓
run-tests
    ├── FAIL → Fix → Restart from run-tests
    └── PASS ↓
documentation
    ↓
COMPLETED
```

## Rules

1. Maximum 3 iterations of the full loop
2. If after 3 iterations it still fails → STOP and report to the user
3. Document each correction in the "Learnings" section of the active PRP
4. If there is no active PRP, document in `.cloud/audit/corrections.md`

## Auto-Correction

For each failure type, apply the corresponding strategy:

| Failure | Correction Strategy |
|---------|---------------------|
| Security - secrets | Move to BuildConfig or env vars |
| Security - ProGuard | Add necessary keep rules |
| Logic - missing state | Add case to sealed class UiState |
| Logic - unhandled error | Add handling in Result.Error |
| Test failure | Debug assertion, fix code or test |
| Lint error | Apply automatic or manual fix |

## Output

Upon completion, report:
- Number of iterations needed
- Corrections applied
- Documented learnings
- Final status: PASS or FAIL (with reason)
