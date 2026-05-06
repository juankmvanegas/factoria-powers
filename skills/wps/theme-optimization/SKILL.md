---
name: wps-theme-optimization
description: "Auto-activated for theme.json edits, style.css changes, template optimization, asset enqueuing"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Theme Optimization

## Purpose

Automatically analyze and optimize WordPress block theme performance when theme.json, style.css, templates, or asset enqueuing code is modified. This skill ensures optimal loading performance, minimal CSS/JS footprint, correct use of theme.json capabilities over manual CSS, and efficient template rendering.

## Execution Flow — 7 Strict Steps

### Step 1 — Detect Change Type

- Identify which files were modified: `theme.json`, `style.css`, `templates/*.html`, `parts/*.html`, `functions.php` (enqueue functions).
- Categorize the optimization scope:
  - **theme.json change:** Validate settings efficiency, check for redundant CSS.
  - **style.css change:** Check if styles could be in theme.json instead.
  - **Template change:** Optimize block nesting, reduce query blocks.
  - **Asset enqueue change:** Verify conditional loading, dequeue unused assets.

### Step 2 — Optimize theme.json Configuration

- Check for CSS custom properties that could replace hardcoded values.
- Verify `appearanceTools` is enabled to reduce manual CSS.
- Check that color palette, font sizes, and spacing are used consistently (no duplicates).
- Verify `settings.layout.contentSize` and `wideSize` are defined (prevents layout issues).
- Check for unused color palette entries or font sizes.
- Ensure `settings.custom` is used sparingly — prefer standard settings.

### Step 3 — Audit CSS Efficiency

- Check `style.css` for styles that duplicate theme.json capabilities:
  - Colors that match palette entries but use hardcoded hex values.
  - Font sizes that match theme.json presets but use hardcoded px/rem values.
  - Spacing values that could use theme.json spacing scale.
  - Layout widths that should reference contentSize/wideSize.
- Flag `!important` usage — almost always avoidable with proper specificity.
- Check for unused CSS selectors (if tooling available).
- Recommend moving styles to theme.json where possible.

### Step 4 — Optimize Template Rendering

- Check templates for excessive block nesting (more than 5 levels deep).
- Identify query-loop blocks that could benefit from pagination or limited results.
- Check for duplicate template-part references in a single template.
- Verify `<!-- wp:group -->` blocks have a purpose (layout, styling) — remove empty wrappers.
- Check for inline styles on blocks that should use theme.json presets or block styles.

### Step 5 — Optimize Asset Loading

- Audit `wp_enqueue_script` and `wp_enqueue_style` calls:
  - Verify conditional loading (only enqueue where needed, not globally).
  - Check for scripts loaded in footer (`$in_footer = true`).
  - Verify `wp_enqueue_block_style` is used for block-specific styles.
  - Check for render-blocking scripts that could be deferred.
- Verify no duplicate asset registrations.
- Check for jQuery dependency when not needed.
- Verify `wp_dequeue_style` is used to remove unused plugin styles on specific templates.

### Step 6 — Check Font Loading Optimization

- Verify fonts are loaded via theme.json `settings.typography.fontFamilies` (not inline @font-face or Google Fonts CDN link).
- Check for font-display settings (should be `swap` or `optional`).
- Verify only used font weights and styles are loaded.
- Check for font preloading if critical fonts are identified.
- Flag loading more than 4 font files — suggest subsetting or reducing variants.

### Step 7 — Generate Optimization Report

- Compile findings into categories:
  - **Performance:** Assets, loading order, render blocking.
  - **Maintainability:** theme.json utilization, CSS reduction.
  - **Best Practices:** WordPress recommended patterns.
- Each finding includes:
  - Current state (what was found).
  - Recommended change (specific code modification).
  - Impact (performance gain, maintainability improvement).
- Prioritize findings: HIGH impact first.

## Rules

- NEVER suggest removing styles without verifying they are unused.
- ALWAYS prefer theme.json over manual CSS for colors, typography, and spacing.
- NEVER add `!important` as a fix — resolve specificity issues properly.
- ALWAYS verify font loading uses theme.json mechanism in WordPress 6.x+.
- NEVER suggest loading all assets globally — always prefer conditional enqueuing.
- ALWAYS check that `wp_enqueue_block_style` is used instead of global style enqueue for block styles.
- NEVER optimize templates that would break block editor compatibility.
- ALWAYS verify appearance tools are enabled before suggesting manual CSS removal.
- NEVER remove `style.css` theme header comment — it is required by WordPress.
