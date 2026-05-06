---
name: ang-update-factory
description: "Use when the factory configuration or plugin needs to be updated with new skills, ADRs, or policies"
---

---
name: update-factory
description: "Update Factoria-Ang when a new version is available"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Update Factoria-Ang files when a new version is available.

## Flow

1. Compare current version vs new
2. Identify changes (new skills, updated policies, new ADRs)
3. Apply changes without affecting project code
4. Verify compatibility
5. Document update in CHANGELOG

## Rules

- NEVER modify project code during update
- ALWAYS back up before
- ALWAYS verify compatibility
