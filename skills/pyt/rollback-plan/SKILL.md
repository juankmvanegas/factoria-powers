---
name: pyt-rollback-plan
description: "Use when a feature or change needs a rollback strategy before deployment â€” or when a deployment has gone wrong and needs reversal"
---

---
name: rollback-plan
description: "Generate rollback plan for migration or critical changes with git, DB, and service restart steps"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Generate a comprehensive rollback plan for migrations or critical changes. Includes git revert strategy, database rollback steps, service restart procedures, and verification steps to restore the previous working state.

## When to Use

- Before executing a migration module (proactive planning)
- When a deployment fails and rollback is needed
- Before making breaking changes to shared infrastructure
- As a safety net for any high-risk operation

## Execution Flow â€” 6 Strict Steps

1. **Identify rollback scope** â€” Determine what needs to be rolled back:
   - Code changes (git commits since last stable state)
   - Database migrations (Alembic revisions applied)
   - Configuration changes (environment variables, config files)
   - Infrastructure changes (new services, modified deployments)

2. **Generate git rollback strategy** â€” Based on the changes:
   - Identify the last known stable commit
   - List commits to revert (in reverse order)
   - Generate `git revert` commands (prefer revert over reset for shared branches)
   - If multiple commits, consider a single revert merge commit
   - Document: `git revert --no-commit {hash1} {hash2} && git commit -m "Rollback: {reason}"`

3. **Generate database rollback steps** â€” Based on Alembic migrations:
   - Identify current revision and target revision
   - Generate: `alembic downgrade {target_revision}`
   - Document data that may be lost during downgrade
   - If data migration was involved, document data restoration steps
   - Flag irreversible migrations (data deletions, column drops)

4. **Generate service restart steps** â€” Document:
   - Order of service restarts (dependencies first)
   - Health check verification after each restart
   - Cache invalidation steps if needed
   - Background worker restart procedures
   - Load balancer / proxy reconfiguration if needed

5. **Generate verification checklist** â€” After rollback:
   - Health endpoint responds correctly
   - Critical endpoints return expected data
   - Database state is consistent
   - No orphaned data or broken references
   - Monitoring/logging confirms normal operation

6. **Write rollback plan** â€” Save to `.cloud/planning/rollback-{change-slug}.md`:
   - Trigger conditions (when to execute rollback)
   - Step-by-step rollback procedure
   - Verification checklist
   - Estimated rollback time
   - Responsible person / team
   - Communication plan (who to notify)

## Auto-Shielding

- NEVER execute rollback steps without user confirmation
- NEVER use `git reset --hard` on shared branches â€” use `git revert`
- ALWAYS verify the target stable state exists before generating the plan
- ALWAYS flag irreversible database migrations as HIGH RISK

## Rules

- Every migration module MUST have a rollback plan before execution begins
- Rollback plans MUST be tested in a non-production environment first
- Irreversible migrations MUST have a data backup step before execution
- The rollback plan MUST include a time estimate for execution
- If rollback is impossible for certain changes, document this explicitly with alternative recovery strategies
- Rollback plans are versioned alongside the changes they protect
