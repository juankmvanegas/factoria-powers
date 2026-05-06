---
name: pyt-eject-factory
description: "Use when the project needs to be ejected from the factory â€” removing factory configuration and standing alone"
---

---
name: eject-factory
description: "Remove Factoria from a mature project â€” DESTRUCTIVE OPERATION"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Remove all Factoria governance, configuration, and AI tooling from a project that has matured beyond the need for the factory framework. This is a DESTRUCTIVE operation that removes `.claude/`, `.ai/`, and `.cloud/` directories while preserving project-specific artifacts.

## When to Use

- When the project is mature and self-sustaining
- When the team no longer needs Factoria governance
- When transitioning to a different tooling framework
- NEVER during active development or migration

## Execution Flow â€” 7 Strict Steps

1. **Pre-flight check** â€” Before any deletion:
   - Run health-check to verify project is in good state (score >= 80)
   - Verify all tests pass
   - Verify no uncommitted changes (`git status` is clean)
   - Confirm the user understands this is DESTRUCTIVE

2. **Inventory what will be removed** â€” List all Factoria files:
   - `.claude/` â€” skills, commands, hooks, PRPs
   - `.ai/` â€” agents, AI skills
   - `.cloud/` â€” policies, ADRs, architecture docs, planning
   - `CLAUDE.md` â€” project configuration
   - Display the complete list to the user

3. **Preserve project-specific artifacts** â€” Before deletion, copy to a backup:
   - Custom skills created by the user (not from factory templates)
   - Project-specific ADRs (not standard factory ADRs)
   - Planning documents with project-specific content
   - Save to `factoria-backup-{date}/`

4. **Request explicit confirmation** â€” Show the user:
   - Total files to be deleted
   - Files being preserved in backup
   - WARNING: This operation cannot be undone (without git)
   - Require the user to type "EJECT" to confirm

5. **Execute removal** â€” Delete in order:
   - Remove `.claude/` directory
   - Remove `.ai/` directory
   - Remove `.cloud/` directory
   - Remove `CLAUDE.md`
   - Remove any Factoria references from `pyproject.toml` (if any)

6. **Verify clean state** â€” After removal:
   - All tests still pass
   - Application starts correctly
   - No broken imports or references to removed files
   - `ruff check` and `mypy` pass

7. **Final report** â€” Output:
   - Files removed (count and list)
   - Files preserved in backup
   - Verification results
   - Recommendation: commit the ejection as a single commit

## Auto-Shielding

- NEVER execute without explicit "EJECT" confirmation from user
- NEVER remove files if tests are failing
- NEVER remove files if there are uncommitted changes
- ALWAYS create backup of project-specific artifacts before deletion
- ALWAYS verify application still works after removal

## Rules

- This is a ONE-WAY operation â€” there is no "undo" (except git revert)
- Health check score MUST be >= 80 before ejection
- All tests MUST pass before AND after ejection
- Backup directory MUST be created before any deletion
- The ejection MUST be committed as a single atomic commit
- If any post-ejection verification fails, offer to restore from backup
