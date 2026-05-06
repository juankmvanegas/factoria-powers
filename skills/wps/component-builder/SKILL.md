---
name: wps-component-builder
description: "Build Atomic Design atoms (Button, Input, Tag) and molecules (CardBlog, CardJob, ImageSelector)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Component Builder

## Purpose

Create reusable UI components following Atomic Design methodology for use within Gutenberg blocks. Atoms are the smallest elements (Button, Input, Tag, Icon), molecules combine atoms into functional groups (CardBlog, CardJob, ImageSelector, SearchBar). Each component is self-contained with its own styles, exports, and optional tests, ready to be imported by any block.

## Execution Flow — 6 Strict Steps

### Step 1 — Classify Component Level

- Determine if the component is an **atom** (single UI element, no children components) or **molecule** (combines 2+ atoms).
- Atoms go in `components/atoms/{ComponentName}/`.
- Molecules go in `components/molecules/{ComponentName}/`.
- If a molecule depends on atoms that do not exist yet, create the atoms first.

### Step 2 — Create Component File

- Path: `components/{level}/{ComponentName}/{ComponentName}.js`.
- Use a functional component with destructured props.
- Import `__` from `@wordpress/i18n` if the component has user-facing text.
- Use `className` prop with BEM naming: base class `c-{component-name}`.
- Export as named export and as default.

### Step 3 — Create SCSS File

- Path: `components/{level}/{ComponentName}/{ComponentName}.scss`.
- Root class: `.c-{component-name}`.
- Use BEM for child elements: `.c-{component-name}__label`, `__icon`, etc.
- Use theme variables from `styles/variables.scss` for colors, spacing, typography.
- NEVER use inline styles or `!important`.

### Step 4 — Create Index Re-export

- Path: `components/{level}/{ComponentName}/index.js`.
- Re-export: `export { default } from './{ComponentName}';`
- Also export named exports if applicable.

### Step 5 — Update Component Barrel

- If `components/{level}/index.js` exists, add the new component export.
- If it does not exist, create it with exports for all components in that directory.

### Step 6 — Verify Integration

- Confirm the component can be imported from a block's edit.js: `import ComponentName from '../../components/{level}/{ComponentName}';`
- Confirm SCSS is importable or auto-loaded via the build pipeline.
- Verify no circular dependencies exist.

## Rules

- NEVER create a component without its SCSS file — every component must be styled.
- NEVER use inline styles — all styling through SCSS with BEM classes.
- ALWAYS use the `c-` prefix for component classes to distinguish from block classes (`wp-block-`).
- ALWAYS use functional components with hooks — no class components.
- NEVER import React directly — use `@wordpress/element` if explicit imports are needed.
- ALWAYS create atoms before molecules that depend on them.
- NEVER hardcode strings — use `@wordpress/i18n` for all user-facing text.
- ALWAYS provide a `className` prop to allow parent overrides.
- NEVER create a component without an index.js re-export file.
