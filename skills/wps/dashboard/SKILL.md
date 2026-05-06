---
name: wps-dashboard
description: "Project status: block count, component count, test coverage, build status, policy compliance"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Dashboard

## Purpose

Generate a real-time project status dashboard summarizing key health metrics of the WordPress block theme. Covers block count, component count, test coverage, build status, policy compliance, and recent changes. Provides a quick at-a-glance view for project leads and developers to understand where the project stands.

## Execution Flow — 6 Strict Steps

### Step 1 — Block Metrics

- Count total blocks in `blocks/src/*/block.json`.
- Classify blocks by category (from block.json `category` field).
- Identify blocks without tests.
- Identify blocks missing required files (edit.js, save.js, style.scss).

### Step 2 — Component Metrics

- Count atoms in `components/atoms/`.
- Count molecules in `components/molecules/`.
- Count organisms in `components/organisms/` (if applicable).
- Identify components without SCSS or without tests.

### Step 3 — Test Coverage

- Run `npm test -- --coverage --coverageReporters=text-summary` if available.
- Parse coverage output: statements, branches, functions, lines percentages.
- If no coverage tool is configured, count test files vs source files as a ratio.
- Flag any block or component directory with zero test files.

### Step 4 — Build Status

- Run `npm run build` and capture exit code.
- Report: `PASS` or `FAIL` with error summary if failed.
- Check for build warnings (deprecation notices, large bundle sizes).

### Step 5 — Policy Compliance

- Check coding standards: scan for BEM violations, missing i18n, class components.
- Check security policy: scan for unsanitized output, missing escaping.
- Check testing policy: verify coverage meets minimum threshold.
- Report pass/fail per policy.

### Step 6 — Render Dashboard

- Output a formatted Markdown table:
  ```
  | Metric               | Value      | Status |
  |----------------------|------------|--------|
  | Total Blocks         | N          | ✅/⚠️  |
  | Total Components     | N (A/M/O) | ✅/⚠️  |
  | Test Coverage        | N%         | ✅/❌  |
  | Build                | PASS/FAIL  | ✅/❌  |
  | Coding Standards     | PASS/FAIL  | ✅/❌  |
  | Security Policy      | PASS/FAIL  | ✅/❌  |
  | Testing Policy       | PASS/FAIL  | ✅/❌  |
  ```
- Add a "Last updated" timestamp.
- List top 3 action items if any metric is failing.

## Rules

- NEVER modify code when generating the dashboard — this is a read-only diagnostic.
- ALWAYS run the actual build to verify status — do not assume based on file presence alone.
- ALWAYS include the timestamp so consumers know how fresh the data is.
- NEVER report coverage as 100% without actually running the coverage tool.
- ALWAYS list actionable items when any metric fails or shows warnings.
- NEVER skip policy compliance checks — they are part of the dashboard contract.
