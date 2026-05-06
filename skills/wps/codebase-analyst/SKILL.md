---
name: wps-codebase-analyst
description: "Deep analysis of WordPress block theme: block inventory, component usage, dependencies, technical debt"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Codebase Analyst

## Purpose

Perform a comprehensive analysis of a WordPress block theme codebase. Produces a detailed inventory of blocks, components, dependencies, build configuration, and technical debt. The output gives a complete picture of the project's current state, enabling informed decisions about new features, refactors, and migrations.

## Execution Flow — 7 Strict Steps

### Step 1 — Block Inventory

- Scan `blocks/src/*/block.json` to list all registered blocks.
- For each block: extract name, title, category, attributes count, supports, and whether it has a view script.
- Identify blocks missing required files (edit.js, save.js, style.scss).
- Count total blocks and classify by category.

### Step 2 — Component Inventory

- Scan `components/atoms/`, `components/molecules/`, `components/organisms/`.
- For each component: name, file count, whether it has tests, whether it has SCSS.
- Identify orphan components (defined but never imported in any block).
- Identify missing components (imported but not found).

### Step 3 — Dependency Analysis

- Read `package.json` and `blocks/package.json`.
- List all `@wordpress/*` dependencies and their versions.
- Identify outdated dependencies by comparing with latest stable.
- Flag any non-WordPress dependencies that duplicate WordPress packages (e.g., separate `react` install).

### Step 4 — Build Configuration

- Analyze `blocks/package.json` scripts and webpack/wp-scripts config.
- Confirm `@wordpress/scripts` is used for build.
- Verify source and output paths.
- Check for custom webpack overrides and flag them.

### Step 5 — Theme.json Analysis

- Read `theme.json` and extract: settings (colors, typography, spacing), custom templates, template parts, patterns.
- Identify unused color palette entries (defined but not referenced in any SCSS/block).
- Verify `$schema` is set and version is `3`.

### Step 6 — Technical Debt Scan

- Search for TODO, FIXME, HACK, DEPRECATED comments.
- Identify blocks using deprecated WordPress APIs.
- Find SCSS files with `!important` overrides.
- Find JavaScript files with `eslint-disable` comments.
- Check for blocks with inline styles in save output.

### Step 7 — Generate Report

- Output a structured Markdown report with sections for each step.
- Include summary statistics: total blocks, total components, total dependencies, debt score (count of issues).
- List top 5 priority items to address.
- Save report to `.cloud/reports/codebase-analysis-{date}.md`.

## Rules

- NEVER modify any code during analysis — this skill is read-only.
- ALWAYS scan the entire codebase, not just recently changed files.
- ALWAYS include file paths in findings so issues are actionable.
- NEVER report false positives — verify each finding by reading the actual file content.
- ALWAYS save the report to `.cloud/reports/` for historical tracking.
- NEVER skip the dependency analysis — outdated WordPress packages cause subtle editor bugs.
