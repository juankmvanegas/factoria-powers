---
name: kot-eject-factory
description: "Use when the project needs to operate standalone without the Factoria plugin installed"
user-invocable: true
---

# Eject Factory — Export to Standalone

## Purpose

Copy all Factoria policies, ADRs, and configuration from the plugin into the project so it can operate independently — without the Factoria plugin installed. After ejection, all governance files live inside the project repository.

## Execution Flow

### Step 1 — Confirm Intent

Show to the user before proceeding:

```
⚠️ Eject Factory — Standalone Mode

After ejection this project:
- Will NOT receive automatic policy/ADR updates from the Factoria plugin
- Must maintain its own governance files manually
- Will still have all current policies, ADRs, and coding standards

Recommended for: offline environments, locked-version governance, legacy projects.

Continue? (y/n)
```

### Step 2 — Copy Factory References

Read files from the plugin and write them into the project:
- Glob `references/kot/policies/*.md` → copy each to `.factory/policies/`
- Glob `references/kot/adrs/*.md` → copy each to `.factory/adrs/`
- Read `references/kot/CLAUDE.md` → Write to `.factory/CLAUDE.md`

### Step 3 — Update Project CLAUDE.md

Rewrite the project's `CLAUDE.md` to be self-contained:
- Remove the pointer to `factoria:using-factoria`
- Add content from `.factory/CLAUDE.md`
- Add at the top: `# Standalone Project (Ejected from Factoria-Kot)`

### Step 4 — Verify

- Glob `.factory/` to confirm all files were copied
- Grep for any remaining `factoria://` URIs in project files (must be zero)
- Report summary: files created, policies included, ADRs included

## Rules

- NEVER delete the original plugin files — copy only
- ALWAYS preserve all policy and ADR content exactly
- ALWAYS show the ejection summary after completing
- Add a note in `README.md` that the project is in standalone mode
