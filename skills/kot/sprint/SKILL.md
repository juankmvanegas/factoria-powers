---
name: kot-sprint
description: "Quick tasks without planning overhead — bug fixes, minor adjustments"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute quick, low-risk tasks without the need to create a full PRP. Ideal for bug fixes, minor adjustments, small refactors, and configuration changes.

## When to Use Sprint

- Simple bug fixes
- Minor UI adjustments
- Small refactors
- Dependency updates
- Lint/warning fixes
- Documentation

## When NOT to Use Sprint

- New features → use `/add-feature`
- Changes affecting multiple modules → use `/prp`
- Architecture changes → use `/generate-adr` first
- New integrations → use `/prp`

## Execution Flow

### Step 1: Understand the Task

1. Read the user's description
2. Identify affected files and layers
3. Implement the change following all policies

### Step 2: Execute Automatic Chain

```
security-scan → verify-logic → generate-tests → run-tests → documentation
```

### Step 3: Report

Report what was changed and tested.

## Automatic Chain

```
Implement change
    ↓
security-scan
    ├── FAIL → Fix and retry
    └── PASS ↓
verify-logic (if applicable)
    ├── FAIL → Fix and retry
    └── PASS ↓
generate-tests (if new code)
    ↓
run-tests
    ├── FAIL → Fix and retry
    └── PASS ↓
documentation (CHANGELOG if applicable)
    ↓
DONE ✅
```

## Output

```markdown
# Sprint Completed ✅

## Task
[Task description]

## Changes Made
- [file1.kt]: [what changed]
- [file2.kt]: [what changed]

## Validations
- [x] Security scan: PASS
- [x] Logic verification: PASS (or N/A)
- [x] Tests: 5 new, all pass
- [x] CHANGELOG updated (or N/A)

## Total Time
X minutes
```

## Auto-Shielding

If any test fails or the build breaks:
1. Read the full error
2. Identify the affected layer
3. Fix in the corresponding layer
4. Verify build
5. Re-run tests
6. Document the error and solution
7. Maximum 3 attempts. If not resolved, STOP and report to the user.

## Rules

- Maximum 1 hour of work
- If it extends beyond that → convert to PRP
- ALWAYS execute the complete chain
- ALWAYS update CHANGELOG if there is a user-visible change
- ALWAYS follow the project's code standards (naming, patterns, etc.)
- ALWAYS follow security policies (no secrets, validate input, etc.)
- ALWAYS generate or update tests if production code is modified
- ALWAYS verify that it builds and tests pass before reporting completion
- Do NOT create ADRs — if the change requires an ADR, it is too large for Sprint
