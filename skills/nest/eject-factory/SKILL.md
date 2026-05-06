---
name: nest-eject-factory
description: "Use when the project needs to be ejected from the factory — removing factory configuration and standing alone"
---

---
name: eject-factory
description: "Remove Factoria from project — destructive operation"
allowed-tools: Read, Write, Edit, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Remove all Factoria configuration from a project, leaving only the application code.

## Execution Flow

1. **Confirm with user** — This is irreversible. List all files that will be removed.
2. Remove `.mcp.json` or `.claude/settings.local.json`
3. Remove `.claude/` directory (skills, commands, hooks)
4. Remove `.ai/` directory (agents, AI skills)
5. Remove CLAUDE.md
6. Keep `.cloud/` (project artifacts belong to the project)
7. Keep all source code untouched

## Rules

- ALWAYS ask for explicit user confirmation before proceeding
- NEVER remove `.cloud/` — those are project artifacts
- NEVER remove source code or tests
- List every file to be deleted before deleting
