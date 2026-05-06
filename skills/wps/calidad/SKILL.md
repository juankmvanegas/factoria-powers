---
name: wps-calidad
description: "Auto-activated quality verification: BEM naming, block structure, coding standards"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Calidad

## Purpose

Automatically verify code quality on every change to blocks, components, and theme files. This skill enforces BEM naming conventions, correct block file structure, WordPress coding standards, and project-specific conventions. It activates without user intervention whenever code is written or modified, acting as a continuous quality gate.

## Execution Flow — 5 Strict Steps

### Step 1 — Verify File Structure

- Each block MUST have the complete set: `block.json`, `index.js`, `edit.js`, `save.js`, `style.scss`.
- Optional files: `view.js`, `editor.scss`, `render.php`.
- Components MUST follow Atomic Design: `components/atoms/`, `components/molecules/`, `components/organisms/`.
- Each component folder MUST contain: `{ComponentName}.js`, `{ComponentName}.scss`, `index.js` (re-export).

### Step 2 — Verify BEM Naming

- CSS classes MUST follow BEM: `.block__element--modifier`.
- Block-level class: `.wp-block-theme-{block-name}`.
- Elements: `.wp-block-theme-{block-name}__title`, `__content`, `__image`, etc.
- Modifiers: `.wp-block-theme-{block-name}--large`, `--highlighted`, etc.
- NEVER use camelCase, PascalCase, or generic class names (`.container`, `.wrapper`) in SCSS.

### Step 3 — Verify Coding Standards

- JavaScript: ES6+ syntax, functional components, hooks-only (no class components).
- SCSS: No `!important` unless overriding WordPress core. Variables for colors and spacing.
- PHP: WordPress Coding Standards — `snake_case` functions, prefixed with theme slug.
- Imports: Use `@wordpress/*` packages, never import React directly.
- i18n: All user-facing strings wrapped in `__()` or `_x()` with the theme text domain.

### Step 4 — Verify Block Compliance

- `block.json` has `apiVersion: 3`.
- All attributes defined in `block.json` (not inline).
- `useBlockProps()` present in edit, `useBlockProps.save()` present in save.
- `supports.html` set to `false`.
- No inline styles in save output — all styling via SCSS.

### Step 5 — Report

- List all violations found, grouped by file.
- Classify each as `ERROR` (must fix) or `WARNING` (should fix).
- Provide the specific line or pattern violating the rule.
- If zero violations: confirm "Quality check passed".

## Rules

- NEVER allow a block without `block.json` — it is the single source of truth.
- NEVER allow camelCase CSS class names — enforce BEM strictly.
- ALWAYS check for `useBlockProps` in every edit and save file.
- NEVER allow `!important` in SCSS without a documented justification comment.
- ALWAYS verify i18n wrapping for user-facing strings.
- NEVER allow class components — functional components with hooks only.
- ALWAYS report violations immediately — do not defer or batch across sessions.
