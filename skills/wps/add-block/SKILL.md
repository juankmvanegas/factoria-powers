---
name: wps-add-block
description: "Scaffold a new Gutenberg block with full file structure, registration, and build config"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Block

## Purpose

Scaffold a complete Gutenberg block following WordPress block theme conventions. Creates the 7 required files (block.json, index.js, edit.js, save.js, view.js, editor.scss, style.scss), registers the block in functions.php, and ensures build scripts are configured in blocks/package.json. The result is a block ready to develop, build, and use in the editor.

## Execution Flow — 7 Strict Steps

### Step 1 — Validate Input

- Require `blockName` (kebab-case, e.g. `hero-banner`).
- Require `blockTitle` (human-readable, e.g. "Hero Banner").
- Optional: `category` (default: `theme`), `icon` (default: `block-default`), `description`.
- Confirm the block does not already exist in `blocks/src/{blockName}/`.

### Step 2 — Create block.json

- Path: `blocks/src/{blockName}/block.json`.
- Set `apiVersion: 3`, `name: theme/{blockName}`, `title`, `category`, `icon`, `description`.
- Define `editorScript`, `editorStyle`, `style`, `viewScript` file references.
- Add empty `attributes` object and `supports` with `html: false`.

### Step 3 — Create index.js

- Path: `blocks/src/{blockName}/index.js`.
- Import `registerBlockType` from `@wordpress/blocks`.
- Import `metadata` from `./block.json`.
- Import `Edit` from `./edit`.
- Import `save` from `./save`.
- Call `registerBlockType(metadata.name, { edit: Edit, save })`.

### Step 4 — Create edit.js

- Path: `blocks/src/{blockName}/edit.js`.
- Import `useBlockProps` from `@wordpress/block-editor`.
- Import `__` from `@wordpress/i18n`.
- Export default `Edit` functional component returning a `div` with `useBlockProps()`.

### Step 5 — Create save.js

- Path: `blocks/src/{blockName}/save.js`.
- Import `useBlockProps` from `@wordpress/block-editor`.
- Export default `save` function returning markup with `useBlockProps.save()`.

### Step 6 — Create view.js, editor.scss, style.scss

- `view.js`: Frontend-only JavaScript (DOM ready wrapper, empty by default).
- `editor.scss`: Editor-specific styles scoped to `.wp-block-theme-{blockName}`.
- `style.scss`: Front+editor shared styles scoped to `.wp-block-theme-{blockName}`.

### Step 7 — Register and Configure Build

- Add block registration in `functions.php` using `register_block_type(__DIR__ . '/blocks/build/{blockName}')` inside the existing `init` action hook.
- If no entry exists in `blocks/package.json` scripts for the block, ensure the build config covers `src/{blockName}`.
- Run `npm run build` (or verify build config uses wildcard) to confirm the block compiles.

## Rules

- NEVER create a block without `block.json` — it is the single source of truth for block metadata.
- NEVER use `registerBlockType` with inline metadata — always import from `block.json`.
- ALWAYS use `apiVersion: 3` for new blocks.
- ALWAYS use `useBlockProps` in both edit and save — omitting it breaks editor integration.
- ALWAYS scope SCSS to `.wp-block-theme-{blockName}` to prevent style leakage.
- NEVER add jQuery or vanilla DOM manipulation in `edit.js` — use React hooks.
- ALWAYS validate that the block name follows the `theme/{kebab-case}` convention.
- NEVER skip the build verification step.
