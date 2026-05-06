---
name: wps-update-architecture
description: "Update architecture documentation after project changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Update Architecture

## Purpose
Update `.cloud/architecture/current.md` and related architecture documents to reflect project changes (new blocks, components, ADRs, CPTs).

## Execution Flow — 4 Strict Steps

### Step 1: Scan Changes
1. Identify new or modified blocks in `blocks/src/`
2. Identify new components in `blocks/components/`
3. Check for new CPTs or taxonomies in `functions.php`
4. Check for new or modified ADRs

### Step 2: Update Architecture State
1. Update block inventory in `current.md`
2. Update component library list
3. Update architecture diagram if structure changed
4. Update ADR list

### Step 3: Update Related Docs
1. Update `CLAUDE.md` block categories if new categories emerge
2. Update `README.md` with new block counts
3. Update theme.json documentation if settings changed

### Step 4: Validate
1. Verify all blocks listed in current.md exist in blocks/src/
2. Verify all ADRs listed exist in decisions/
3. Report changes made

## Rules
- **NEVER** document blocks that do not exist
- **ALWAYS** keep block counts accurate
- **ALWAYS** update the architecture diagram when structure changes
