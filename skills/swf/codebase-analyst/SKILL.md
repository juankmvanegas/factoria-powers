---
name: swf-codebase-analyst
description: "Deep analysis of existing iOS/Swift codebase — patterns, architecture, dependencies, technical debt"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Codebase Analyst

## Purpose

Analyze an existing iOS/Swift codebase to identify patterns, validate against MVVM + SPM architecture rules, detect anti-patterns, technical debt, missing tests, and security issues. Generate a report with actionable recommendations.

## Execution Flow — 7 Steps

### Step 1: Structure Scan

1. Identify all `Package.swift` files and `.xcodeproj`/`.xcworkspace`
2. Map the SPM module structure (Core, CoreUI, Feature modules, Dependencias)
3. Identify Swift version and iOS deployment target
4. List all third-party dependencies from Package.swift
5. Count files by type (.swift, .xib, .storyboard, .json, .strings)
6. Identify build configurations and schemes

### Step 2: Module Dependency Graph

1. Parse all `Package.swift` files for dependency declarations
2. Map the module hierarchy: Dependencias → Core → CoreUI → Features
3. Detect cross-feature dependencies (violations)
4. Identify circular dependency chains
5. Verify no feature module imports another feature module directly
6. Generate a text-based dependency graph

### Step 3: ViewModel Catalog

1. Find all classes conforming to `ObservableObject`
2. For each ViewModel, catalog:
   - @MainActor presence
   - @Published properties count and types
   - Combine subscriptions (cancellables)
   - Dependencies (protocols injected)
   - Coordinator interactions
3. Flag ViewModels without @MainActor
4. Flag ViewModels with >8 @Published properties

### Step 4: Coordinator Flow Mapping

1. Find all Coordinator classes/protocols
2. Map navigation flows between screens
3. Identify deep link entry points
4. Flag direct navigation from Views (bypassing Coordinators)
5. Detect orphaned Coordinators (defined but not connected)

### Step 5: API Endpoint Mapping

1. Find all `EnrutadorApi` definitions
2. Map endpoints: URL, HTTP method, parameters
3. Identify API implementations and their protocols
4. Flag APIs without protocol abstraction
5. Detect hardcoded URLs or API keys

### Step 6: Anti-Pattern Detection

1. **God ViewModels** — ViewModels with >300 lines or >10 methods
2. **Business logic in Views** — Computation in `body` property
3. **Force unwrapping** — `!` usage outside tests
4. **Any usage** — `Any` or `AnyObject` instead of generics/protocols
5. **Massive closures** — Inline closures >20 lines
6. **Singleton abuse** — Singletons outside Factory container
7. **TODO/HACK/FIXME** — Technical debt markers
8. **Dead code** — Unreferenced classes or methods
9. **Missing weak self** — Closures capturing self strongly
10. **Storyboard/XIB usage** — Should be SwiftUI per architecture

### Step 7: Report Generation

Generate report:

```markdown
# Codebase Analysis: [ProjectName]

**Date**: [date]
**Swift Version**: [version]
**iOS Target**: [target]
**SPM Modules**: [count]

## Module Dependency Graph
[Text diagram]

## ViewModel Health
| ViewModel | @MainActor | @Published | Cancellables | Issues |
|-----------|-----------|------------|--------------|--------|

## Coordinator Flows
[Flow diagram]

## API Endpoints
| Endpoint | Method | Module | Protocol |
|----------|--------|--------|----------|

## Anti-Patterns Found
| Severity | Type | File | Line | Description |
|----------|------|------|------|-------------|

## Technical Debt Score
[Score 0-100 with breakdown]

## Recommendations
[Prioritized action items]
```

## Auto-Shielding

- **ABORT** if no Swift files found — wrong project type
- **WARN** if project uses Storyboards exclusively — may need migration assessment

## Rules

1. Never modify code during analysis — this is strictly read-only
2. Report all findings with exact file paths and line numbers
3. Categorize by severity: Critical, Warning, Info
4. Include positive findings (things done well) alongside issues
5. Technical debt score should be reproducible (same code = same score)
6. Recommendations must be prioritized by impact and effort
