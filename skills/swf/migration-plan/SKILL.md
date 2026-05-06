---
name: swf-migration-plan
description: "Migration step 2 — generate migration plan from discovery output with priority and effort estimates"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Migration Step 2: Generate a structured migration plan from the discovery report. Prioritizes modules by dependency order, estimates effort per module, identifies breaking changes, and produces a phased execution roadmap.

## Execution Flow — 6 Strict Steps

### Step 1: Load Discovery Report

1. Read `.cloud/migration/discovery-report.md`
2. Parse all inventories: UIKit views, data layer, navigation, dependencies, async patterns
3. Build a dependency graph between modules/files
4. Calculate total migration scope

### Step 2: Build Dependency Graph

1. Map imports between files to establish dependency order
2. Identify leaf modules (no dependencies on other legacy modules)
3. Identify core modules (many dependents)
4. Detect circular dependencies — these must be broken first
5. Assign topological order for migration sequence

### Step 3: Estimate Effort Per Module

| Component Type | Base Effort | Multiplier |
|----------------|-------------|------------|
| Simple UIViewController (<100 lines) | 2h | 1x |
| Complex UIViewController (>300 lines) | 8h | Lines/100 |
| UITableView/UICollectionView | 4h | Cells count |
| Storyboard with segues | 3h | Segue count |
| Callback-based API client | 2h | Endpoint count |
| Manual DI setup | 1h | Dependency count |
| CoreData model | 4h | Entity count |
| Custom UI components | 3h | Component count |

Adjustment factors:
- Heavy business logic: +50%
- Shared by multiple modules: +30%
- Has existing tests: -20%
- Uses deprecated APIs: +40%

### Step 4: Identify Breaking Changes

For each module migration, flag:

1. Protocol changes other modules depend on
2. Notification names that will change
3. Delegate protocols being removed
4. Public API surface changes
5. Data model changes requiring migration
6. Navigation flow changes

### Step 5: Generate Phased Plan

Organize migration into phases:

```markdown
## Phase 1: Foundation (Weeks 1-2)
Priority: Break circular dependencies, migrate core utilities
- Module A (leaf, 2h) — No dependencies
- Module B (leaf, 3h) — No dependencies

## Phase 2: Data Layer (Weeks 3-4)
Priority: Migrate API clients and data persistence
- Module C (data, 4h) — Depends on: A
- Module D (data, 6h) — Depends on: A, B

## Phase 3: Presentation (Weeks 5-8)
Priority: Migrate ViewControllers to SwiftUI
- Module E (UI, 8h) — Depends on: C, D
- Module F (UI, 4h) — Depends on: C

## Phase 4: Navigation (Week 9)
Priority: Replace Storyboard navigation with Coordinators
- Remove Storyboard files
- Consolidate Coordinator registrations

## Phase 5: Cleanup (Week 10)
Priority: Remove legacy code, update documentation
```

### Step 6: Generate Plan Document

Save to `.cloud/migration/migration-plan.md`:

```markdown
# Migration Plan — [Project Name]
## Generated: [YYYY-MM-DD]
## Based on: discovery-report.md

## Summary
- Total modules to migrate: X
- Estimated total effort: X hours
- Recommended phases: X
- Breaking changes identified: X
- Risk level: LOW/MEDIUM/HIGH

## Dependency Graph
[Mermaid or text-based graph]

## Phase Details
[Per-phase breakdown with modules, effort, dependencies, breaking changes]

## Risk Register
| Risk | Impact | Mitigation |
|------|--------|------------|
| ... | ... | ... |

## Rollback Strategy
[Per-phase rollback approach]
```

## Auto-Shielding

- **ABORT** if discovery report does not exist — run `migration-discovery` first
- **ABORT** if discovery report is older than 7 days — re-run discovery
- **WARN** if total effort exceeds 200 hours — suggest reducing scope
- **WARN** if circular dependencies found — must be resolved before migration

## Rules

1. Always migrate leaf modules first (no legacy dependencies)
2. Never plan to migrate more than 3 modules per phase
3. Every phase must end with a stable, buildable, testable state
4. Include rollback strategy for every phase
5. Flag shared modules that need bridge layers during transition
6. Effort estimates include test writing time
7. Plan must be reviewed and approved before execution
8. Save plan to `.cloud/migration/migration-plan.md`
