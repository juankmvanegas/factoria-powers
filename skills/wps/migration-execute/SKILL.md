---
name: wps-migration-execute
description: "Execute migration: convert PHP templates to FSE HTML, shortcodes to blocks, jQuery to React"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Execute the migration of a classic WordPress theme to a block theme (Full Site Editing). Converts PHP templates to FSE HTML templates, shortcodes to Gutenberg blocks, jQuery interactions to React components, and Customizer settings to theme.json configuration. Follows the migration plan produced by the migration-discovery skill and proceeds incrementally with verification at each stage.

## Execution Flow — 8 Strict Steps

### Step 1 — Load Migration Plan

- Read `.cloud/reports/migration-discovery-*.md` to load the migration scope and priority order.
- If no discovery report exists, abort and instruct user to run `migration-discovery` first.
- Confirm the target block theme structure exists (theme.json, templates/, parts/).

### Step 2 — Convert Templates

- For each PHP template, create the FSE HTML equivalent:
  - `header.php` → `parts/header.html` using `<!-- wp:site-title -->`, `<!-- wp:navigation -->`, etc.
  - `footer.php` → `parts/footer.html` using `<!-- wp:group -->`, `<!-- wp:paragraph -->`, etc.
  - `index.php` → `templates/index.html` using `<!-- wp:template-part {"slug":"header"} -->`, `<!-- wp:query -->`, etc.
  - `single.php` → `templates/single.html` with `<!-- wp:post-title -->`, `<!-- wp:post-content -->`, etc.
  - `page.php` → `templates/page.html`.
  - `archive.php` → `templates/archive.html` with `<!-- wp:query -->` loop.
  - `404.php` → `templates/404.html`.
  - `search.php` → `templates/search.html` with `<!-- wp:search -->`.
- Preserve the visual layout and semantic structure from the original template.

### Step 3 — Convert Shortcodes to Blocks

- For each shortcode identified in discovery:
  - **Simple shortcodes**: Replace with equivalent core blocks or create a simple custom block.
  - **Medium shortcodes**: Create custom blocks with attributes matching shortcode parameters.
  - **Complex shortcodes**: Create custom blocks with InnerBlocks or ServerSideRender.
- Register each new block using the `add-block` skill.
- Provide a migration mapping table: `[shortcode_name] → wp:theme/block-name`.

### Step 4 — Convert jQuery to React

- For each jQuery interaction:
  - **Sliders/Carousels**: Create a Swiper or Splide-based block (no jQuery dependency).
  - **Modals/Popups**: Create a React component using `@wordpress/components` Modal.
  - **Tabs/Accordions**: Create blocks using `InnerBlocks` with toggle logic in view.js.
  - **AJAX calls**: Replace `$.ajax` with `@wordpress/api-fetch`.
  - **DOM manipulation**: Replace with React state and refs in the block's edit/view scripts.
- Remove jQuery enqueueing from functions.php after all conversions.

### Step 5 — Migrate Customizer to theme.json

- For each Customizer setting:
  - Color settings → `settings.color.palette` in theme.json.
  - Typography settings → `settings.typography.fontFamilies` / `fontSizes`.
  - Spacing/layout → `settings.spacing` and `settings.layout`.
  - Custom settings without theme.json equivalent → Create a custom block or block style variation.
- Remove Customizer registration code from functions.php.

### Step 6 — Migrate Widget Areas

- Convert sidebar widget areas to template parts with block widget areas.
- Replace `dynamic_sidebar()` calls with `<!-- wp:widget-area -->` or inline blocks.
- Convert custom widgets to blocks where appropriate.

### Step 7 — Clean Up Legacy Code

- Remove unused PHP template files (keep backups in `_legacy/` directory).
- Remove unused JS/CSS files from enqueue.
- Remove Customizer code from functions.php.
- Remove widget registration code.
- Update `functions.php` to add `add_theme_support('block-templates')`.
- Verify `style.css` header is present (required by WordPress).

### Step 8 — Verify Migration

- Run build: `npm run build` — must pass.
- Run tests: `npm test` — must pass.
- Verify all templates load without PHP errors.
- Verify all converted blocks are registered and functional in the editor.
- Check the site editor: verify templates and template parts appear correctly.
- Compare visual output against the original theme screenshots (if available).
- Generate migration completion report in `.cloud/reports/migration-complete-{date}.md`.

## Rules

- NEVER delete original theme files without creating a backup in `_legacy/`.
- NEVER proceed without a migration discovery report — always analyze before executing.
- ALWAYS convert one category at a time (templates, then shortcodes, then jQuery, etc.) — never all at once.
- ALWAYS verify after each category conversion before proceeding to the next.
- NEVER introduce jQuery in the block theme — all new code must be React or vanilla JS.
- ALWAYS use core blocks when they match the functionality — do not create custom blocks unnecessarily.
- NEVER leave orphan registrations — remove `register_shortcode`, `register_widget` after conversion.
- ALWAYS maintain visual parity with the original theme — migration must not change the design.
- NEVER skip the verification step — an unverified migration is an incomplete migration.
