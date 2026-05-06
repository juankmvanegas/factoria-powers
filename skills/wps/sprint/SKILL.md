---
name: wps-sprint
description: "End-to-end implementation: plan → implement → build → test → review → document"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute an end-to-end implementation cycle for a WordPress block theme feature, from planning through documentation. This skill orchestrates the full development workflow: context loading, implementation planning, coding, building, testing, self-review, and documentation updates. Use this for features that are well-defined and ready for implementation.

## Execution Flow — 9 Strict Steps

### Step 1 — Load Context (Primer)

- Execute the `primer` skill to load project context.
- Identify the current block inventory, component library, theme configuration, active ADRs, and policies.
- Verify the development environment is ready: `node_modules` exists, `package.json` scripts are available.

### Step 2 — Define Implementation Scope

- Clarify what needs to be built: new blocks, components, templates, patterns, API endpoints, theme.json changes.
- List all files to create or modify.
- Identify dependencies: WordPress core blocks needed, npm packages, PHP libraries.
- Check if a PRP exists for this feature — if so, follow its implementation plan.

### Step 3 — Create Feature Branch

- Verify current git status is clean.
- Create a feature branch: `feature/{feature-slug}` from the main branch.
- Confirm branch creation and switch.

### Step 4 — Implement Code Changes

- Follow the Atomic Design hierarchy: atoms → molecules → organisms → templates.
- For new blocks:
  - Create `src/blocks/{block-name}/block.json` with full metadata.
  - Create `src/blocks/{block-name}/edit.js` for editor component.
  - Create `src/blocks/{block-name}/save.js` for frontend output.
  - Create `src/blocks/{block-name}/style.scss` and `editor.scss`.
  - Create `src/blocks/{block-name}/index.js` entry point.
  - Register in `functions.php` if not using auto-registration.
- For new components:
  - Place in correct Atomic Design tier: `src/components/{tier}/{component-name}/`.
  - Create `index.js`, `style.scss`, and export from tier index.
- For template changes:
  - Modify `templates/*.html` or `parts/*.html` with valid block markup.
- For theme.json changes:
  - Modify settings, styles, or template definitions as needed.
  - Validate against schema after each change.

### Step 5 — Build

- Run `npm run build` to compile all blocks and assets.
- Verify build succeeds with exit code 0.
- If build fails: diagnose errors, fix, and rebuild.
- Verify build output in `build/` directory matches expected blocks.

### Step 6 — Write Tests

- For each new block: write render test verifying output markup.
- For each new component: write unit test covering props and behavior.
- For each new REST API endpoint: write integration test covering CRUD and permissions.
- For theme.json changes: write a validation test.
- Follow testing policy naming conventions and coverage requirements.

### Step 7 — Run Tests

- Execute `npm test` for JavaScript tests.
- Execute PHPUnit for PHP tests (if applicable).
- All tests must pass. If any fail:
  - Diagnose the failure.
  - Fix the code or test.
  - Re-run until all pass.
- Run `smoke-tests` skill for overall project health.

### Step 8 — Self-Review

- Execute the `security-scan` skill on all changed files.
- Verify coding standards compliance for all changed files.
- Check ADR compliance for the implemented changes.
- Verify no files were changed outside the defined scope.
- If issues are found: fix and re-verify.

### Step 9 — Document Changes

- Update architecture documentation if new blocks or components were added.
- Update block inventory or component library documentation.
- If an ADR was created or modified: ensure it is complete with all required sections.
- Commit all changes with a clear, conventional commit message.
- Summarize what was implemented, tested, and documented.

## Rules

- NEVER skip the context loading step — stale context leads to incorrect implementations.
- ALWAYS create a feature branch — never commit directly to main.
- ALWAYS build before testing — tests may depend on compiled output.
- ALWAYS run security scan before considering implementation complete.
- NEVER ignore test failures — all tests must pass before the sprint is done.
- ALWAYS follow Atomic Design hierarchy when creating components.
- NEVER modify files outside the defined implementation scope without explicit approval.
- ALWAYS use `block.json` for block registration — never inline registration.
- ALWAYS validate theme.json after any modification to it.
- NEVER leave `console.log` or debug statements in committed code.
