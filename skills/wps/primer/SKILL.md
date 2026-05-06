---
name: wps-primer
description: "Load project context: block inventory, component library, theme config, ADRs, policies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Purpose

Load and display the complete project context for a WordPress block theme, including block inventory, component library, theme.json configuration, ADRs, policies, and conventions. This provides the foundation for all subsequent operations within the project.

## Execution Flow — 6 Strict Steps

### Step 1 — Load Factory Configuration

- Read `CLAUDE.md` from the project root.
- Read `.cloud/policies/*.md` (security-policy, testing-policy, coding-standards).
- Read `.cloud/architecture/decisions/ADR-*.md` — list all active ADRs.
- Summarize factory configuration: work mode, conventions, architecture pattern.

### Step 2 — Analyze theme.json

- Read and parse `theme.json` from the project root.
- Extract: schema version, settings (color palette, typography, spacing, layout), styles, custom templates, template parts.
- Report any deviations from the factory's expected configuration.
- Check `theme.json` against WordPress schema for validity.

### Step 3 — Inventory Custom Blocks

- Glob `src/blocks/*/block.json` to find all custom blocks.
- For each block: extract name, title, category, description, attributes, supports, parent (if any).
- Check `build/blocks/*/` to verify which blocks have been compiled.
- Cross-reference with `functions.php` to verify registration.
- Report: total blocks, registered blocks, unbuilt blocks, block dependencies.

### Step 4 — Inventory Component Library

- Glob `src/components/atoms/*/index.js`, `src/components/molecules/*/index.js`, `src/components/organisms/*/index.js`.
- List all components by Atomic Design tier.
- Check for unused components (not imported anywhere).
- Report: total components per tier, dependency graph.

### Step 5 — Inventory Templates and Patterns

- List all files in `templates/` — map to WordPress template hierarchy.
- List all files in `parts/` — identify template parts.
- List all files in `patterns/` — extract pattern metadata (title, categories, keywords).
- Identify any custom templates registered in `theme.json`.
- Report: template coverage, missing common templates, pattern count.

### Step 6 — Generate Context Summary

- Output a structured summary covering:
  - Project metadata (theme name, version, WordPress version requirement).
  - Architecture: layers, patterns, ADR decisions in effect.
  - Block inventory with status.
  - Component library structure.
  - Template and pattern coverage.
  - Active policies and their key rules.
  - Build status (last build, any errors).
  - Identified gaps or issues.

## Rules

- NEVER modify any project files during primer — this is read-only.
- ALWAYS read theme.json before analyzing blocks (blocks may reference theme.json settings).
- ALWAYS report blocks that exist in `src/` but not in `build/` as "unbuilt".
- NEVER skip reading policies and ADRs — they inform all subsequent decisions.
- ALWAYS include the WordPress version requirement from `style.css` or `theme.json` in the summary.
- ALWAYS flag if `functions.php` is missing or empty.
