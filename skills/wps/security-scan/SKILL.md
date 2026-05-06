---
name: wps-security-scan
description: "Auto-activated: check esc_html, nonces, sanitize_*, wp_kses, $wpdb->prepare, no hardcoded secrets, no innerHTML with user data"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan

## Purpose

Automatically scan WordPress block theme code for security vulnerabilities following OWASP Top 10 and WordPress-specific security best practices. This skill activates on PHP and JavaScript file changes to detect missing escaping, sanitization, nonce verification, SQL injection vectors, and hardcoded secrets.

## Execution Flow — 8 Strict Steps

### Step 1 — Identify Files to Scan

- Collect all changed or newly created PHP and JS/JSX/TSX files.
- Include: `functions.php`, `src/blocks/**/*.php`, `src/blocks/**/*.js`, `patterns/*.php`, `inc/**/*.php`, custom REST API files.
- Exclude: `node_modules/`, `vendor/`, `build/`, test files (scan separately in Step 7).

### Step 2 — Output Escaping Audit (PHP)

- Grep for `echo`, `print`, `printf`, `vprintf`, `_e(`, `__(` without wrapping escaping function.
- Verify every output uses one of: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_textarea()`, `esc_js()`, `wp_kses()`, `wp_kses_post()`, `wp_kses_data()`.
- Check `_e()` and `__()` are wrapped in escape functions when output directly.
- Flag: `echo $variable` without escaping → CRITICAL.
- Flag: `echo get_option(...)` without escaping → CRITICAL.

### Step 3 — Input Sanitization Audit (PHP)

- Grep for `$_GET`, `$_POST`, `$_REQUEST`, `$_SERVER`, `$_COOKIE`, `$_FILES`.
- Verify each superglobal access is wrapped in: `sanitize_text_field()`, `absint()`, `sanitize_email()`, `sanitize_url()`, `sanitize_file_name()`, `wp_unslash()`, or appropriate sanitize function.
- Check `register_rest_route` callback arguments use `sanitize_callback` and `validate_callback`.
- Flag: raw superglobal usage → CRITICAL.

### Step 4 — Nonce Verification Audit

- For every form found (`<form`), verify `wp_nonce_field()` is present.
- For every form handler, verify `wp_verify_nonce()` or `check_admin_referer()`.
- For every AJAX handler (`wp_ajax_*`, `wp_ajax_nopriv_*`), verify `check_ajax_referer()`.
- For every REST API endpoint, verify `permission_callback` is not `__return_true` (unless intentionally public).
- Flag: form without nonce → HIGH.
- Flag: AJAX handler without nonce check → CRITICAL.
- Flag: REST endpoint with `__return_true` permission → WARNING (verify intent).

### Step 5 — SQL Injection Audit

- Grep for `$wpdb->query(`, `$wpdb->get_results(`, `$wpdb->get_var(`, `$wpdb->get_row(`, `$wpdb->get_col(`.
- Verify every direct database call uses `$wpdb->prepare()`.
- Check that `$wpdb->prepare()` placeholders (`%s`, `%d`, `%f`) are used correctly.
- Flag: `$wpdb->query("SELECT ... WHERE id = $id")` → CRITICAL (SQL injection).
- Flag: string concatenation in SQL queries → CRITICAL.

### Step 6 — Secrets and Credentials Audit

- Grep for patterns: API keys, tokens, passwords, secrets in PHP and JS files.
- Check for: hardcoded `define('DB_PASSWORD'`, `Authorization: Bearer`, `api_key =`, `secret =`.
- Verify `.env` or `wp-config.php` credentials are not committed.
- Check JS bundles for embedded API keys or tokens.
- Flag: hardcoded secret → CRITICAL.
- Flag: credentials in version control → CRITICAL.

### Step 7 — JavaScript/React Security Audit

- Grep for `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`.
- Verify no user-supplied data flows into `dangerouslySetInnerHTML`.
- Check block `save()` functions for XSS vectors (user attributes rendered without escaping).
- Verify `RawHTML` component usage is intentional and safe.
- Check `useBlockProps` usage does not inject unsanitized attributes.
- Verify `wp.escapeHtml` is used for dynamic content in React components.
- Flag: `dangerouslySetInnerHTML` with user data → CRITICAL.
- Flag: `innerHTML` assignment with variable data → HIGH.

### Step 8 — Generate Security Report

- Compile all findings into a structured report:
  - **CRITICAL:** Must fix before merge. Sorted by severity.
  - **HIGH:** Should fix before merge. Security best practice violations.
  - **WARNING:** Review and confirm intentional. Non-standard patterns.
  - **INFO:** Suggestions for hardening.
- Each finding includes: file, line number, violation description, remediation example.
- If no issues found, report clean scan with timestamp.

## Rules

- NEVER ignore CRITICAL findings — they must all be resolved.
- NEVER approve code with raw `$_GET`/`$_POST`/`$_REQUEST` without sanitization.
- NEVER approve `$wpdb->query()` without `$wpdb->prepare()`.
- ALWAYS check both PHP and JS files — WordPress themes are full-stack.
- NEVER flag WordPress core functions as unsafe (e.g., `get_the_title()` already escapes).
- ALWAYS distinguish between block `edit()` (editor-only, less risk) and `save()` (frontend, higher risk).
- ALWAYS check REST API endpoints for proper `permission_callback`.
- NEVER trust `esc_html` on URLs — it must be `esc_url`.
- ALWAYS report the specific line number and remediation for each finding.
