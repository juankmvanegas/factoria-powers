---
name: wps-database
description: "WordPress CPTs, taxonomies, meta fields, REST API endpoints, $wpdb queries"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Database

## Purpose

Create and manage WordPress data layer elements: Custom Post Types (CPTs), custom taxonomies, meta fields (post meta, term meta, user meta), REST API endpoint extensions, and direct `$wpdb` queries when needed. Ensures all data operations follow WordPress conventions, are properly sanitized, and are registered via hooks in the correct order.

## Execution Flow — 7 Strict Steps

### Step 1 — Define Requirements

- Clarify the data entity: CPT name (singular/plural), slug, taxonomy associations.
- Define meta fields: key, type, show_in_rest, sanitize_callback.
- Determine if REST API extensions are needed (custom endpoints or additional fields).
- Confirm naming convention: theme slug prefix for all registrations (e.g., `theme_slug_cpt_name`).

### Step 2 — Register Custom Post Type

- Create or update `inc/post-types/{cpt-slug}.php`.
- Use `register_post_type()` on the `init` hook.
- Set `show_in_rest: true` (required for Gutenberg editor support).
- Define labels array with all required entries (name, singular_name, add_new, etc.).
- Configure `supports`: typically `['title', 'editor', 'thumbnail', 'custom-fields', 'revisions']`.
- Set `template` and `template_lock` if the CPT should use specific blocks.

### Step 3 — Register Taxonomies

- Create or update `inc/taxonomies/{taxonomy-slug}.php`.
- Use `register_taxonomy()` on the `init` hook.
- Associate with the CPT via the `$object_type` parameter.
- Set `show_in_rest: true`, `hierarchical: true/false` as appropriate.
- Define labels array.

### Step 4 — Register Meta Fields

- Use `register_post_meta()` or `register_term_meta()` for each field.
- Set `show_in_rest: true` with `type` and `schema` for Gutenberg access.
- Provide `sanitize_callback` for every meta field (e.g., `sanitize_text_field`, `absint`, `esc_url_raw`).
- Provide `auth_callback` returning `current_user_can('edit_post', $post_id)`.

### Step 5 — Extend REST API (if needed)

- Use `register_rest_route()` on `rest_api_init` hook for custom endpoints.
- Define `permission_callback` — NEVER use `__return_true` for write operations.
- Validate and sanitize all input with `validate_callback` and `sanitize_callback` per argument.
- Return `WP_REST_Response` with appropriate status codes.

### Step 6 — Direct $wpdb Queries (if needed)

- Use `$wpdb->prepare()` for ALL queries with variable input — no exceptions.
- Use `$wpdb->get_results()`, `$wpdb->get_var()`, `$wpdb->get_row()` as appropriate.
- NEVER concatenate variables into SQL strings.
- For custom tables: verify table exists, use `$wpdb->prefix` for table names.

### Step 7 — Include and Verify

- Add `require_once` for new files in `functions.php`.
- Flush rewrite rules by noting that a resave of permalinks is needed (or programmatically on activation).
- Verify the CPT appears in the admin menu and REST API (`/wp-json/wp/v2/{cpt-slug}`).
- Verify meta fields are accessible in the block editor sidebar.

## Rules

- NEVER register a CPT without `show_in_rest: true` — it will not work in Gutenberg.
- NEVER use `$wpdb` without `$wpdb->prepare()` for any query with variable data.
- NEVER use `__return_true` as a `permission_callback` for write endpoints.
- ALWAYS prefix CPT names and meta keys with the theme slug to avoid collisions.
- ALWAYS provide `sanitize_callback` for every meta field registration.
- ALWAYS set `auth_callback` for meta fields to enforce capabilities.
- NEVER create custom database tables unless `wp_postmeta` / `wp_termmeta` are genuinely insufficient.
- ALWAYS escape output with `esc_html()`, `esc_attr()`, `esc_url()` when rendering meta values.
