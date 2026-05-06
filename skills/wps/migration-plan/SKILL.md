---
name: wps-migration-plan
description: "Plan migration from classic WordPress theme to block theme with FSE"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Analyze an existing classic WordPress theme and produce a comprehensive migration plan to a modern block theme with Full Site Editing (FSE). The plan covers template conversion, widget-to-block mapping, customizer-to-theme.json migration, and a phased execution roadmap with risk assessment.

## Execution Flow — 7 Strict Steps

### Step 1 — Discover Classic Theme Structure

- Scan the existing theme for `header.php`, `footer.php`, `sidebar.php`, `page.php`, `single.php`, `archive.php`, `index.php`, `functions.php`.
- Identify all template files, template parts, and custom page templates.
- List all `get_template_part()` calls and their dependencies.

### Step 2 — Inventory Customizer Settings

- Grep for `$wp_customize->add_setting`, `$wp_customize->add_section`, `$wp_customize->add_control`.
- Map each customizer setting to its equivalent `theme.json` property or Global Styles mechanism.
- Flag settings that have no direct FSE equivalent and require custom blocks or patterns.

### Step 3 — Map Widgets to Blocks

- List all registered widget areas (`register_sidebar`) and active widgets.
- Map each widget to its block equivalent (e.g., `WP_Widget_Recent_Posts` → `core/latest-posts`).
- Identify custom widgets that need custom block implementations.

### Step 4 — Analyze Template Hierarchy

- Document the full WordPress template hierarchy in use.
- Map each classic template to its block template equivalent in `templates/` directory.
- Identify template parts that map to `parts/` directory (header, footer, sidebar).

### Step 5 — Assess PHP Logic Dependencies

- Grep for `functions.php` hooks: `add_action`, `add_filter`, `wp_enqueue_script`, `wp_enqueue_style`.
- Categorize each hook as: migrable to theme.json, migrable to block pattern, must remain in functions.php, or removable.
- Identify plugin dependencies and their block-readiness.

### Step 6 — Generate Phased Migration Roadmap

- Phase 1: Setup block theme scaffold (theme.json, templates/, parts/).
- Phase 2: Migrate header and footer template parts.
- Phase 3: Convert page templates one by one.
- Phase 4: Replace customizer with Global Styles / theme.json.
- Phase 5: Convert widgets to blocks and create block patterns.
- Phase 6: Migrate remaining PHP logic and cleanup.
- Each phase includes: scope, estimated complexity, dependencies, rollback strategy.

### Step 7 — Output Migration Plan Document

- Write the plan to `.cloud/architecture/decisions/` as an ADR if it represents an architectural decision.
- Write the detailed plan to a markdown file in the project root or docs directory.
- Include risk matrix: high/medium/low for each phase.

## Rules

- NEVER modify the existing classic theme during the planning phase.
- NEVER assume a widget has a 1:1 block equivalent without verification.
- ALWAYS check WordPress core block list before proposing custom blocks.
- ALWAYS include rollback strategy for each migration phase.
- ALWAYS preserve SEO-critical markup (heading hierarchy, schema, meta) in the migration plan.
- NEVER plan removal of `functions.php` hooks that are required by active plugins.
- ALWAYS document breaking changes and their mitigation strategies.
