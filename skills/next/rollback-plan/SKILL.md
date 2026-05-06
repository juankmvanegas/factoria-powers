---
name: next-rollback-plan
description: "Use when a feature or change needs a rollback strategy before deployment — or when a deployment has gone wrong and needs reversal"
---

---
name: rollback-plan
description: "Generate and execute rollback plan for migration or critical changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Generate a safe rollback plan before any risky operation (migration step, large refactor, critical infrastructure change). If something goes wrong, execute the rollback to restore the project to its previous known-good state.

## Execution Flow — 4 Steps

### Step 1: Snapshot Current State

Before any risky operation, capture the current state:

```bash
# Verificar que no hay cambios sin commitear
git status --porcelain

# Si hay cambios, commitearlos primero
git add -A && git commit -m "chore: pre-operation snapshot for rollback safety"

# Registrar el hash del snapshot
SNAPSHOT_HASH=$(git rev-parse HEAD)
echo "Snapshot: $SNAPSHOT_HASH"
```

Save snapshot info to `.cloud/planning/rollback-plan.md`:
```markdown
# Rollback Plan — {Operation Description}
## Snapshot
- Commit: {hash}
- Date: {timestamp}
- Branch: {current branch}
## Operation
- Description: {what is about to change}
- Risk level: {LOW/MEDIUM/HIGH/CRITICAL}
## Reversion Steps
1. git checkout {hash} -- {affected files}
2. npm install (if dependencies changed)
3. next build (verify build passes)
4. npm test (verify tests pass)
```

### Step 2: Define Affected Files

List all files that will be modified by the upcoming operation:
- New files to be created
- Existing files to be modified
- Files to be deleted
- Configuration changes (next.config.js, package.json, etc.)

### Step 3: Monitor Operation

During the risky operation, track:
- Files actually modified vs planned
- Build status after changes
- Test results after changes
- Any unexpected side effects

### Step 4: Execute Rollback (if needed)

When rollback is requested or auto-triggered by build/test failure:

```bash
# Restaurar archivos afectados al estado del snapshot
git checkout {SNAPSHOT_HASH} -- {affected files}

# Si se agregaron dependencias nuevas, restaurar package.json y reinstalar
git checkout {SNAPSHOT_HASH} -- package.json package-lock.json
npm install

# Verificar que el rollback es exitoso
npm run build
npm test -- --watchAll=false
```

Report rollback result:
```
Rollback Executed
═════════════════
  Restored to: {SNAPSHOT_HASH}
  Files reverted: {count}
  Build: ✅ PASS / ❌ FAIL
  Tests: ✅ PASS / ❌ FAIL
```

## Auto-Trigger Conditions

Rollback executes automatically when:
- `next build` fails after migration changes
- More than 30% of existing tests fail after changes
- A CRITICAL security scan finding is introduced

## Rules

- ALWAYS create a snapshot before any risky operation
- NEVER execute rollback without verifying the snapshot exists
- ALWAYS verify build and tests pass after rollback
- NEVER delete the rollback plan file until the operation is confirmed successful
- ALWAYS record rollback executions in the audit trail
- If rollback itself fails, STOP and report to user — do not attempt recursive recovery
