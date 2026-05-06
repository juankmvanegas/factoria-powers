---
name: wps-smoke-tests
description: "Quick validation: build all blocks, run tests, check block registration, verify theme.json"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

Run a quick validation suite to ensure the WordPress block theme is in a healthy state. This includes building all custom blocks, running the test suite, verifying block registration, validating theme.json, and checking that templates parse correctly. Use this after any significant change or before committing.

## Execution Flow — 7 Strict Steps

### Step 1 — Validate theme.json

- Read `theme.json` and verify it is valid JSON.
- Validate against the WordPress theme.json schema (`https://schemas.wp.org/wp/6.7/theme.json`).
- Check required fields: `$schema`, `version`, `settings`.
- Verify `settings.color.palette`, `settings.typography.fontSizes`, `settings.spacing` are present if the theme uses them.
- Report: PASS / FAIL with specific schema violations.

### Step 2 — Build Custom Blocks

- Run `npm run build` (or `npx wp-scripts build`).
- Check exit code: 0 = PASS, non-zero = FAIL.
- If FAIL: capture and report build errors (syntax errors, missing dependencies, TypeScript errors).
- Verify `build/` directory contains compiled output for each block in `src/blocks/`.
- Report: blocks built, blocks failed, build warnings.

### Step 3 — Verify Block Registration

- For each `src/blocks/*/block.json`:
  - Verify a corresponding `build/blocks/*/` directory exists with `index.js`.
  - Verify `block.json` has required fields: `apiVersion`, `name`, `title`, `category`, `textdomain`.
  - Verify `functions.php` or a loader file calls `register_block_type` for this block.
- Report: registered blocks, unregistered blocks, orphaned build artifacts.

### Step 4 — Validate Template Markup

- For each file in `templates/*.html` and `parts/*.html`:
  - Verify the file is not empty.
  - Verify block comments are well-formed (`<!-- wp:block-name -->...<!-- /wp:block-name -->`).
  - Check for orphaned closing tags or unclosed blocks.
  - Verify referenced template parts exist in `parts/` directory.
- Report: valid templates, invalid templates with specific errors.

### Step 5 — Validate Block Patterns

- For each file in `patterns/*.php`:
  - Verify the file header contains required fields: `Title`, `Slug`, `Categories`.
  - Verify the PHP file is syntactically valid (`php -l {file}`).
  - Check that block markup inside the pattern is well-formed.
- Report: valid patterns, invalid patterns.

### Step 6 — Run Test Suite

- Run `npm test` (or `npx wp-scripts test-unit-js`).
- If PHP tests exist: run `./vendor/bin/phpunit` or equivalent.
- Check exit code: 0 = PASS, non-zero = FAIL.
- Capture test results: total, passed, failed, skipped.
- Report: test summary with failure details if any.

### Step 7 — Generate Smoke Test Report

- Compile results from all steps into a summary:
  - `theme.json`: PASS / FAIL
  - `Build`: PASS / FAIL ({n} blocks built)
  - `Block Registration`: PASS / FAIL ({n}/{total} registered)
  - `Templates`: PASS / FAIL ({n}/{total} valid)
  - `Patterns`: PASS / FAIL ({n}/{total} valid)
  - `Tests`: PASS / FAIL ({passed}/{total} passed)
- Overall status: ALL PASS → GREEN, any FAIL → RED with details.
- If any step is RED, list specific remediation actions.

## Rules

- NEVER skip the theme.json validation — it is the foundation of the block theme.
- ALWAYS run the build before checking registration (build output may be stale).
- NEVER report a block as "registered" if its build output is missing.
- ALWAYS check template markup syntax — invalid block comments cause silent rendering failures.
- NEVER ignore build warnings — report them even when the build succeeds.
- ALWAYS run the full test suite, not a subset, during smoke testing.
- NEVER modify code during smoke tests — this is a read-and-validate-only operation (build step excepted).
