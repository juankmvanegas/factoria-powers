---
name: wps-health-check
description: "Full diagnostic: build check, block registration, theme.json validation, test coverage, dependencies, security scan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Purpose

Run a comprehensive health diagnostic on the WordPress block theme project. Checks build integrity, block registration completeness, theme.json validity, test coverage, dependency health, and security posture. Produces a pass/fail report for each category with actionable remediation steps for any failures.

## Execution Flow — 8 Strict Steps

### Step 1 — Build Check

- Run `npm run build` and capture exit code and output.
- Report `PASS` if exit code is 0, `FAIL` with error details otherwise.
- Check for deprecation warnings in build output.
- Verify output files exist in `blocks/build/` for every block in `blocks/src/`.

### Step 2 — Block Registration Check

- Scan `blocks/src/*/block.json` for all defined blocks.
- Scan `functions.php` for `register_block_type` calls.
- Compare: every block in `src/` must have a registration call.
- Flag any orphan registrations (registered but source missing) or unregistered blocks.

### Step 3 — Theme.json Validation

- Read `theme.json` and validate:
  - `$schema` is present and correct.
  - `version` is `3`.
  - `settings.color.palette` entries all have `slug`, `color`, `name`.
  - `settings.typography.fontFamilies` entries are complete.
  - `customTemplates` and `templateParts` reference files that exist.
- Report any invalid entries.

### Step 4 — Test Coverage

- Run `npm test -- --coverage` if coverage is configured.
- Parse coverage report: statements, branches, functions, lines.
- Compare against testing policy minimum thresholds.
- List files with 0% coverage.

### Step 5 — Dependency Health

- Run `npm audit` and capture vulnerability count by severity (critical, high, moderate, low).
- Check for outdated `@wordpress/*` packages.
- Flag duplicate dependencies in the tree.
- Check that `@wordpress/scripts` version is current.

### Step 6 — Security Scan

- Scan PHP files for:
  - `echo` without escaping (`esc_html`, `esc_attr`, `wp_kses`).
  - `$_GET`, `$_POST`, `$_REQUEST` without `sanitize_*` or `wp_verify_nonce`.
  - Direct SQL without `$wpdb->prepare()`.
  - `eval()`, `exec()`, `shell_exec()`, `system()`.
- Scan JavaScript files for:
  - `dangerouslySetInnerHTML` usage.
  - `innerHTML` direct assignment.
  - External URL fetches without validation.

### Step 7 — File Structure Check

- Verify block file completeness: each block has block.json, index.js, edit.js, save.js, style.scss.
- Verify component structure: each component has .js, .scss, index.js.
- Verify required project files exist: functions.php, style.css, theme.json, CHANGELOG.md.

### Step 8 — Generate Health Report

- Output structured report:
  ```
  # Health Check Report — {date}

  | Check              | Status | Details         |
  |--------------------|--------|-----------------|
  | Build              | ✅/❌  | {summary}       |
  | Block Registration | ✅/❌  | {N/M registered}|
  | Theme.json         | ✅/❌  | {summary}       |
  | Test Coverage      | ✅/❌  | {N%}            |
  | Dependencies       | ✅/❌  | {N vulns}       |
  | Security           | ✅/❌  | {N issues}      |
  | File Structure     | ✅/❌  | {summary}       |
  ```
- Save to `.cloud/reports/health-check-{date}.md`.
- List critical items that need immediate attention.

## Rules

- NEVER modify code during the health check — this is a read-only diagnostic.
- ALWAYS run the actual build and tests — do not infer from file existence alone.
- ALWAYS save the report for historical comparison.
- NEVER ignore security findings — all are reported regardless of severity.
- ALWAYS include remediation steps for each failing check.
- NEVER mark a check as PASS if any sub-check within it failed.
