---
name: swf-analyze-viewmodels
description: "Analyze ViewModels for patterns, compliance, and anti-patterns in iOS/Swift"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Analyze ViewModels

## Purpose

Analyze iOS/Swift ViewModels for architecture compliance, pattern correctness, memory safety, and anti-patterns. Generates a report with actionable findings categorized by severity.

## Execution Flow — 6 Checks

### Check 1: @MainActor Compliance

1. Scan all ViewModel files for `@MainActor` annotation
2. Flag any ViewModel class missing `@MainActor`
3. Check for `nonisolated` properties — they must be justified (e.g., constants)
4. Verify `ObservableObject` conformance is present
5. Flag any direct `DispatchQueue.main.async` calls — should use `@MainActor` instead

### Check 2: @Published State Management

1. List all `@Published` properties per ViewModel
2. Flag ViewModels with more than 8 `@Published` properties (suggest decomposition)
3. Verify `isLoading`, `errorMessage` patterns exist for API-connected ViewModels
4. Check for redundant state (e.g., `isLoading` AND `loadingState` enum)
5. Verify no `@Published` properties are set from outside the ViewModel

### Check 3: Combine Publisher Usage

1. Verify `cancellables: Set<AnyCancellable>` exists
2. Check that all `.sink()` subscriptions store in `cancellables`
3. Flag orphaned subscriptions (not stored)
4. Verify `.receive(on: DispatchQueue.main)` is used before UI-bound sinks
5. Check for overly complex publisher chains (>5 operators) — suggest extraction

### Check 4: Memory Leak Detection

1. Scan all closures for `[weak self]` usage on capture lists
2. Flag `self.` references in closures without `[weak self]`
3. Check for strong reference cycles between ViewModel and Coordinator
4. Verify `cancellables` is properly cleaned up (or ViewModel deinit is handled)
5. Flag retain cycles in nested closures

### Check 5: Coordinator Delegation

1. Verify navigation actions go through Coordinator (not direct `NavigationLink` pushes)
2. Check that Coordinator reference is injected via Factory (`@Injected`)
3. Flag any `UIApplication.shared` or `UINavigationController` direct access
4. Verify Coordinator protocol conformance

### Check 6: Error Handling Patterns

1. Check that all Combine `receiveCompletion` handlers process `.failure`
2. Verify errors are mapped to user-friendly messages
3. Flag raw error descriptions exposed to UI
4. Check for empty catch blocks or ignored errors
5. Verify error state is reset before retrying operations

## Output

Generate a report with:
```
# ViewModel Analysis Report

## Summary
- Total ViewModels scanned: X
- Compliant: X
- Issues found: X (Critical: X, Warning: X, Info: X)

## Critical Issues
[List with file:line references]

## Warnings
[List with file:line references]

## Recommendations
[Actionable improvement suggestions]
```

## Auto-Shielding

- **ABORT** if no ViewModel files found in the project — wrong project type
- **WARN** if more than 50% of ViewModels fail @MainActor check — systemic issue

## Rules

1. Never modify code during analysis — this is read-only
2. Report all findings with exact file paths and line numbers
3. Categorize findings: Critical (breaks at runtime), Warning (potential issue), Info (improvement)
4. @MainActor missing is always Critical
5. Memory leak indicators are always Critical
6. Missing error handling is Warning
7. Style/pattern suggestions are Info
