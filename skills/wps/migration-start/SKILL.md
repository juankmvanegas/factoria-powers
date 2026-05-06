---
name: wps-migration-start
description: "Start migration workflow: discovery → plan → execute → validate"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Orchestrate the full migration workflow from a classic WordPress theme to a block theme with FSE. This skill coordinates the discovery, planning, execution, and validation phases, delegating to specialized skills where appropriate and maintaining a migration state file for tracking progress.

## Execution Flow — 8 Strict Steps

### Step 1 — Initialize Migration State

- Create `.migration/state.json` with structure: `{ phase, status, startedAt, steps: [], errors: [], rollbackPoints: [] }`.
- Set initial phase to `discovery`.
- Verify the source theme exists and is a valid WordPress theme (has `style.css` with theme header).

### Step 2 — Run Discovery Phase

- Execute the `migration-plan` skill to analyze the existing theme.
- Store discovery results in `.migration/discovery.json`.
- Catalog: templates, template parts, widgets, customizer settings, enqueued assets, PHP hooks.
- Update migration state to `discovery-complete`.

### Step 3 — Generate Execution Plan

- From discovery data, generate a step-by-step execution plan with ordering constraints.
- Each step includes: action, source file, target file, transformation type, dependencies.
- Write plan to `.migration/execution-plan.json`.
- Update migration state to `planned`.

### Step 4 — Create Block Theme Scaffold

- Generate `theme.json` with settings migrated from customizer + `style.css`.
- Create `templates/` directory with empty block template files.
- Create `parts/` directory for header, footer, and identified template parts.
- Setup `package.json` with `@wordpress/scripts` if custom blocks are needed.
- Update migration state to `scaffold-ready`.

### Step 5 — Execute Template Migrations

- For each template in the execution plan, in dependency order:
  - Convert PHP template to block markup (HTML comments + Gutenberg blocks).
  - Preserve all dynamic content via appropriate blocks (`core/post-title`, `core/post-content`, `core/query-loop`, etc.).
  - Map `get_template_part()` calls to `<!-- wp:template-part -->` blocks.
- After each template, run validation: parse block markup, verify no orphaned PHP.
- Create rollback point after each successful template migration.

### Step 6 — Migrate Styles and Assets

- Convert inline styles and CSS to `theme.json` settings and styles where possible.
- Move remaining styles to `style.css` or block-specific stylesheets.
- Convert `wp_enqueue_script`/`wp_enqueue_style` calls to use `theme.json` asset loading or keep in `functions.php` where necessary.
- Migrate Google Fonts and custom fonts to `theme.json` typography settings.

### Step 7 — Validate Migration

- Run `smoke-tests` skill against the migrated theme.
- Verify all templates render without PHP errors.
- Check that `theme.json` is valid JSON and follows the WordPress schema.
- Verify block markup parses correctly (no invalid block comments).
- Compare visual output of key pages (if screenshot tooling available).
- Update migration state to `validated` or `validation-failed`.

### Step 8 — Generate Migration Report

- Compile final report: what was migrated, what was skipped, what needs manual review.
- List any remaining `functions.php` hooks and why they were kept.
- Document new block patterns created during migration.
- Write report to `.migration/report.md`.
- Update migration state to `complete`.

## Rules

- NEVER skip the discovery phase — always analyze before executing.
- NEVER execute migration steps out of dependency order.
- ALWAYS create a rollback point before each destructive operation.
- ALWAYS validate block markup after each template conversion.
- NEVER delete the original classic theme files until migration is fully validated.
- ALWAYS update the migration state file after each step.
- NEVER proceed past a failed validation without explicit user approval.
- ALWAYS preserve `functions.php` hooks that are required by plugins or custom functionality.
