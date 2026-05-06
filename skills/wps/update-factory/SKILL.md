---
name: wps-update-factory
description: "Sync factory CLAUDE.md, policies, and skills with project evolution"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Synchronize the WordPress factory configuration (CLAUDE.md, policies, skills, agents, commands) with the current state of the project. As projects evolve, factory artifacts may drift from reality. This skill detects drift and updates factory files to reflect current conventions, tools, patterns, and architecture.

## Execution Flow — 6 Strict Steps

### Step 1 — Audit Factory vs. Project State

- Read the factory `CLAUDE.md` and extract:
  - Listed blocks, components, templates, patterns.
  - Convention rules and architectural decisions referenced.
  - Build commands and development workflow.
  - WordPress version requirements.
- Compare against actual project state:
  - Current blocks in `src/blocks/`.
  - Current components in `src/components/`.
  - Current templates in `templates/` and patterns in `patterns/`.
  - Current `package.json` scripts.
  - Current `theme.json` schema version and settings.
- Identify all drift points.

### Step 2 — Update CLAUDE.md

- Update the project structure section to reflect current directories and files.
- Update the block inventory with new/removed blocks.
- Update component library listing.
- Update build and development commands if `package.json` scripts changed.
- Update WordPress/PHP version requirements if `style.css` or `theme.json` changed.
- Preserve the existing format and sections — only update content within sections.

### Step 3 — Update Policies

- Read `.cloud/policies/security-policy.md`:
  - Verify security rules match current WordPress version capabilities.
  - Add rules for new patterns introduced (e.g., new REST endpoints, new block types).
  - Remove rules for deprecated patterns no longer in use.
- Read `.cloud/policies/coding-standards.md`:
  - Verify naming conventions match current project structure.
  - Update file structure conventions if directories changed.
  - Add standards for new technologies adopted (e.g., TypeScript, new CSS methodology).
- Read `.cloud/policies/testing-policy.md`:
  - Update coverage requirements for new block/component types.
  - Add testing patterns for new features.

### Step 4 — Update Skills

- Glob `.claude/skills/*/SKILL.md` to list all skills.
- For each skill:
  - Verify referenced file paths still exist.
  - Verify referenced commands still work.
  - Verify referenced tools are still applicable.
- Flag skills that reference non-existent paths or outdated tools.
- Update skill content minimally — only fix broken references and outdated patterns.

### Step 5 — Update Agents and Commands

- If `.ai/agents/` exists:
  - Verify agent configurations reference current project structure.
  - Update agent context paths if directories changed.
- If `.claude/commands/` exists:
  - Verify command references match current skills and project structure.
  - Update command descriptions if functionality changed.

### Step 6 — Generate Sync Report

- Output a summary of all changes made:
  - Files updated with diff summary.
  - Drift points resolved.
  - Remaining manual actions needed (if any).
- Commit the updates with message: `chore: sync factory with project state`.

## Rules

- NEVER rewrite factory files from scratch — always update incrementally.
- ALWAYS preserve the existing format and structure of CLAUDE.md.
- NEVER remove policy rules without explicit justification.
- ALWAYS verify file paths exist before adding them to factory documentation.
- NEVER update skills to reference tools or commands that don't exist in the project.
- ALWAYS run `primer` context load after updating to verify consistency.
- NEVER change ADRs during a factory sync — ADRs are changed via the `update-architecture` skill.
