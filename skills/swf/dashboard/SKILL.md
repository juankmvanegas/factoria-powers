---
name: swf-dashboard
description: "Generate project health dashboard — modules, coverage, dependencies, compliance"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Dashboard

## Purpose

Generate a comprehensive project health dashboard showing module count, test coverage, dependency graph, open issues, architecture compliance score, and quality metrics for the iOS/Swift project.

## Execution Flow — 5 Sections

### Section 1: Module Overview

1. Count all SPM modules (Core, CoreUI, Features, Dependencias)
2. List each module with its source file count
3. Calculate total lines of code per module
4. Identify modules without tests
5. Map module creation/last modification dates

Output:
```markdown
## Module Overview
| Module | Files | LOC | Tests | Last Modified |
|--------|-------|-----|-------|---------------|
```

### Section 2: Test Coverage

1. Parse Xcode coverage reports if available
2. Calculate coverage per module:
   - ViewModel coverage (target: 80%)
   - Api coverage (target: 70%)
   - Utils coverage (target: 90%)
3. Identify untested ViewModels
4. Identify untested API implementations
5. Show coverage trend (if previous reports exist)

Output:
```markdown
## Test Coverage
| Module | ViewModel % | Api % | Utils % | Status |
|--------|------------|-------|---------|--------|
```

### Section 3: Dependency Graph

1. Parse all Package.swift files
2. Generate text-based dependency tree
3. Count direct and transitive dependencies per module
4. Identify the deepest dependency chain
5. Flag any circular or cross-feature dependencies

Output:
```markdown
## Dependency Graph
Dependencias
└── Core
    ├── CoreUI
    │   └── Feature-A
    │   └── Feature-B
    └── Feature-C
```

### Section 4: Architecture Compliance

1. Run architecture validation checks:
   - Module boundary violations
   - @MainActor compliance on ViewModels
   - Coordinator pattern usage
   - Factory DI registration completeness
   - Protocol-based dependency injection
2. Calculate compliance score (0-100)
3. List violations with file references

Output:
```markdown
## Architecture Compliance: [Score]/100
| Check | Status | Details |
|-------|--------|---------|
| Module boundaries | PASS/FAIL | [details] |
| @MainActor | PASS/FAIL | [X/Y ViewModels] |
| Coordinator pattern | PASS/FAIL | [details] |
| Factory DI | PASS/FAIL | [details] |
```

### Section 5: Quality Metrics

1. Run SwiftLint and count warnings/errors
2. Count TODO/FIXME/HACK markers
3. Identify files >300 lines
4. Identify methods >50 lines
5. Count force unwraps outside tests
6. Count `Any` type usage

Output:
```markdown
## Quality Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| SwiftLint warnings | X | 0 | PASS/FAIL |
| Technical debt markers | X | — | INFO |
| Files >300 LOC | X | 0 | WARN |
| Force unwraps | X | 0 | FAIL |
```

## Final Dashboard

Combine all sections into a single report saved to `.cloud/reports/dashboard-[YYYY-MM-DD].md`.

Record `DASHBOARD_UPDATED` in audit trail.

## Auto-Shielding

- **ABORT** if no SPM modules found — wrong project structure
- **WARN** if coverage reports are not available — scores will be incomplete

## Rules

1. Dashboard is always read-only — never modify project files
2. All scores must be reproducible (same code = same dashboard)
3. Compare with previous dashboard when available to show trends
4. Archive previous dashboards — never overwrite
5. Use color indicators in summaries: PASS (green), WARN (yellow), FAIL (red)
6. Include generation timestamp and Swift/Xcode versions
