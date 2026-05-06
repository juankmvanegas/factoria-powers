---
name: swf-swiftui-optimization
description: "Detect and fix SwiftUI performance issues — unnecessary rebuilds, heavy body, missing lazy loading"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: SwiftUI Optimization

## Purpose

Detect SwiftUI performance issues including unnecessary view rebuilds, heavy computation in body, incorrect property wrapper usage, large view hierarchies, and missing lazy loading. Generates a report with specific fixes.

## Execution Flow — 6 Checks

### Check 1: Unnecessary View Rebuilds

1. Scan for `@ObservedObject` where `@StateObject` should be used (ViewModel created in the same view)
2. Detect `@State` properties that should be `let` constants
3. Find Views whose body depends on unrelated state changes
4. Identify `ObservableObject` classes that publish too frequently
5. Check for `objectWillChange.send()` calls that trigger unnecessary updates

**Fix pattern**:
```swift
// BAD — recreates ViewModel every parent rebuild
@ObservedObject var viewModel = FeatureViewModel()

// GOOD — persists across parent rebuilds
@StateObject var viewModel = FeatureViewModel()
```

### Check 2: Heavy Computation in Body

1. Detect complex logic in `body` property (conditionals, loops, transformations)
2. Find date formatting, number formatting, or string processing in `body`
3. Identify image processing or data transformation inline
4. Search for `filter`, `map`, `sorted` on large collections in body

**Fix pattern**: Extract to computed properties or ViewModel methods.

### Check 3: @StateObject vs @ObservedObject

1. Map all property wrapper usages across Views
2. Flag `@StateObject` used for injected ViewModels (should be `@ObservedObject`)
3. Flag `@ObservedObject` used for ViewModels created in the View (should be `@StateObject`)
4. Verify `@EnvironmentObject` is properly injected in parent

| Usage | Correct Wrapper |
|-------|----------------|
| ViewModel created in this View | `@StateObject` |
| ViewModel passed from parent | `@ObservedObject` |
| ViewModel from environment | `@EnvironmentObject` |
| Simple value state | `@State` |
| Two-way binding from parent | `@Binding` |

### Check 4: Large View Hierarchies

1. Count view nesting depth per file
2. Flag Views with body >50 lines — suggest extraction
3. Identify repeated view patterns that should be extracted to components
4. Check for deeply nested `VStack`/`HStack`/`ZStack` (>5 levels)
5. Flag Views that render >20 items without `LazyVStack`/`LazyHStack`

### Check 5: Missing Lazy Loading

1. Find `List` or `ScrollView` with `ForEach` rendering many items
2. Check if `LazyVStack`/`LazyHStack` is used inside ScrollView
3. Detect image loading in Lists without lazy loading
4. Find `ForEach` without `.id()` modifier when items change
5. Check for `onAppear` being used for pagination vs prefetching

**Fix pattern**:
```swift
// BAD — loads all items at once
ScrollView {
    VStack {
        ForEach(items) { item in
            ItemView(item: item)
        }
    }
}

// GOOD — lazy loads as user scrolls
ScrollView {
    LazyVStack {
        ForEach(items) { item in
            ItemView(item: item)
        }
    }
}
```

### Check 6: Animation and Transition Performance

1. Detect `.animation()` on container views (affects all children)
2. Find missing `withAnimation` for state changes that should animate
3. Check for heavy transitions on frequently rebuilt views
4. Identify `GeometryReader` used where fixed sizes would suffice

## Output

```markdown
# SwiftUI Performance Report

## Summary
- Views analyzed: X
- Performance issues: X (Critical: X, Warning: X, Info: X)

## Critical Issues
[Issues that cause visible performance degradation]

## Warnings
[Issues that may cause performance degradation under load]

## Optimizations Applied
[If fixes were requested, list changes made]
```

## Auto-Shielding

- **ABORT** if project has no SwiftUI views — wrong skill
- **WARN** if more than 20 critical issues found — suggest systematic refactoring plan

## Rules

1. Analysis is read-only by default — only modify if user explicitly requests fixes
2. Prioritize fixes by user-visible impact (jank, slow scrolling, laggy interactions)
3. Always suggest the minimal fix — don't over-engineer
4. Test that fixes don't break existing functionality
5. Property wrapper corrections require careful testing (state behavior changes)
6. Lazy loading changes must preserve scroll position behavior
7. Never remove animations without user approval — may be intentional
