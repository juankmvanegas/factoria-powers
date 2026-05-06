---
name: wps-block-core
description: "Auto-activated block development patterns: useBlockProps, InspectorControls, RichText, block.json attributes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Block Core

## Purpose

Provide canonical patterns and guardrails for Gutenberg block development. This skill auto-activates whenever block code is being created or modified, ensuring correct usage of useBlockProps, InspectorControls, RichText, block.json attribute definitions, and save/edit component patterns. It prevents common mistakes that break the editor or cause validation errors on the frontend.

## Execution Flow — 6 Strict Steps

### Step 1 — Validate block.json Schema

- Confirm `apiVersion` is `3`.
- Confirm `name` follows `namespace/block-name` format.
- Validate all `attributes` have explicit `type` and optional `default`.
- Confirm `supports` object is present (at minimum `html: false`).
- Ensure `editorScript`, `editorStyle`, `style` paths are correct relative references.

### Step 2 — Enforce useBlockProps in edit.js

- `useBlockProps()` MUST be spread on the outermost wrapper element.
- For dynamic blocks: `useBlockProps()` returns props including `className`.
- When using `InnerBlocks`, use `useInnerBlocksProps(useBlockProps())`.
- NEVER add custom `className` that overrides `useBlockProps` — merge instead.

### Step 3 — Enforce useBlockProps.save in save.js

- `useBlockProps.save()` MUST be spread on the outermost wrapper in the save function.
- For dynamic blocks returning `null` from save: this is acceptable only if a PHP `render_callback` or `render.php` is defined.
- Attributes used in save MUST be destructured from `props.attributes`.

### Step 4 — Apply InspectorControls Pattern

- Import `InspectorControls` from `@wordpress/block-editor`.
- Place `<InspectorControls>` as a sibling (not child) of the main block wrapper inside the edit component return.
- Wrap control groups in `<PanelBody title={__('Section Title')}>`.
- Use `setAttributes()` from `props` for all control `onChange` handlers.

### Step 5 — Apply RichText Pattern

- Import `RichText` from `@wordpress/block-editor`.
- In edit: use `<RichText tagName="p" value={attr} onChange={(val) => setAttributes({attr: val})} />`.
- In save: use `<RichText.Content tagName="p" value={attr} />`.
- Define the corresponding attribute in block.json with `"type": "string"` (or `"type": "array", "source": "query"` for complex).

### Step 6 — Validate Save/Edit Parity

- Every attribute rendered in save MUST be sourced from block.json `attributes`.
- Attribute `source` and `selector` must match the save markup exactly — mismatches cause block validation errors.
- If attribute has `source: "html"`, the save markup tag must match the `selector`.
- Run mental validation: would the editor re-parse the saved HTML and recover the same attributes?

## Rules

- NEVER omit `useBlockProps()` from the edit component — the block will not be selectable.
- NEVER omit `useBlockProps.save()` from the save component — the block will fail validation.
- ALWAYS define attributes in `block.json`, never inline in `registerBlockType`.
- NEVER use `dangerouslySetInnerHTML` in save functions — it breaks block validation.
- ALWAYS use `__()` or `_x()` from `@wordpress/i18n` for user-facing strings.
- NEVER import React directly — WordPress provides it via the `@wordpress/element` dependency.
- ALWAYS use `@wordpress/scripts` for building — never configure raw webpack for blocks.
- NEVER mutate props or attributes directly — always use `setAttributes()`.
- ALWAYS test that a saved block can be re-opened in the editor without a "This block contains unexpected content" error.
