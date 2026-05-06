---
name: swf-eject-factory
description: "Generate standalone project files independent of the MCP factory"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Generate standalone project files that don't depend on the MCP factory. Exports all policies, ADRs, skills, and configuration as local documentation that can live within the project repository. After ejection, the project operates independently without requiring the MCP server.

## Execution Flow — 5 Steps

### Step 1: Inventory

1. List all factory documents that apply to the project:
   - CLAUDE.md (factory configuration)
   - All policies from `.cloud/policies/`
   - All ADRs from `.cloud/architecture/decisions/`
   - Architecture documentation from `.cloud/architecture/current.md`
   - All skills from `.claude/skills/` and `.ai/skills/`
   - All agents from `.ai/agents/`
   - All commands from `.claude/commands/`
   - Hooks from `.claude/hooks/`
   - PRP templates from `.claude/PRPs/`
2. Verify all documents are readable and valid markdown
3. Count total documents and estimate output size

### Step 2: Generate CLAUDE.md

1. Create a standalone `CLAUDE.md` that includes:
   - Identity and golden rules (adapted from factory)
   - Technology stack table
   - Architecture rules
   - Working rules (MUST / MUST NOT)
   - References to local policy and ADR files
2. Remove any MCP server references or factory-specific paths
3. Replace factory resource URIs with relative file paths

### Step 3: Export Policies and ADRs

1. Copy all policies to `docs/policies/` in the project
2. Copy all ADRs to `docs/architecture/decisions/` in the project
3. Copy `current.md` to `docs/architecture/current.md`
4. Update all internal cross-references to use relative paths
5. Generate an index file: `docs/README.md` listing all documents

### Step 4: Export Skills as Instructions

1. Convert each skill SKILL.md to a standalone instruction file
2. Place in `docs/skills/` or `.claude/skills/` depending on user preference
3. Remove MCP-specific activation triggers
4. Maintain the skill content (Purpose, Execution Flow, Rules)
5. Generate a skills index with descriptions

### Step 5: Generate Copilot/Claude Instructions

1. Create `.github/copilot-instructions.md` with project-specific rules
2. Create `.github/instructions/` directory with instruction files:
   - Architecture instructions
   - Testing instructions
   - Security instructions
3. Create `.claude/CLAUDE.md` if using Claude Code directly
4. Ensure instructions reference local documentation paths

## Output Structure

```
project/
├── CLAUDE.md                          # Standalone factory config
├── .github/
│   ├── copilot-instructions.md        # GitHub Copilot instructions
│   └── instructions/
│       ├── architecture.instructions.md
│       ├── testing.instructions.md
│       └── security.instructions.md
├── docs/
│   ├── README.md                      # Documentation index
│   ├── policies/
│   │   ├── security-policy.md
│   │   ├── testing-policy.md
│   │   └── coding-standards.md
│   ├── architecture/
│   │   ├── current.md
│   │   └── decisions/
│   │       ├── ADR-001-*.md
│   │       └── ...
│   └── skills/
│       ├── README.md                  # Skills index
│       ├── add-feature.md
│       └── ...
└── .claude/
    └── skills/                        # Claude Code skills
        └── ...
```

## Auto-Shielding

- **ABORT** if the project already has ejected files — ask user to confirm overwrite
- **ABORT** if required factory documents are missing — cannot eject incomplete factory
- **WARN** if the project has custom local rules that may conflict with factory rules

## Rules

1. Ejected files must be self-contained — no references to MCP server or factory paths
2. Preserve all policy and ADR content exactly — do not modify rules
3. Update all cross-references to use relative local paths
4. Include a generation timestamp and factory version in ejected files
5. The ejected project must function identically without the MCP connection
6. Do not eject audit trail or session-specific data
7. User can choose which components to eject (all or selective)
