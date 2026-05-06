# /add-block

Create a new Gutenberg block (Pro Max) with full scaffold and registration.

## What it does

Scaffolds a complete Gutenberg block with seven files following the project's block theme conventions: block metadata, entry point, editor component with inspector controls, save component, frontend view script with dataLayer integration, and editor/frontend styles using BEM. Registers the block in `functions.php` and adds build configuration.

## Instructions

1. Ask the user for the block name (kebab-case, e.g. `hero-banner`) and its purpose.
2. Create the block directory at `blocks/src/<block-name>/`.
3. Scaffold the following 7 files:
   - `block.json` — apiVersion 3, name `theme/<block-name>`, title, category, icon, description, supports, attributes, editorScript, editorStyle, style, viewScript.
   - `index.js` — Import `./edit` and `./save`, call `registerBlockType()` with metadata from `block.json`.
   - `edit.js` — Functional component using `useBlockProps()` and `InspectorControls` from `@wordpress/block-editor`. Include attribute controls in the sidebar panel.
   - `save.js` — Functional component using `useBlockProps.save()` to render static HTML markup.
   - `view.js` — Frontend-only script with `dataLayer.push()` integration for analytics events. Runs on `DOMContentLoaded`.
   - `editor.scss` — Editor-specific styles scoped to the block selector.
   - `style.scss` — Frontend and editor shared styles using BEM naming convention (`.wp-block-theme-<block-name>`, `__element`, `--modifier`).
4. Register the block in `functions.php` by adding a `register_block_type()` call inside the block registration hook.
5. Add or verify the block's build entry in `blocks/package.json` scripts.
6. Run `cd blocks && yarn build` to compile the new block.
7. Confirm the block compiles without errors and is ready for use in the editor.

## Usage

```
/add-block <block-name>
```
