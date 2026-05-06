---
name: ang-eject-factory
description: "Use when the project needs to be ejected from the factory — removing factory configuration and standing alone"
---

---
name: eject-factory
description: "Remove Factoria-Ang from project — DESTRUCTIVE"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Remove Factoria-Ang from a mature project that no longer needs the factory.

## WARNING

This action is **DESTRUCTIVE** and **IRREVERSIBLE**. Confirm with the user before proceeding.

## What is removed

- `.claude/` — Skills, commands, hooks, PRPs
- `.cloud/` — Policies, architecture, planning
- `.ai/` — Agents
- CLAUDE.md — The brain

## What is preserved

- All Angular source code
- Tests
- CHANGELOG.md
- BUSINESS_LOGIC.md
- package.json, angular.json, etc.

## Flow

1. **Confirm** with the user (double confirmation)
2. Generate snapshot of current Factoria
3. Delete Factoria directories
4. Verify that `ng build` still works
5. Verify that `ng test` still passes

## Rules

- ALWAYS double confirmation
- ALWAYS snapshot before deleting
- NEVER touch source code
