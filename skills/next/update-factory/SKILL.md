---
name: next-update-factory
description: "Use when the factory configuration or plugin needs to be updated with new skills, ADRs, or policies"
---

---
name: update-factory
description: "Update Factoria-Next when a new version is available"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Update Factoria-Next configuration files when a new version of the factory framework is available. Compares current factory files against the latest version, applies updates to skills, policies, ADRs, and agents while preserving any project-specific customizations.

## Execution Flow — 5 Steps

### Step 1: Detect Current Version

Read the current factory version from `CLAUDE.md` or `.cloud/factory-version.md`:
```bash
grep -i "version" CLAUDE.md || echo "No version found"
```

List all current factory files:
- `.claude/skills/*/SKILL.md` — skills
- `.cloud/policies/*.md` — policies
- `.cloud/architecture/decisions/ADR-*.md` — ADRs
- `.ai/agents/*.md` — agents

### Step 2: Compare with Latest

For each factory file, compare against the latest version source:
- **Identical** — no update needed
- **Updated upstream** — factory template changed, project file unchanged → safe to update
- **Customized locally** — project file was modified by the user → merge required
- **New file** — exists in latest but not in project → add

### Step 3: Identify Customizations

Before updating, detect project-specific customizations:
- Skills with added rules or modified execution flows
- Policies with company-specific additions
- ADRs marked as project-specific (not from factory template)
- Custom agents created via `/skill-creator`

Tag these as `[CUSTOM]` — they will NOT be overwritten.

### Step 4: Apply Updates

For each file that needs updating:
1. **Safe update** (no customizations): replace file content entirely
2. **Merge required** (has customizations): show diff and ask user:
   ```
   File: .cloud/policies/security-policy.md
   ─────────────────────────────────────────
   Factory update adds: Section 13 — API Route Security Headers
   Your customization: Added company-specific compliance section

   Options:
     A. Accept factory update (preserves your customizations)
     B. Keep current file (skip this update)
     C. Show full diff
   ```
3. **New file**: add with notification

### Step 5: Report

```
Factory Update Complete
═══════════════════════
  Updated: 8 files
  Added: 2 new files
  Skipped: 3 (customized, user chose to keep)
  Preserved: 5 custom files untouched

  Files updated:
    ✅ .claude/skills/frontend/SKILL.md
    ✅ .cloud/policies/security-policy.md
    ➕ .claude/skills/new-skill/SKILL.md
    ⏭️ .cloud/policies/coding-standards.md (customized, kept)
```

## Rules

- NEVER overwrite files tagged as `[CUSTOM]` without user approval
- ALWAYS show diffs before merging customized files
- ALWAYS preserve project-specific ADRs (those not from the factory template)
- NEVER update if the project has uncommitted changes — ask to commit first
- ALWAYS create a git commit after updates: `chore: update Factoria-Next to v{version}`
- If an update introduces breaking changes (renamed skills, removed policies), WARN the user explicitly
