---
name: dataeng-review-pr
description: "Review code changes against all company policies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Purpose

Review code changes (PR, diff, or modified files) against all project policies and standards. Generate a report with violations categorized by severity.

## Execution Flow

### Step 1: Obtain the Changes

Determine what to review based on context:

- If a PR number is provided: `gh pr diff {number}`
- If a branch is provided: `git diff main...{branch}`
- If there are uncommitted changes: `git diff` and `git diff --staged`
- If specific files are provided: read those files

### Step 2: Architecture Review (4 Layers)

Verify for each changed file:

| Rule | Severity |
|------|----------|
| Core does not reference other layers | CRITICAL |
| Application only references Core | CRITICAL |
| Infrastructure references Core and Application (not Api) | HIGH |
| Api can reference all | OK |
| Entities are not exposed directly in API | HIGH |
| Business logic is not in Infrastructure | HIGH |
| Business logic is not in Controllers | HIGH |
| DTOs are in Application, not in Core | MEDIUM |

### Step 3: Code Standards Review

| Rule | Severity |
|------|----------|
| PascalCase naming for public members | MEDIUM |
| _camelCase naming for private fields | LOW |
| Async/await used correctly | MEDIUM |
| Interfaces have prefix I | MEDIUM |
| Methods do not exceed ~50 lines | LOW |
| Classes do not exceed ~300 lines | LOW |
| Nullable reference types enabled | MEDIUM |

### Step 4: Security Review

| Rule | Severity |
|------|----------|
| No hardcoded secrets/passwords | CRITICAL |
| No connection strings in code | CRITICAL |
| Input validated on public endpoints | HIGH |
| Parameterized SQL (no concatenation) | CRITICAL |
| No PII data logging | HIGH |
| Authentication/authorization on endpoints | HIGH |
| No CORS wildcard (*) in production | HIGH |

### Step 5: Testing Review

| Rule | Severity |
|------|----------|
| New services have tests | HIGH |
| New public methods have tests | MEDIUM |
| Tests follow AAA pattern | LOW |
| Tests use correct naming | LOW |
| One behavior per test | LOW |
| No tests depend on external state | MEDIUM |

### Step 6: DI Review

| Rule | Severity |
|------|----------|
| New services registered in DI | HIGH |
| New repositories registered in DI | HIGH |
| Correct scope (Scoped/Singleton/Transient) | MEDIUM |

### Step 7: Error Handling Review

| Rule | Severity |
|------|----------|
| Typed exceptions (not generic Exception) | MEDIUM |
| Try-catch does not silently swallow exceptions | HIGH |
| Validation errors return 400, not 500 | MEDIUM |
| Not found returns 404 | LOW |

### Step 8: Report Generation

Generate report with the following format:

```markdown
# Review: {description or PR#}

**Date**: {date}
**Files reviewed**: {N}
**Violations found**: {total}

## Summary by Severity
- 🔴 CRITICAL: {N}
- 🟠 HIGH: {N}
- 🟡 MEDIUM: {N}
- 🔵 LOW: {N}

## Violations

### 🔴 CRITICAL
1. **{file}:{line}** — {description}
   ```
   {problematic code}
   ```
   **Suggested fix**: {suggestion}

### 🟠 HIGH
...

### 🟡 MEDIUM
...

### 🔵 LOW
...

## Verdict
- ✅ APPROVED (0 critical, 0 high)
- ⚠️ APPROVED WITH OBSERVATIONS (0 critical, has high/medium)
- ❌ CHANGES REQUIRED (has critical)
```

## Rules

- NEVER approve if there are CRITICAL violations
- NEVER modify code during the review — only report
- ALWAYS review ALL categories, do not skip any
- ALWAYS include the suggested fix for each violation
- ALWAYS indicate file and line for each violation
- If a file is too large to review completely, focus on the changed lines
- False positives are reported as such with justification

## Source of Truth

This skill validates against corporate policies:
- **`.cloud/policies/coding-standards.md`** — Steps 2 and 3 (architecture, naming, style)
- **`.cloud/policies/security-policy.md`** — Step 4 (secrets, auth, injection, CORS)
- **`.cloud/policies/testing-policy.md`** — Step 5 (coverage, patterns, quality gates)

In case of any doubt or conflict between this skill and the policies, **policies win**.
