---
name: swf-health-check
description: "Full project diagnostic — SPM, build, tests, SwiftLint, architecture boundaries, dependencies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Purpose

Run a comprehensive project health diagnostic covering SPM resolution, build state, test coverage, SwiftLint compliance, architecture boundary enforcement, unused code detection, dependency versions, and Firebase configuration validation.

## Execution Flow — 9 Checks

### Check 1: SPM Resolution State

1. Run `swift package resolve` and report any resolution errors
2. List all SPM dependencies with current versions
3. Flag any dependencies with unresolved or conflicting versions
4. Check `Package.swift` for deprecated API usage
5. Verify all local SPM modules compile independently

### Check 2: Build Status

1. Run `swift build` or `xcodebuild build` and capture warnings/errors
2. Categorize warnings by severity (deprecation, unused, type)
3. Count total warnings per module
4. Flag any hard errors blocking compilation
5. Check for build configuration issues across Debug/Release schemes

### Check 3: Test Coverage

1. Run test suite and collect coverage report
2. Report coverage per module:
   - ViewModel coverage (threshold: ≥ 80%)
   - Api coverage (threshold: ≥ 70%)
   - Utils coverage (threshold: ≥ 90%)
3. Flag modules below threshold
4. List untested public methods

### Check 4: SwiftLint Compliance

1. Run SwiftLint and collect violations
2. Categorize by rule (force_unwrapping, line_length, cyclomatic_complexity, etc.)
3. Report violation count per file/module
4. Flag critical violations: `force_unwrapping`, `force_cast`, `force_try`
5. Verify `.swiftlint.yml` configuration exists and is valid

### Check 5: Architecture Boundary Checks

1. Verify no Presentacion module imports Datos directly (must go through protocols)
2. Check that CoreUI does not import feature modules
3. Verify Coordinadores only exist in Presentacion layer
4. Ensure ViewModels do not import UIKit directly
5. Check SPM module dependency graph for circular dependencies
6. Validate Factory DI registrations match protocol declarations

### Check 6: Unused Imports & Dead Code

1. Scan for unused `import` statements
2. Detect unreferenced classes, structs, enums
3. Find unused private methods and properties
4. Identify TODO/FIXME comments older than 30 days
5. Flag empty protocol conformances

### Check 7: Dependency Versions

1. List all third-party dependencies with current vs latest version
2. Flag dependencies more than 2 minor versions behind
3. Check Alamofire, Realm, MSAL, Firebase, Factory versions
4. Warn about deprecated dependencies
5. Check for known security vulnerabilities in dependencies

### Check 8: Firebase Configuration Validation

1. Verify `GoogleService-Info.plist` exists and is valid
2. Check Firebase initialization in `AppDelegate` or `@main App`
3. Verify Crashlytics dSYM upload is configured in build phases
4. Check Remote Config defaults are set
5. Validate Analytics event naming conventions

### Check 9: Security Quick Scan

1. Grep for hardcoded secrets, API keys, tokens
2. Check for `print()` statements logging sensitive data
3. Verify Keychain usage for credential storage
4. Check SSL pinning configuration in Alamofire
5. Verify `.gitignore` excludes sensitive files

## Output

Generate a health report:

```
# Project Health Report — [Date]

## Summary
| Check | Status | Issues |
|-------|--------|--------|
| SPM Resolution | ✅/❌ | N |
| Build | ✅/❌ | N warnings, N errors |
| Test Coverage | ✅/❌ | N modules below threshold |
| SwiftLint | ✅/❌ | N violations |
| Architecture | ✅/❌ | N boundary violations |
| Unused Code | ✅/⚠️ | N items |
| Dependencies | ✅/⚠️ | N outdated |
| Firebase | ✅/❌ | N issues |
| Security | ✅/❌ | N findings |

## Overall Health: [HEALTHY / NEEDS ATTENTION / CRITICAL]

## Details
[Per-check detailed findings]

## Recommended Actions
[Prioritized list of fixes]
```

## Auto-Shielding

- **ABORT** if the project does not have a `Package.swift` — not an SPM project
- **WARN** if test coverage data is unavailable — suggest running tests first
- **WARN** if SwiftLint is not installed — suggest installation

## Rules

1. Run all checks in order — do not skip any
2. Report all findings, even if the check passes (for transparency)
3. Categorize issues by severity: Critical, Warning, Info
4. Provide actionable fix suggestions for every issue found
5. Never modify project files during health check — read-only operation
6. Include file paths and line numbers for all findings
7. Compare against thresholds from testing-policy.md and coding-standards.md
