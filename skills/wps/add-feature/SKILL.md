---
name: wps-add-feature
description: "Add a new feature following block theme architecture"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose
Implement a new feature in the WordPress block theme project following established architecture, policies, and conventions.

## Execution Flow — 6 Strict Steps

### Step 1: Load Context
1. Read `CLAUDE.md` for architecture and conventions
2. Read `.cloud/policies/coding-standards.md`
3. Read `.cloud/policies/security-policy.md`
4. Read relevant ADRs for the feature area

### Step 2: Plan
1. Identify blocks to create or modify
2. Identify components to create or reuse
3. Identify functions.php changes
4. Identify theme.json changes if needed

### Step 3: Implement
1. Create/modify block files (block.json, edit.js, save.js, view.js, SCSS)
2. Create/modify atom or molecule components
3. Update functions.php if new blocks registered
4. Update blocks/package.json with build scripts

### Step 4: Build
1. Run `cd blocks && yarn build:sc-{name}` for affected blocks
2. Verify build succeeds without errors

### Step 5: Test
1. Generate tests for new/modified code
2. Run `npm test` to verify all tests pass
3. Run `npm run test:coverage` to check coverage

### Step 6: Document
1. Update CHANGELOG
2. Update architecture docs if needed

## Auto-Shielding
After implementation, the auto-chain runs:
```
Code → security-scan → generate-tests → documentacion
```

## Rules
- **ALWAYS** follow the 7-file block structure for new blocks
- **ALWAYS** use BEM naming with sc- prefix
- **ALWAYS** register new blocks in functions.php
- **NEVER** skip the build step
- **NEVER** deliver without tests
