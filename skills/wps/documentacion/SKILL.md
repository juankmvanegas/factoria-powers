---
name: wps-documentacion
description: "Auto-activated: update CHANGELOG, block docs, architecture after code changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Documentacion

## Purpose

Automatically keep project documentation in sync with code changes. Whenever blocks, components, or architecture are modified, this skill updates the CHANGELOG, block-specific documentation, component docs, and architecture references. Ensures documentation never drifts from implementation, reducing onboarding friction and preventing stale docs.

## Execution Flow — 5 Strict Steps

### Step 1 — Detect What Changed

- Identify changed files from the current operation context.
- Classify changes: new block, modified block, new component, modified component, config change, architecture change.
- Determine affected documentation targets.

### Step 2 — Update CHANGELOG

- Read `CHANGELOG.md` at project root (create with template if missing).
- Follow Keep a Changelog format: `Added`, `Changed`, `Fixed`, `Removed`.
- Add entry under the `[Unreleased]` section at the top.
- Include the block/component name and a one-line summary of the change.
- NEVER overwrite existing entries.

### Step 3 — Update Block Documentation

- For new blocks: create `blocks/src/{blockName}/README.md` with:
  - Block name, description, category.
  - Attributes table (name, type, default, description).
  - Usage example (block markup).
  - Screenshot placeholder.
- For modified blocks: update the attributes table and usage examples if attributes changed.

### Step 4 — Update Component Documentation

- For new components: create `components/{level}/{ComponentName}/README.md` with:
  - Component name, level (atom/molecule/organism).
  - Props table (name, type, required, default, description).
  - Usage example (JSX snippet).
- For modified components: update props table if props changed.

### Step 5 — Update Architecture References

- If an ADR was created or modified: update `docs/architecture-overview.md` (or create it).
- If theme.json was modified: note the change in the architecture overview.
- If a new post type or taxonomy was added: update `docs/data-model.md` (or create it).
- If build config changed: update `docs/build-guide.md` (or create it).

## Rules

- NEVER delete existing CHANGELOG entries — only append.
- ALWAYS use Keep a Changelog format for CHANGELOG.md.
- NEVER leave a new block or component without a README.md.
- ALWAYS include an attributes/props table in block/component docs.
- NEVER let documentation reference removed or renamed blocks/components.
- ALWAYS update docs in the same operation as the code change — defer is not allowed.
- NEVER add implementation details in user-facing docs — keep them concise and usage-focused.
