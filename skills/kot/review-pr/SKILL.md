---
name: kot-review-pr
description: "Review code against policies and architecture"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Review PR — Code Review

## Purpose

Analyze code changes for compliance with coding standards, security policy, testing policy, and architecture rules.

## Review Checklist

### 1. Architecture
- [ ] Module dependencies are correct (feature → domain → core)
- [ ] No circular dependencies
- [ ] ViewModels in feature modules
- [ ] UseCases in domain module
- [ ] Repository implementations in data module
- [ ] Correct Hilt scopes (@ViewModelScoped, @Singleton)

### 2. Coding Standards
- [ ] Code in Spanish (class names, functions, variables)
- [ ] Correct naming (ViewModel, UseCase, Repository suffixes)
- [ ] StateFlow for UI state
- [ ] SharedFlow for one-shot events
- [ ] Result type for operations that can fail
- [ ] No commented-out code
- [ ] No TODOs without associated ticket

### 3. Security
- [ ] No hardcoded secrets
- [ ] No API keys in code
- [ ] SQLCipher configured for sensitive data
- [ ] ProGuard rules updated for new classes
- [ ] No PII in logs
- [ ] Input validation present
- [ ] MSAL tokens handled correctly (if applicable)

### 4. Testing
- [ ] Tests exist for new ViewModels
- [ ] Tests exist for new UseCases
- [ ] Tests follow AAA pattern
- [ ] Tests use MockK correctly
- [ ] StateFlow tests use Turbine
- [ ] Coverage >= 70%

### 5. Compose (if there are UI changes)
- [ ] State hoisting implemented
- [ ] Preview with sample data
- [ ] Modifier as first parameter
- [ ] No business logic in Composables
- [ ] remember/derivedStateOf used where appropriate

### 6. Dependencies
- [ ] New dependencies are in libs.versions.toml
- [ ] No unauthorized dependencies
- [ ] Versions are the approved ones

## Output

```markdown
# PR Review: [PR Title]

## Summary
[N] files reviewed | [X] issues found

## 🔴 BLOCK (must be fixed before merge)
- [Issue 1]: [file:line] — [description]
- [Issue 2]: ...

## 🟡 WARN (consider fixing)
- [Warning 1]: [description]

## 🟢 INFO (suggestions)
- [Suggestion 1]: ...

## ✅ APPROVE / ❌ REQUEST CHANGES

[Final comment]
```

## Severities

- **BLOCK** — Policy or architecture violation. Cannot be merged.
- **WARN** — Should be fixed but does not block.
- **INFO** — Suggested improvement, optional.
