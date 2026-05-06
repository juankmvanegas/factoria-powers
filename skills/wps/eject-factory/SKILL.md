---
name: wps-eject-factory
description: "Generate standalone project files independent of MCP factory"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Generate a fully standalone project configuration that removes all dependencies on the MCP Factoria server. After ejection, the project retains all policies, ADRs, skills, and commands as local files with no external MCP calls. This enables teams to operate independently while preserving the guardrails and conventions established by the factory.

## Execution Flow — 6 Strict Steps

### Step 1 — Inventory Factory Dependencies

- Scan the project for all MCP-related references:
  - `.claude/` commands and skills referencing factory URIs (`factoria://`).
  - `CLAUDE.md` references to MCP tools (`get-factory-context`, `get-workflow`, etc.).
  - Any scripts or configs that call the MCP server endpoint.
- List all dependencies to be resolved.

### Step 2 — Copy Policies and ADRs

- Copy all `.cloud/policies/*.md` into the project as standalone files.
- Copy all `.cloud/architecture/decisions/ADR-*.md` into the project.
- Ensure no file references external MCP URIs — replace `factoria://policy/...` with local relative paths.

### Step 3 — Localize Skills and Commands

- Copy all `.claude/skills/*/SKILL.md` into the project.
- Copy all `.claude/commands/*.md` into the project.
- Remove or replace any instruction that calls MCP tools with local equivalents:
  - `get-factory-context` → "Read local CLAUDE.md"
  - `validate-compliance` → "Read local .cloud/policies/"
  - `get-workflow` → "Read local .claude/skills/"

### Step 4 — Update CLAUDE.md

- Rewrite `CLAUDE.md` to be self-contained:
  - Remove MCP server connection instructions.
  - Replace factory tool references with local file paths.
  - Keep all rules, conventions, and workflow instructions intact.
  - Add a header: `# Standalone Project (Ejected from Factoria-Wps)`

### Step 5 — Generate Setup Script

- Create `scripts/setup-standalone.sh` that:
  - Verifies Node.js and npm versions.
  - Installs dependencies (`npm install`).
  - Runs initial build (`npm run build`).
  - Runs tests to verify baseline.
- Make the script executable.

### Step 6 — Verify Ejection

- Grep for any remaining `factoria://` URIs — must be zero.
- Grep for any MCP tool names — must be zero.
- Confirm `CLAUDE.md` has no external dependencies.
- Run build and tests to ensure nothing broke.
- Report ejection status: files created, references resolved, verification result.

## Rules

- NEVER delete the original factory-connected files — create ejected copies alongside or in a separate output directory.
- ALWAYS preserve all policies, ADRs, and conventions — ejection removes the transport, not the rules.
- NEVER leave any `factoria://` URI in the ejected output.
- ALWAYS verify the ejected project builds and tests pass independently.
- NEVER modify the MCP server or factory source during ejection — this is a project-side operation only.
- ALWAYS include the setup script so the ejected project is immediately usable.
