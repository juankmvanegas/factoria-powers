---
name: ang-rollback-plan
description: "Use when a feature or change needs a rollback strategy before deployment — or when a deployment has gone wrong and needs reversal"
---

---
name: rollback-plan
description: "Rollback plan and execution for critical Angular changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Generate snapshot and reversion plan before critical changes.

## When it activates

- Before `/migration-execute`
- Before changes that affect multiple modules
- When the user invokes it manually

## Flow

### Phase 1: Snapshot

1. List all files that will be modified
2. Record current state (git hash if available)
3. Save in `.cloud/planning/rollback/rollback-snapshot.md`

### Phase 2: Rollback Plan

```markdown
# Rollback Plan

## Trigger
- Build fails after migration
- Tests fail
- Broken functionality

## Rollback Steps
1. Revert modified files to snapshot
2. Verify `ng build`
3. Verify `ng test`
4. Confirm functionality restored

## Affected Files
| File | Action | Reversion |
```

### Phase 3: Execution (if needed)

1. Revert changes using git or snapshots
2. Verify build and tests
3. Document rollback reason

## Rules

- Maximum 3 fix attempts before activating rollback
- ALWAYS generate snapshot BEFORE changes
