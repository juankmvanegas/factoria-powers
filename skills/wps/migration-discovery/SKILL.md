---
name: wps-migration-discovery
description: "Discover migration scope: classic theme analysis, shortcodes, widgets, jQuery, PHP templates"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Analyze a classic WordPress theme to determine the full scope of migration to a block theme (FSE). Inventories PHP templates, shortcodes, widgets, jQuery usage, Customizer settings, and legacy patterns. Produces a detailed migration plan with effort estimates and priority ordering, enabling informed planning before any code conversion begins.

## Execution Flow — 8 Strict Steps

### Step 1 — Template Inventory

- Scan for all PHP template files: `index.php`, `single.php`, `page.php`, `archive.php`, `search.php`, `404.php`, `header.php`, `footer.php`, `sidebar.php`.
- Scan for template parts in `template-parts/` or `partials/`.
- List page templates (files with `Template Name:` header comment).
- Count total templates and classify by type.

### Step 2 — Shortcode Analysis

- Grep for `add_shortcode()` calls to list all registered shortcodes.
- For each shortcode: identify the callback function and analyze its output.
- Classify complexity: simple (text replacement), medium (with attributes), complex (with nested content, queries).
- Note shortcodes that have direct Gutenberg block equivalents.

### Step 3 — Widget Analysis

- Grep for `register_widget()` and `register_sidebar()` calls.
- List all custom widgets and their output markup.
- Identify widget areas and their locations (header, footer, sidebar).
- Note widgets that can be replaced by block widget areas in FSE.

### Step 4 — jQuery and JavaScript Audit

- Scan all `.js` files for jQuery usage (`$()`, `jQuery()`, `$.ajax`, `.on()`, `.click()`, etc.).
- Count jQuery dependencies and categorize:
  - UI interactions (sliders, modals, tabs).
  - AJAX calls.
  - DOM manipulation.
  - Third-party jQuery plugins.
- Identify which can be replaced by React components or native browser APIs.

### Step 5 — Customizer Settings Analysis

- Grep for `$wp_customize->add_setting()` and `$wp_customize->add_control()`.
- List all Customizer sections, settings, and controls.
- Map each setting to its FSE equivalent: theme.json setting, block style variation, or custom block.
- Note settings without a clear FSE path.

### Step 6 — PHP Function and Hook Analysis

- Scan `functions.php` and `inc/` for:
  - `add_action()` and `add_filter()` hooks.
  - Custom template tags (`the_*`, `get_the_*` wrappers).
  - Direct database queries (`$wpdb`).
  - Legacy APIs (`get_option` for theme settings).
- Classify each as: keep, migrate, deprecate.

### Step 7 — Asset Analysis

- List enqueued styles and scripts (`wp_enqueue_style`, `wp_enqueue_script`).
- Identify third-party libraries (Slick, Owl, Bootstrap, etc.).
- Calculate total asset weight.
- Identify assets that can be eliminated by using block-based equivalents.

### Step 8 — Generate Migration Plan

- Output a structured report:
  ```
  # Migration Discovery Report — {source theme name}

  ## Summary
  - Templates: N (N page templates, N template parts)
  - Shortcodes: N (N simple, N medium, N complex)
  - Widgets: N (N areas, N custom widgets)
  - jQuery files: N (N can migrate, N need rewrite)
  - Customizer settings: N
  - Custom hooks: N

  ## Priority Order
  1. {highest impact, lowest effort items first}
  2. ...

  ## Effort Estimate
  | Category    | Items | Complexity | Estimate |
  |-------------|-------|------------|----------|
  | Templates   | N     | ...        | ...      |
  | Shortcodes  | N     | ...        | ...      |
  | ...         |       |            |          |

  ## Risk Areas
  - {items that may break or need special handling}
  ```
- Save to `.cloud/reports/migration-discovery-{date}.md`.

## Rules

- NEVER modify the source theme during discovery — this is a read-only analysis.
- ALWAYS scan the complete theme, not just top-level files.
- ALWAYS classify every item found — nothing should be "unknown".
- NEVER estimate effort without analyzing complexity first.
- ALWAYS identify risk areas that could block migration.
- ALWAYS save the report for reference during migration execution.
- NEVER assume jQuery can be simply dropped — analyze each usage to determine the replacement strategy.
