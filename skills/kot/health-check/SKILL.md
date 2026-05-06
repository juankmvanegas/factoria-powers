---
name: kot-health-check
description: "Comprehensive project diagnostics against standards"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Health Check — Project Diagnostics

## Purpose

Run a comprehensive diagnostic of the Android/Kotlin project against Factoria standards.

## Checks Executed

### 1. Compilation
- `./gradlew assembleDebug` — Verify it compiles
- `./gradlew assembleRelease` — Verify release build
- Status: PASS if both compile without errors

### 2. Tests
- `./gradlew test` — Run all unit tests
- Report: total, passing, failing
- Status: PASS if all pass

### 3. Coverage
- `./gradlew koverReport` or `./gradlew jacocoTestReport`
- Report: coverage %
- Status: PASS if >= 70%, WARN if >= 50%, FAIL if < 50%

### 4. Lint
- `./gradlew lint`
- Report: errors, warnings
- Status: PASS if 0 errors, WARN if only warnings, FAIL if errors

### 5. Dependencies
- `./gradlew dependencyUpdates` — Outdated dependencies
- Verify against `libs.versions.toml`
- Status: WARN if security updates available

### 6. Architecture
- Verify modules follow naming convention
- Verify inter-module dependencies are correct
- Verify no circular dependencies
- Status: PASS/FAIL based on violations

### 7. Policies
- Verify compliance with security-policy.md
- Verify compliance with testing-policy.md
- Verify compliance with coding-standards.md
- Status: PASS/FAIL per policy

### 8. Documentation
- Verify CHANGELOG.md exists
- Verify ADRs are up to date
- Verify current.md reflects reality
- Status: PASS if everything exists and is up to date

## Output

```markdown
# 🏥 Health Check — [Project] — [Date]

## Summary

| Check | Status | Details |
|-------|--------|---------|
| Compilation | ✅ PASS | Debug + Release OK |
| Tests | ✅ PASS | 150/150 passing |
| Coverage | 🟡 WARN | 68% (target: 70%) |
| Lint | ✅ PASS | 0 errors, 5 warnings |
| Dependencies | 🟡 WARN | 3 updates available |
| Architecture | ✅ PASS | No violations |
| Policies | ✅ PASS | 3/3 compliant |
| Documentation | ✅ PASS | Everything up to date |

## Overall Score: 87/100 — 🟢 HEALTHY

## Recommended Actions
1. Increase coverage to 70%
2. Update dependencies: [list]
3. Resolve lint warnings: [list]
```
