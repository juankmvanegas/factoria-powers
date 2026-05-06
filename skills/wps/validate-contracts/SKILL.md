---
name: wps-validate-contracts
description: "Validate REST API contracts: CPT endpoints, custom endpoints, permission callbacks"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Validate WordPress REST API contracts including Custom Post Type (CPT) endpoints, custom REST routes, permission callbacks, schema definitions, and response formats. This skill ensures API endpoints follow WordPress REST API standards, implement proper authentication and authorization, and maintain backward compatibility.

## Execution Flow — 7 Strict Steps

### Step 1 — Discover REST API Endpoints

- Grep for `register_rest_route` in all PHP files to find custom endpoints.
- Grep for `register_post_type` with `'show_in_rest' => true` to find CPT endpoints.
- Grep for `register_taxonomy` with `'show_in_rest' => true` to find taxonomy endpoints.
- Grep for `register_rest_field` to find custom fields added to existing endpoints.
- Build a complete API inventory: namespace, route, methods, callback, permission_callback.

### Step 2 — Validate Permission Callbacks

- For each custom endpoint:
  - Verify `permission_callback` is defined (not omitted — WordPress 5.5+ requires it).
  - Verify `permission_callback` is not `__return_true` unless the endpoint is intentionally public.
  - Verify permission checks use `current_user_can()` with appropriate capabilities.
  - For CPT endpoints: verify `edit_posts`, `publish_posts`, `delete_posts` capabilities map correctly.
- For each public endpoint (`__return_true`):
  - Verify no sensitive data is exposed (user emails, private post meta, configuration).
  - Document the public endpoint and its justification.
- Flag: missing `permission_callback` → CRITICAL.
- Flag: `__return_true` on mutation endpoints (POST, PUT, DELETE) → CRITICAL.

### Step 3 — Validate Request Schemas

- For each endpoint that accepts input:
  - Verify `args` array defines `sanitize_callback` and `validate_callback` for each parameter.
  - Verify data types match expected input (string, integer, boolean, array, object).
  - Verify required parameters are marked as `'required' => true`.
  - Verify enum values are used where applicable (e.g., status field).
- Check that `register_rest_route` schema definitions follow JSON Schema format.
- Flag: parameters without sanitize_callback → HIGH.
- Flag: parameters without validate_callback → MEDIUM.

### Step 4 — Validate Response Formats

- For each endpoint callback:
  - Verify the response uses `WP_REST_Response` or `rest_ensure_response()`.
  - Verify error responses use `WP_Error` with appropriate HTTP status codes.
  - Verify response data is structured consistently (same shape for same resource type).
  - Check that response includes `_links` for HATEOAS where appropriate.
- For CPT endpoints:
  - Verify `rest_prepare_{post_type}` filter is used to customize response (not raw post objects).
  - Verify sensitive fields are removed from response.
- Flag: raw `wp_send_json` instead of `WP_REST_Response` → MEDIUM.

### Step 5 — Validate CPT REST Integration

- For each registered CPT with `show_in_rest`:
  - Verify `rest_base` is set (meaningful URL slug).
  - Verify `rest_controller_class` is specified if custom behavior is needed.
  - Verify meta fields registered with `register_post_meta` have `'show_in_rest' => true` for fields that should be exposed.
  - Verify custom meta field schemas are defined (type, description, default).
- Check that CPT capabilities map correctly to REST API permissions.
- Verify CPT supports required features: `title`, `editor`, `custom-fields` (for meta in REST).

### Step 6 — Check Backward Compatibility

- If endpoints existed in a previous version:
  - Compare current schema against previous schema (if documented).
  - Flag removed fields → BREAKING CHANGE.
  - Flag changed field types → BREAKING CHANGE.
  - Flag removed endpoints → BREAKING CHANGE.
  - New optional fields and new endpoints are backward-compatible.
- Verify versioning: namespace includes version (e.g., `myplugin/v1`).
- If breaking changes detected: document migration path.

### Step 7 — Generate Contract Validation Report

- Compile results into a structured report:
  - **Endpoint inventory:** All discovered endpoints with routes and methods.
  - **Permission audit:** Status of each endpoint's permission callback.
  - **Schema audit:** Input validation completeness for each endpoint.
  - **Response audit:** Response format compliance for each endpoint.
  - **CPT integration:** REST readiness of each custom post type.
  - **Compatibility:** Breaking changes detected (if any).
- Each finding includes: severity, endpoint, specific issue, remediation.
- Overall status: COMPLIANT / NON-COMPLIANT.

## Rules

- NEVER approve an endpoint without a `permission_callback`.
- NEVER approve a mutation endpoint (POST/PUT/DELETE) with `__return_true` permission.
- ALWAYS verify `sanitize_callback` is present on all input parameters.
- ALWAYS use `$wpdb->prepare()` in custom endpoint callbacks that query the database.
- NEVER expose user emails, passwords, or security tokens in REST API responses.
- ALWAYS verify namespace includes a version number (e.g., `v1`, `v2`).
- NEVER modify endpoint behavior during validation — this is a read-only audit.
- ALWAYS document breaking changes with specific migration instructions.
