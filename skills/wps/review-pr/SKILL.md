---
name: wps-review-pr
description: "Review PR against security-policy, coding-standards, testing-policy, ADRs, architecture boundaries"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Purpose

Perform a comprehensive code review of a pull request against the WordPress factory's security policy, coding standards, testing policy, ADRs, and architecture boundaries. The review produces a structured assessment with a clear verdict (APPROVE / DO NOT APPROVE) following the factory's standard review format.

## Execution Flow — 7 Strict Steps

### Step 1 — Load Review Criteria

- Read `.cloud/policies/security-policy.md`.
- Read `.cloud/policies/coding-standards.md`.
- Read `.cloud/policies/testing-policy.md`.
- Read all ADRs from `.cloud/architecture/decisions/ADR-*.md`.
- Load `CLAUDE.md` for project-specific conventions.

### Step 2 — Analyze PR Diff

- Get the list of changed files from the PR diff.
- Categorize changes by area: blocks, components, templates, patterns, theme.json, functions.php, REST API, tests, documentation.
- Identify the scope: new feature, bug fix, refactor, dependency update, configuration change.

### Step 3 — Security Policy Validation

- For each PHP file in the diff:
  - Verify all output is escaped (`esc_html`, `esc_attr`, `esc_url`, `wp_kses`, `wp_kses_post`).
  - Verify nonce usage on forms and AJAX handlers (`wp_nonce_field`, `wp_verify_nonce`, `check_ajax_referer`).
  - Verify all input is sanitized (`sanitize_text_field`, `absint`, `sanitize_email`, etc.).
  - Verify `$wpdb->prepare()` is used for all direct database queries.
  - Check for hardcoded secrets, API keys, or credentials.
- For each JS/React file:
  - Verify no `dangerouslySetInnerHTML` or `innerHTML` with user-supplied data.
  - Verify `wp.escapeHtml` or equivalent is used for dynamic content.
  - Check for XSS vectors in block `save()` functions.
- Flag each violation as BLOCKER with specific line reference.

### Step 4 — Coding Standards Validation

- Verify file naming conventions (kebab-case for blocks, components).
- Verify PHP coding standards: WordPress Coding Standards compliance.
- Verify JS/React standards: ESLint rules, import order, component structure.
- Verify CSS/SCSS standards: BEM naming (if used), no `!important`, theme.json alignment.
- Check Atomic Design boundaries: atoms don't import organisms, molecules don't import templates.
- Verify block.json metadata is complete and accurate.
- Verify theme.json changes follow schema and don't break existing styles.

### Step 5 — ADR Compliance Check

- For each active ADR, verify the PR changes don't violate the decision.
- Common ADR checks:
  - Block architecture patterns (registration, render callbacks, attributes).
  - Component hierarchy (Atomic Design layers).
  - State management approach.
  - API integration patterns.
  - Error handling conventions.
- Flag violations as BLOCKER with ADR reference.

### Step 6 — Testing Policy Validation

- Verify new blocks have render tests.
- Verify new components have unit tests.
- Verify new REST API endpoints have integration tests.
- Check test coverage doesn't decrease.
- Verify test naming conventions.
- If tests are missing, classify as BLOCKER or OBSERVATION based on the testing policy's minimum requirements.

### Step 7 — Generate Review Assessment

- Produce the final assessment following the factory review format:
  - **Verdict:** APPROVE or DO NOT APPROVE.
  - **Short reason:** One-line summary.
  - **Change summary:** What the PR does and what it impacts.
  - **Technical validation:** Architecture, security, correctness, resilience, tests.
  - **Blocking issues:** Listed with file and line references.
  - **Non-blocking observations:** Improvements and suggestions.
  - **Conclusion:** Final recommendation.

## Rules

- NEVER approve a PR with security policy violations (escaping, sanitization, nonces).
- NEVER approve a PR that introduces `$wpdb->query()` without `$wpdb->prepare()`.
- ALWAYS check theme.json changes against the WordPress schema.
- ALWAYS verify block.json `apiVersion` matches project standard.
- NEVER approve a PR that breaks the Atomic Design component hierarchy.
- ALWAYS reference specific policy sections and ADR numbers in findings.
- NEVER invent rules — only apply rules from loaded policies and ADRs.
- ALWAYS use the factory's standard review output format for the final assessment.
