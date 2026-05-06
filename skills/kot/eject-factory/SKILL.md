---
name: kot-eject-factory
description: "Export Factoria configuration as standalone local files"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Eject Factory — Export to Standalone

## Purpose

Export all Factoria configuration (skills, agents, policies, ADRs) as local files so the project can operate without connection to the MCP server.

## Process

1. Create `.factory/` structure in the project
2. Copy all configuration files:
   - `.factory/skills/` — All skills
   - `.factory/agents/` — All agents
   - `.factory/policies/` — All policies
   - `.factory/adrs/` — All ADRs
   - `.factory/PRPs/` — PRP template
3. Generate standalone `CLAUDE.md` that does not depend on MCP
4. Update internal references to use local paths

## Output Structure

```
proyecto/
  .factory/
    skills/
      add-feature/SKILL.md
      security-scan/SKILL.md
      ...
    agents/
      orchestrator-agent.md
      execution-agent.md
      ...
    policies/
      security-policy.md
      testing-policy.md
      coding-standards.md
    adrs/
      ADR-001-*.md
      ADR-002-*.md
      ...
    PRPs/
      prp-base.md
  CLAUDE.md  ← Updated for local references
```

## Warnings

Show to the user before executing:

```
⚠️ WARNING: Eject Factory
   
   Upon executing eject, the project will:
   - Be DISCONNECTED from central updates
   - Not receive new skills, policies, or ADRs automatically
   - Need to maintain its configuration manually
   
   Recommended only for:
   - Projects that need to work offline
   - Legacy projects that will not update
   
   Continue? (y/n)
```

## Post-Eject

After eject:
1. Remove MCP configuration from `.vscode/mcp.json` or `.claude/settings.local.json`
2. Update `CLAUDE.md` to remove references to MCP tools
3. Document in README that the project is in standalone mode
