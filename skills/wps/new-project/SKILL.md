---
name: wps-new-project
description: "Scaffold a new WordPress block theme from scratch (theme.json, functions.php, templates, parts, blocks directory, package.json)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Scaffold a complete WordPress block theme project from scratch, following Atomic Design principles, FSE best practices, and factory standards. The scaffold includes theme.json, functions.php, templates, parts, custom blocks directory, package.json with @wordpress/scripts, and the full .cloud/ architecture documentation structure.

## Execution Flow — 10 Strict Steps

### Step 1 — Gather Project Parameters

- Collect: theme name, theme slug, description, author, text domain, minimum WordPress version, minimum PHP version.
- If not provided, derive theme slug from theme name (lowercase, hyphens, no special characters).
- Set text domain to match theme slug.

### Step 2 — Create Root Theme Files

- `style.css` — Theme header comment block (Theme Name, Theme URI, Author, Description, Version, Requires at least, Tested up to, Requires PHP, License, Text Domain, Tags).
- `functions.php` — Minimal setup: `after_setup_theme` hook for theme support, block styles registration, pattern registration, asset enqueueing.
- `screenshot.png` — Placeholder (or skip with a note to add later).

### Step 3 — Generate theme.json

- Version 3 schema (`$schema: "https://schemas.wp.org/wp/6.7/theme.json"`).
- Settings: color palette, typography (font families, font sizes), spacing (units, scale), layout (content size, wide size), custom properties.
- Styles: root-level typography, color, spacing.
- Template parts definitions (header, footer, sidebar if needed).
- Custom templates definitions.
- Block-level style variations where appropriate.

### Step 4 — Create Template Structure

- `templates/index.html` — Fallback template with header part, query loop, footer part.
- `templates/single.html` — Single post template with post title, content, meta, comments.
- `templates/page.html` — Page template with content block.
- `templates/archive.html` — Archive template with query loop and pagination.
- `templates/404.html` — Not found template.
- `templates/search.html` — Search results template.
- `templates/home.html` — Blog home template (if different from index).

### Step 5 — Create Template Parts

- `parts/header.html` — Site title, navigation block, responsive layout.
- `parts/footer.html` — Footer content, site info, navigation.
- `parts/sidebar.html` — Optional sidebar with common blocks.
- `parts/comments.html` — Comments template part.

### Step 6 — Setup Custom Blocks Directory

- `src/blocks/` — Directory for custom block source files.
- Each block follows structure: `src/blocks/{block-name}/block.json`, `edit.js`, `save.js`, `style.scss`, `editor.scss`, `index.js`.
- Create one example block to establish the pattern.
- Register blocks via `register_block_type` in `functions.php` using `__DIR__ . '/build/blocks/{block-name}'`.

### Step 7 — Setup Block Patterns

- `patterns/` directory for block pattern PHP files.
- Each pattern file registers itself via the file header comment format (WP 6.0+): `Title`, `Slug`, `Categories`, `Keywords`.
- Create one example pattern (e.g., hero section, call-to-action).

### Step 8 — Configure Build Tooling

- `package.json` with `@wordpress/scripts` as dev dependency.
- Scripts: `build`, `start`, `lint:js`, `lint:css`, `test`.
- `.wp-env.json` for local development environment (optional, prompted).
- `.editorconfig` and `.gitignore` for WordPress theme development.

### Step 9 — Create Component Library Structure (Atomic Design)

- `src/components/atoms/` — Smallest UI elements (buttons, inputs, icons).
- `src/components/molecules/` — Combinations of atoms (search form, card).
- `src/components/organisms/` — Complex sections (header, footer, sidebar).
- `src/components/templates/` — Page-level compositions.
- Each component: `index.js`, `style.scss`, optional `README.md`.

### Step 10 — Initialize Architecture Documentation

- `.cloud/policies/security-policy.md` — WordPress-specific security rules.
- `.cloud/policies/testing-policy.md` — Testing requirements.
- `.cloud/policies/coding-standards.md` — Coding conventions.
- `.cloud/architecture/decisions/` — Directory for ADRs.
- `CLAUDE.md` — Factory configuration (copy from Factoria-Wps template).
- Verify all factory-required documentation is in place.

## Rules

- NEVER generate a classic theme structure — always block theme with FSE support.
- ALWAYS use theme.json v3 schema for WordPress 6.7+.
- ALWAYS include `"appearanceTools": true` in theme.json settings.
- NEVER hardcode colors or font sizes — always use theme.json presets.
- ALWAYS register blocks using the `block.json` metadata approach.
- ALWAYS use `wp_enqueue_block_style` for block-specific styles, not global enqueue.
- NEVER include jQuery as a dependency unless explicitly required by a third-party plugin.
- ALWAYS set up the text domain for internationalization support.
- ALWAYS include `.gitignore` with `/node_modules`, `/build`, `/vendor`.
- NEVER scaffold without a valid `theme.json` — it is the foundation of a block theme.
