---
name: wps-wordpress-core
description: "Auto-activated for PHP: hooks, filters, register_post_type, wp_enqueue, wp_nonce, REST API, sanitization"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: WordPress Core

## Purpose

Automatically validate WordPress core API usage in PHP files, ensuring correct implementation of hooks, filters, custom post types, asset enqueuing, nonce handling, REST API registration, and data sanitization. This skill activates whenever PHP files are created or modified in the block theme project.

## Execution Flow — 9 Strict Steps

### Step 1 — Analyze PHP File Context

- Determine the file's role: `functions.php`, block render callback, REST API controller, pattern file, template function, plugin integration.
- Load the project's coding standards from `.cloud/policies/coding-standards.md`.
- Identify which WordPress APIs are being used in the file.

### Step 2 — Validate Hook Usage

- For each `add_action` call:
  - Verify the hook name is a valid WordPress hook (core or documented custom hook).
  - Verify the callback function exists.
  - Verify priority and accepted_args parameters are correct types (int).
  - Check for common mistakes: wrong hook for the context (e.g., `init` vs `after_setup_theme`).
- For each `add_filter` call:
  - Verify the filter callback returns a value (filters must return).
  - Verify the return type matches what WordPress expects for that filter.
- Flag: `add_filter` callback without return statement → HIGH.
- Flag: hook registered at wrong lifecycle point → MEDIUM.

### Step 3 — Validate Custom Post Type Registration

- For each `register_post_type` call:
  - Verify it runs on the `init` hook.
  - Verify required args: `labels`, `public`, `show_in_rest`, `supports`.
  - Verify `rest_base` is set for REST-exposed CPTs.
  - Verify capabilities are defined or capability_type is set.
  - Verify `has_archive` is explicitly set (true or false).
  - Verify `rewrite` slug is set for SEO-friendly URLs.
- For each `register_taxonomy` call:
  - Verify it runs on the `init` hook.
  - Verify `show_in_rest` for Gutenberg editor support.
  - Verify `object_type` parameter connects to the correct post type(s).
- Flag: CPT without `show_in_rest` in a block theme → HIGH (blocks won't work).

### Step 4 — Validate Asset Enqueuing

- For each `wp_enqueue_script` call:
  - Verify it runs on `wp_enqueue_scripts` (frontend) or `admin_enqueue_scripts` (admin) hook.
  - Verify `$deps` array lists actual dependencies (not empty when importing wp packages).
  - Verify `$in_footer` is true for non-critical scripts.
  - Verify `$ver` parameter uses `filemtime()` or theme version (not false for cache busting).
- For each `wp_enqueue_style` call:
  - Verify it runs on the appropriate enqueue hook.
  - Verify `$deps` are correct.
  - Verify `$media` parameter is set appropriately (all, screen, print).
- For block-specific styles:
  - Verify `wp_enqueue_block_style` is used instead of global enqueue.
  - Verify block handle matches the registered block name.
- Flag: enqueue outside of proper hook → CRITICAL.
- Flag: jQuery dependency when not needed → MEDIUM.

### Step 5 — Validate Nonce Implementation

- For each form processing function:
  - Verify `wp_nonce_field($action, $name)` in the form rendering.
  - Verify `wp_verify_nonce($_POST[$name], $action)` in the handler.
  - Verify nonce action strings are unique and descriptive.
- For each AJAX handler:
  - Verify `check_ajax_referer($action, $nonce_key)`.
- Verify nonce names don't use generic strings like 'nonce' or 'security'.
- Flag: form without nonce → CRITICAL.
- Flag: nonce check with wrong action string → CRITICAL.

### Step 6 — Validate REST API Implementation

- For each `register_rest_route` call:
  - Verify namespace format: `{plugin-or-theme}/v{N}`.
  - Verify `methods` uses `WP_REST_Server` constants (`READABLE`, `CREATABLE`, `EDITABLE`, `DELETABLE`).
  - Verify `callback` function exists and returns `WP_REST_Response` or `WP_Error`.
  - Verify `permission_callback` is defined and not `__return_true` for mutation routes.
  - Verify `args` define `sanitize_callback` and `validate_callback`.
- For register_rest_field:
  - Verify `get_callback`, `update_callback`, and `schema` are defined.
  - Verify `update_callback` includes permission checks.
- Flag: REST route without permission_callback → CRITICAL.

### Step 7 — Validate Data Sanitization and Escaping

- Input sanitization (data coming IN):
  - `sanitize_text_field()` for text inputs.
  - `absint()` for integers.
  - `sanitize_email()` for email addresses.
  - `sanitize_url()` / `esc_url_raw()` for URLs stored in database.
  - `sanitize_file_name()` for file names.
  - `wp_kses()` / `wp_kses_post()` for HTML content.
- Output escaping (data going OUT):
  - `esc_html()` for HTML content.
  - `esc_attr()` for HTML attributes.
  - `esc_url()` for URL href values.
  - `esc_textarea()` for textarea content.
  - `esc_js()` for inline JavaScript.
- Flag: wrong escaping function for context (e.g., `esc_html` on a URL) → HIGH.

### Step 8 — Validate WordPress Coding Standards

- Function naming: `snake_case` with theme/plugin prefix.
- Class naming: `PascalCase` with namespace.
- File naming: `class-{name}.php` for classes, `{name}.php` for functions.
- PHP DocBlocks: `@param`, `@return`, `@since` tags on public functions.
- Text domain: all user-facing strings wrapped in `__()`, `_e()`, `esc_html__()`, etc. with correct text domain.
- No PHP short tags (`<?` instead of `<?php`).
- No closing PHP tag `?>` at end of file.

### Step 9 — Generate Core API Audit Report

- Compile findings by category:
  - **Hooks & Filters:** Correct usage, lifecycle placement, return values.
  - **CPT & Taxonomy:** Registration completeness, REST readiness.
  - **Asset Loading:** Enqueue correctness, performance, dependencies.
  - **Nonces:** Coverage, action string correctness.
  - **REST API:** Route registration, permissions, schemas.
  - **Sanitization & Escaping:** Input/output coverage, function correctness.
  - **Coding Standards:** Naming, documentation, text domain.
- Each finding: file, line, issue, severity, fix suggestion.

## Rules

- NEVER approve PHP that uses `extract()` — it creates variables from untrusted data.
- NEVER approve direct `$_GET`/`$_POST`/`$_REQUEST` usage without sanitization.
- ALWAYS verify `register_post_type` includes `show_in_rest` for block themes.
- NEVER approve `eval()`, `create_function()`, or `call_user_func` with user input.
- ALWAYS verify enqueue calls are inside the correct WordPress hook.
- NEVER approve `wp_enqueue_script` with `false` as version when cache busting is needed.
- ALWAYS verify filter callbacks return the filtered value.
- NEVER approve direct database queries without `$wpdb->prepare()`.
- ALWAYS verify text domain matches the theme's declared text domain.
- NEVER approve `file_get_contents()` for remote URLs — use `wp_remote_get()`.
