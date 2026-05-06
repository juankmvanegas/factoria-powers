---
name: python-update-factory
description: "Use when the factory configuration or plugin needs to be updated with new skills, ADRs, or policies"
---

---
name: update-factory
description: "Update Factoria-Python skills, policies, and ADRs from MCP server"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Check for and apply updates to Factoria-Python governance files (skills, policies, ADRs) from the MCP server. Ensures the project stays aligned with the latest factory standards without losing project-specific customizations.

## When to Use

- When notified that new factory updates are available
- Periodically to check for policy or ADR updates
- After the Factoria MCP server has been updated
- When onboarding a project that may have outdated factory files

## Execution Flow — 6 Strict Steps

1. **Check current versions** — Inventory local Factoria files:
   - List all skills in `.claude/skills/` with their content hashes
   - List all policies in `.cloud/policies/` with their content hashes
   - List all ADRs in `.cloud/architecture/decisions/` with their content hashes
   - List all agents in `.ai/agents/` with their content hashes
   - Record last sync timestamp from `.cloud/planning/last-sync.md`

2. **Fetch latest from MCP** — Query the Factoria MCP server:
   - Use `get-factory-context` tool to get current factory state
   - Compare local versions against server versions
   - Identify: new files, updated files, deprecated files

3. **Classify changes** — For each difference:
   - **New** — File exists on server but not locally (safe to add)
   - **Updated** — File exists both places but differs (needs merge review)
   - **Locally modified** — User has customized a factory file (preserve customizations)
   - **Deprecated** — File exists locally but removed from server (flag for review)

4. **Apply updates** — With user approval:
   - Add new files directly
   - For updated files: show diff, ask user to approve each change
   - For locally modified files: show both versions, let user choose
   - For deprecated files: warn but do not auto-delete

5. **Re-bootstrap if needed** — If major structural changes:
   - New skill directories to create
   - New agent definitions to add
   - Updated CLAUDE.md template to apply
   - Run re-bootstrap with merge strategy (not overwrite)

6. **Update sync record** — Write to `.cloud/planning/last-sync.md`:
   - Sync timestamp
   - Files added, updated, skipped
   - Next recommended sync date

## Auto-Shielding

- NEVER overwrite locally modified files without user approval
- NEVER auto-delete deprecated files
- ALWAYS show diffs before applying updates
- ALWAYS preserve project-specific customizations

## Rules

- Updates are opt-in — the user approves each change
- Locally modified files are NEVER silently overwritten
- New policies are always added (they may contain new compliance requirements)
- New ADRs are always added (they may contain new architectural decisions)
- The sync record MUST be updated after every sync operation
- If the MCP server is unreachable, report the error and suggest manual update
