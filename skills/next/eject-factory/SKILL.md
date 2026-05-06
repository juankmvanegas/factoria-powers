---
name: next-eject-factory
description: "Use when the project needs to be ejected from the factory — removing factory configuration and standing alone"
---

---
name: eject-factory
description: "Remove Factoria from a mature project (DESTRUCTIVE OPERATION)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory (DESTRUCTIVE)

## Purpose

Remove all Factoria artifacts from a mature project that no longer needs the factory framework. This is a one-way operation — once ejected, the project operates independently without Factoria governance.

## WARNING

This operation is **irreversible**. All Factoria configuration, skills, policies, ADRs, agents, and audit trails will be permanently deleted from the project. The project code itself is preserved intact.

## Execution Flow — 6 Steps

### Step 1: Confirmation Gate (MANDATORY)

Ask the user for EXPLICIT confirmation:

```
⚠️  DESTRUCTIVE OPERATION — Eject Factoria

This will permanently remove:
  - .cloud/ (policies, ADRs, architecture docs, contracts, audit trail)
  - .ai/ (agents, AI skills)
  - .claude/ (skills, commands, hooks, PRPs)
  - CLAUDE.md (factory configuration)

Project code will NOT be modified.

Type "EJECT FACTORIA" to confirm:
```

If the user does not type the exact phrase → ABORT immediately.

### Step 2: Pre-Eject Snapshot

Create a git commit with all current changes:
```bash
git add -A && git commit -m "chore: pre-eject snapshot — Factoria artifacts preserved"
```

### Step 3: Archive Audit Trail

Copy `.cloud/audit/` to a temporary location for the user:
```bash
cp -r .cloud/audit/ ./factoria-audit-archive/
```

### Step 4: Remove Factoria Artifacts

Delete in order:
1. `.cloud/` — policies, ADRs, contracts, planning, audit
2. `.ai/` — agents and AI skills
3. `.claude/` — skills, commands, hooks, PRPs
4. `CLAUDE.md` — factory configuration

### Step 5: Clean References

Search for and remove any Factoria-specific references in:
- `package.json` scripts (if any Factoria hooks)
- `.gitignore` entries specific to Factoria
- Any remaining `.md` files referencing Factoria internals

### Step 6: Final Report

```
Eject Complete
══════════════
  Removed: .cloud/, .ai/, .claude/, CLAUDE.md
  Archived: ./factoria-audit-archive/ (audit trail preserved)
  Snapshot: git commit {hash} (pre-eject state)

  The project now operates independently.
  To restore Factoria, revert to commit {hash}.
```

## Rules

- NEVER proceed without explicit "EJECT FACTORIA" confirmation
- ALWAYS create a git snapshot before deletion
- ALWAYS archive the audit trail separately
- NEVER modify project source code (src/, app/, components/, etc.)
- NEVER remove node_modules, package.json, next.config.js, or any runtime files
- If git is dirty with uncommitted changes, commit them first with a descriptive message
