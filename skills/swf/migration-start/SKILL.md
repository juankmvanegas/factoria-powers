---
name: swf-migration-start
description: "Migration step 0 — detect constraints, blockers, and compatibility before migration"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Migration Step 0: Detect all constraints, blockers, and compatibility issues before beginning a migration. Checks iOS version requirements, deprecated API usage, third-party library compatibility with SwiftUI/Combine, and architectural blockers.

## Execution Flow — 6 Strict Steps

### Step 1: Detect iOS Deployment Target

1. Read `Podfile`, `Package.swift`, or Xcode project for deployment target
2. Report current minimum iOS version
3. Check if target supports SwiftUI (iOS 13+), Combine (iOS 13+), async/await (iOS 15+)
4. Flag APIs requiring iOS 15+ that won't work on lower targets
5. Recommend minimum deployment target for full migration: iOS 15+

### Step 2: Detect Deprecated APIs

1. Scan for APIs deprecated in the current Xcode/Swift version
2. Categorize by deprecation urgency:
   - **Removed** — Will not compile in next Xcode version
   - **Deprecated** — Still works but flagged
   - **Soft deprecated** — Apple recommends alternatives
3. List replacement APIs for each deprecated usage
4. Estimate effort to replace deprecated APIs

### Step 3: Third-Party Compatibility Audit

For each dependency, check:

| Library | SwiftUI Compatible | Combine Support | SPM Support | Min iOS |
|---------|-------------------|-----------------|-------------|---------|
| Alamofire | ✅ | ✅ (Publisher ext) | ✅ | 13 |
| Realm | ✅ | ✅ (@ObservedResults) | ✅ | 13 |
| MSAL | ⚠️ (wrapper needed) | ❌ (callback-based) | ✅ | 14 |
| Firebase | ✅ | ⚠️ (partial) | ✅ | 13 |

Flag libraries that:
- Do not support SPM (migration blocker)
- Require UIKit (cannot use in SwiftUI directly)
- Have no Combine support (need wrapper)
- Pin a higher iOS minimum than project target

### Step 4: Architecture Blockers

1. Detect tight coupling between modules
2. Find global mutable state (singletons without protocol abstraction)
3. Identify circular dependencies
4. Check for `UIApplication.shared` usage in non-app modules
5. Find direct file system access in presentation layer
6. Detect mixed Objective-C / Swift modules that complicate migration

### Step 5: Swift Version Compatibility

1. Check current Swift version in use
2. Verify Swift 5.10+ features available (strict concurrency, etc.)
3. Flag code using older Swift idioms that should be modernized
4. Check for `@objc` bridges that may not migrate cleanly
5. Identify Objective-C runtime dependencies

### Step 6: Generate Constraints Report

Save to `.cloud/migration/constraints-report.md`:

```markdown
# Migration Constraints Report — [Project Name]
## Date: [YYYY-MM-DD]

## Environment
- Xcode version: X
- Swift version: X
- Deployment target: iOS X
- Recommended target: iOS 15+

## Blocker Summary
| Category | Blockers | Warnings |
|----------|----------|----------|
| iOS Version | X | X |
| Deprecated APIs | X | X |
| Third-Party | X | X |
| Architecture | X | X |
| Swift Compat | X | X |

## GO / NO-GO Decision: [GO / NO-GO / CONDITIONAL]

## Blockers (Must Fix Before Migration)
[Detailed list]

## Warnings (Can Fix During Migration)
[Detailed list]

## Recommendations
[Ordered list of pre-migration fixes]
```

## Auto-Shielding

- **ABORT** if project does not compile — fix build errors first
- **ABORT** if deployment target is below iOS 13 — SwiftUI not available
- **WARN** if more than 5 blockers found — migration may not be feasible now
- **WARN** if Objective-C code exceeds 20% of codebase

## Rules

1. Read-only operation — never modify code during constraint detection
2. Check every third-party library, not just major ones
3. Include version numbers for all findings
4. Provide clear GO / NO-GO recommendation
5. If NO-GO, list exact steps to unblock
6. Save report to `.cloud/migration/constraints-report.md`
7. This skill must be run before `migration-discovery`
