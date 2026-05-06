---
name: swf-rollback-plan
description: "Generate rollback plan for a set of changes — affected files, dependencies, restoration sequence"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Generate a rollback plan for a set of changes. Identifies all files changed, dependencies affected, correct restoration sequence, and verification steps. Ensures changes can be safely reverted without breaking the build or other features.

## Execution Flow — 5 Strict Steps

### Step 1: Identify Changed Files

1. Read git diff or provided change list
2. Categorize changes:
   - **New files** — Must be deleted on rollback
   - **Modified files** — Must be reverted to previous version
   - **Deleted files** — Must be restored on rollback
   - **Renamed files** — Must be renamed back
3. Map changes per SPM module

### Step 2: Analyze Dependencies

1. For each changed file, find all files that import/reference it
2. Build reverse dependency graph
3. Identify cascade effects: if file A changes, what else breaks?
4. Check Factory DI registrations affected
5. Check Coordinator routes affected
6. Verify test files that depend on changed code

### Step 3: Determine Rollback Sequence

Order rollback steps by dependency (reverse of implementation order):

```markdown
## Rollback Sequence

### Step 1: Revert UI Changes
- Revert PresentacionFeature views and ViewModels
- Remove new SwiftUI Views

### Step 2: Revert Navigation
- Revert Coordinator changes
- Remove new routes

### Step 3: Revert DI Registrations
- Remove new Container registrations
- Revert Dependencias module

### Step 4: Revert Data Layer
- Revert Api implementations
- Remove new models
- Revert EnrutadorApi changes

### Step 5: Revert Shared Modules
- Revert Core module changes
- Revert CoreUI component changes

### Step 6: Clean Up
- Delete new test files
- Revert Package.swift changes
- Remove new SPM module targets
```

### Step 4: Generate Rollback Commands

```bash
# Git-based rollback
git revert <commit-hash>

# Or file-level rollback
git checkout <previous-commit> -- path/to/file.swift

# SPM resolution after rollback
swift package resolve

# Verify build
swift build

# Verify tests
swift test
```

### Step 5: Generate Verification Checklist

```markdown
## Post-Rollback Verification

- [ ] Project compiles without errors
- [ ] All existing tests pass
- [ ] No orphaned Factory DI registrations
- [ ] No broken Coordinator routes
- [ ] No orphaned SPM module references
- [ ] SwiftLint passes with zero violations
- [ ] App launches and navigates correctly
```

## Output

```markdown
# Rollback Plan — [Change Description]
## Date: [YYYY-MM-DD]

## Changes to Rollback
| File | Action | Module |
|------|--------|--------|
| path/to/file.swift | Revert | ModuleName |
| path/to/new.swift | Delete | ModuleName |

## Dependency Impact
[Reverse dependency graph]

## Rollback Sequence
[Ordered steps]

## Commands
[Git commands for rollback]

## Verification Checklist
[Post-rollback checks]

## Risk: [LOW / MEDIUM / HIGH]
## Estimated Rollback Time: [Xm]
```

## Auto-Shielding

- **ABORT** if changes cannot be identified (no git history, no change list)
- **WARN** if rollback affects shared modules used by multiple features
- **WARN** if database schema changes are involved (may need migration)

## Rules

1. Rollback must be in reverse dependency order
2. Never skip Factory DI cleanup
3. Always verify build and tests after rollback
4. Include specific git commands for every step
5. Flag irreversible changes (database migrations, API contract changes)
6. Keep rollback plan alongside the PRP or feature documentation
