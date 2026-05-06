---
name: pytml-rollback-plan
description: "Generate and execute rollback plan for migration or critical changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Before any `migration-execute` or critical change, generate a complete rollback strategy. If something fails during or after the change, execute the rollback to safely restore the previous state.

This skill is the project's safety net. Without a rollback plan, critical changes are NOT executed.

---

## Execution Flow

### Phase 1: Snapshot — Capture Current State

Before any change, document the current project state:

1. **Git state**: Current branch, last commit hash, uncommitted modified files. Recommend `git commit` or `git stash` if there are pending changes.
2. **Affected files list**: Identify ALL files that will be modified, created, or deleted.
3. **Build state**: Verify `dotnet build` compiles clean BEFORE making changes.
4. **Test state**: Run `dotnet test` and record current result.
5. **Project structure**: List solution projects, inter-project references, relevant NuGet packages.

Save snapshot in `.cloud/planning/rollback/[module]-snapshot.md`.

### Phase 2: Rollback Plan Generation

For EACH change to be made, document how to revert it:

1. **New files** → Rollback action: delete the file
2. **Modified files** → Rollback action: restore original content (from snapshot or git)
3. **Deleted files** → Rollback action: recreate with original content
4. **Changes in .csproj** → Rollback action: restore original references and packages
5. **Configuration changes** → Rollback action: restore original appsettings
6. **Database changes** → Rollback action: document SQL reversal script
7. **DI changes** → Rollback action: restore original dependency registrations

Save plan in `.cloud/planning/rollback/[module]-rollback.md`.

### Phase 3: Checkpoint Validation

After applying changes, verify the project still works. If ANY verification fails → activate Phase 4 (Rollback).

### Phase 4: Rollback Execution

When rollback is activated:

1. **Record the cause** — Why rollback was activated
2. **Execute steps in reverse order** — Follow the rollback plan step by step
3. **Verify restoration**: build compiles, tests pass, project structure restored
4. **Document result** — What failed and why (auto-shielding for future attempts)
5. **Notify audit-trail** — Record the rollback event

If rollback itself fails: Retry (max 3 attempts). If it fails 3 times → FULL STOP → Escalate to user. Suggest `git reset` to safety commit as last resort.

---

## Strict Rules

1. **ALWAYS** create the rollback plan BEFORE making changes — no exceptions
2. **ALWAYS** take git snapshot before critical operations
3. **NEVER** delete the rollback plan until the module is fully approved and verified
4. **NEVER** continue if rollback fails 3 times — escalate immediately
5. **ALWAYS** document the rollback cause for future learning (auto-shielding)
6. **Maximum 3 attempts** of rollback before full stop
7. **The rollback plan is immutable** once created — do not modify during change execution
8. **Each module has its own plan** — do not mix rollbacks from multiple modules
9. **Audit-trail records everything** — each executed rollback is recorded
10. **If there is no rollback plan, critical changes are NOT executed** — it is a blocker
