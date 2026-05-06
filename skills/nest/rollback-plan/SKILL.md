---
name: nest-rollback-plan
description: "Use when a feature or change needs a rollback strategy before deployment — or when a deployment has gone wrong and needs reversal"
---

---
name: rollback-plan
description: "Generate and execute rollback for critical changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Generate a rollback plan before critical changes and execute rollback if needed.

## Execution Flow

### Generation Phase

1. Capture current state: list all files to be modified
2. Create git snapshot (tag or branch)
3. Document reversion steps in `.cloud/planning/rollback-[feature].md`
4. Include: files to revert, module registrations to undo, test files to remove

### Execution Phase (if rollback is needed)

1. Read rollback plan
2. Revert files to snapshot state
3. Verify project builds (`npm run build`)
4. Verify tests pass (`npm test`)
5. Update audit trail

## Rules

- ALWAYS generate rollback plan BEFORE making changes
- NEVER execute rollback without user confirmation
- Verify project works after rollback
