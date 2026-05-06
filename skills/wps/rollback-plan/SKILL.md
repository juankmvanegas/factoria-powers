---
name: wps-rollback-plan
description: "Create rollback strategy for block changes, theme updates, database migrations"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Rollback Plan

## Purpose

Create a comprehensive rollback strategy for WordPress block theme changes, covering block modifications, theme.json updates, template changes, database migrations, and custom post type alterations. The plan ensures that any change can be safely reversed without data loss or site breakage.

## Execution Flow — 6 Strict Steps

### Step 1 — Identify Change Scope

- Analyze the current branch diff or provided feature description.
- Categorize changes:
  - **Code-only:** Block JS/PHP, component changes, template markup — git-reversible.
  - **Configuration:** theme.json, block.json, pattern metadata — git-reversible but may affect stored content.
  - **Database:** Custom post types, custom fields, options, meta — requires data migration rollback.
  - **Content:** Block markup in post_content (serialized block comments) — requires content migration.
- Assign rollback complexity: SIMPLE (git revert), MODERATE (git + config reset), COMPLEX (git + data migration).

### Step 2 — Document Current State Snapshot

- Record the current `theme.json` settings hash.
- Record the list of registered blocks (`wp block list` or grep `register_block_type`).
- Record database schema relevant to the change (custom tables, post meta keys, option keys).
- Record the current template file list and their content hashes.
- Store this snapshot in `.rollback/snapshot-{date}.json`.

### Step 3 — Create Git-Based Rollback Steps

- Identify the exact commits that comprise the change.
- Document the git revert command(s): `git revert {commit-range}` or `git reset --hard {commit}`.
- If the change spans multiple PRs, document the correct revert order (reverse chronological).
- Verify that reverting the commits produces a buildable, testable state.

### Step 4 — Create Database Rollback Scripts

- If the change introduces new custom post types: document the `unregister_post_type` procedure and content handling.
- If the change adds post meta: document the `delete_post_meta` cleanup query.
- If the change adds options: document the `delete_option` calls.
- If the change modifies existing data: create a reverse migration script in `.rollback/migrations/`.
- Each script must be idempotent — safe to run multiple times.

### Step 5 — Create Content Rollback Strategy

- If blocks are modified (attributes changed, markup altered):
  - Document the block deprecation strategy (add `deprecated` array to block.json).
  - Create a content migration script that parses `post_content` and reverts block markup.
  - Test the migration on a copy of the database first.
- If blocks are removed:
  - Document the fallback rendering (what users see if the block is no longer registered).
  - Create a search-and-replace script to convert removed blocks to a valid alternative.

### Step 6 — Output Rollback Plan Document

- Write the plan to `.rollback/plan-{feature-slug}.md`.
- Include:
  - Change summary and scope.
  - Rollback complexity rating.
  - Pre-rollback checklist (backup database, verify git state, notify team).
  - Step-by-step rollback procedure.
  - Post-rollback validation checklist.
  - Estimated data impact (posts affected, options to remove).
- Cross-reference the related PRP if one exists.

## Rules

- NEVER create a rollback plan that requires manual database edits without a script.
- ALWAYS include database backup as the first step in any rollback procedure.
- ALWAYS test rollback scripts on a staging/copy environment before documenting them as ready.
- NEVER assume `git revert` alone is sufficient when database changes are involved.
- ALWAYS document what happens to user-created content when blocks are removed or altered.
- ALWAYS make rollback scripts idempotent.
- NEVER include destructive SQL (`DROP TABLE`, `TRUNCATE`) without explicit user confirmation step.
- ALWAYS store rollback artifacts in the `.rollback/` directory.
