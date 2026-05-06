---
name: nest-update-factory
description: "Use when the factory configuration or plugin needs to be updated with new skills, ADRs, or policies"
---

---
name: update-factory
description: "Update Factoria to the latest version from MCP server"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Check for updates from the Factoria MCP server and apply new skills, policies, or ADRs.

## Execution Flow

1. Call MCP: `sync_project(factory: "nest")`
2. Review sync report for new/updated documents
3. If updates found: inform user and ask to re-bootstrap
4. Apply updates while preserving project-specific customizations

## Rules

- NEVER overwrite project-specific files without user confirmation
- Always show what changed before applying
