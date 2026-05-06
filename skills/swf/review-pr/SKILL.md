---
name: swf-review-pr
description: "Review pull request against all policies — security, coding standards, testing, ADRs, architecture boundaries"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Purpose

Review a pull request against all project policies. Checks security policy compliance, coding standards, testing policy, ADR compliance, and architecture boundary enforcement. Produces a structured review with approve/reject verdict.

## Execution Flow — 7 Strict Steps

### Step 1: Load Context

1. Read all policies from `.cloud/policies/` (security, testing, coding-standards)
2. Read all accepted ADRs from `.cloud/architecture/decisions/`
3. Read `CLAUDE.md` for Golden Rules and conventions
4. Load the PR diff (changed files list)

### Step 2: Security Policy Review

Check every changed file against `security-policy.md`:

| Check | Violation |
|-------|-----------|
| Hardcoded secrets | API keys, tokens, passwords in source |
| Force unwrapping sensitive data | `credential!`, `token!` |
| Insecure storage | Sensitive data in UserDefaults instead of Keychain |
| Missing SSL pinning | Network calls without certificate validation |
| PII in logs | `print()` or `os_log` with user data |
| Insecure URL schemes | `http://` instead of `https://` |
| Missing biometric check | Accessing credentials without ValidadorBiometrico |

### Step 3: Coding Standards Review

Check against `coding-standards.md`:

| Check | Violation |
|-------|-----------|
| ViewModel architecture | Missing `@MainActor`, missing `ObservableObject` |
| Combine usage | Orphaned subscriptions, missing `[weak self]` |
| Factory DI | Manual init instead of `@Injected` |
| Coordinator navigation | Direct `NavigationLink` instead of Coordinator |
| SwiftUI patterns | Wrong property wrapper (`@ObservedObject` vs `@StateObject`) |
| Naming conventions | Non-standard naming for protocols, variables |
| File organization | Files in wrong module or folder |

### Step 4: Testing Policy Review

Check against `testing-policy.md`:

| Check | Violation |
|-------|-----------|
| Test coverage | New ViewModel without tests |
| AAA pattern | Tests not following Arrange-Act-Assert |
| Mock completeness | Missing mocks for new protocols |
| Factory reset | Missing `Container.shared.manager.reset()` in tearDown |
| @MainActor tests | ViewModel tests without `@MainActor` |
| Naming convention | Test methods not following `test_method_scenario_result` |

### Step 5: ADR Compliance Review

For each changed file, verify compliance with relevant ADRs:

1. MVVM architecture (ADR for clean architecture)
2. SPM module boundaries (ADR for modular architecture)
3. Factory DI usage (ADR for dependency injection)
4. Combine for async (ADR for reactive patterns)
5. Coordinator for navigation (ADR for navigation pattern)

### Step 6: Architecture Boundary Review

1. Check no Presentacion module imports Datos directly
2. Verify no feature module imports another feature module
3. Check CoreUI does not depend on feature modules
4. Verify Dependencias module has correct registrations
5. Check no circular dependencies introduced

### Step 7: Generate Review

```markdown
# PR Review — [PR Title]

## Verdict: ✅ APPROVE / ❌ REQUEST CHANGES

## Summary
[1-2 sentence summary of the changes]

## Security
- [Pass/Fail with details]

## Coding Standards
- [Pass/Fail with details]

## Testing
- [Pass/Fail with details]

## ADR Compliance
- [Pass/Fail with details]

## Architecture
- [Pass/Fail with details]

## Blocking Issues
- [List or "none"]

## Non-Blocking Suggestions
- [List or "none"]

## Files Reviewed
- [File list with status per file]
```

## Auto-Shielding

- **BLOCK APPROVE** if any security violation found
- **BLOCK APPROVE** if architecture boundary violated
- **WARN** if test coverage is insufficient but non-blocking
- **WARN** if coding standard violations are cosmetic only

## Rules

1. Check EVERY changed file, not just a sample
2. Security violations are always blocking — no exceptions
3. Architecture boundary violations are always blocking
4. Missing tests for new ViewModels are blocking
5. Coding standard violations are blocking only if they affect correctness
6. Include specific file:line references for every finding
7. Provide fix suggestions for every issue
8. The verdict must be unambiguous: APPROVE or REQUEST CHANGES
