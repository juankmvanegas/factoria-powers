---
name: swf-update-factory
description: "Update factory documentation and skills after project evolution — sync CLAUDE.md, policies, ADRs"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Update the Factoria-Swf factory documentation and skills after the project evolves. Syncs `CLAUDE.md` configuration, policies, ADRs, and skill definitions to match the current state of the codebase and development practices.

## Execution Flow — 6 Strict Steps

### Step 1: Scan Current Project State

1. Read current `CLAUDE.md` and extract documented stack, rules, conventions
2. Scan `Package.swift` files for actual dependencies and modules
3. List actual skills in `.claude/skills/`
4. List actual commands in `.claude/commands/`
5. List actual ADRs and policies in `.cloud/`

### Step 2: Detect Drift

Compare documented state with actual state:

| Check | Drift? |
|-------|--------|
| Stack versions (Swift, iOS target) | Compare CLAUDE.md vs Package.swift |
| Listed modules | Compare CLAUDE.md module list vs actual SPM modules |
| Listed skills | Compare CLAUDE.md skill list vs actual skills/ directory |
| Listed commands | Compare CLAUDE.md command list vs actual commands/ directory |
| Third-party dependencies | Compare Golden Path vs actual Package.swift deps |
| ADR references | Compare referenced ADRs vs actual ADR files |

### Step 3: Update CLAUDE.md

For each drift detected:
1. Update the Technology Stack section with current versions
2. Update the module list with new/removed modules
3. Update the skill list with new/removed skills
4. Update the command list with new/removed commands
5. Update the Golden Path with current dependencies

### Step 4: Update Policies

1. Check if new patterns have emerged that need policy coverage
2. Update `security-policy.md` if new security-sensitive areas added
3. Update `testing-policy.md` if new test patterns or thresholds changed
4. Update `coding-standards.md` if new conventions adopted

### Step 5: Update Skills

1. Identify skills that reference outdated patterns
2. Update skill execution flows if architecture patterns changed
3. Add new skills if new capabilities are needed
4. Deprecate skills for removed features

### Step 6: Generate Update Report

```markdown
# Factory Update Report — [Date]

## CLAUDE.md Changes
- [List of updates made]

## Policy Changes
- [List of policy updates]

## Skill Changes
- [List of skill updates, new skills, deprecated skills]

## ADR Changes
- [New ADRs to consider, outdated ADRs to review]

## Pending Manual Actions
- [Items that need human review]
```

## Auto-Shielding

- **ABORT** if `CLAUDE.md` does not exist — not a Factoria project
- **WARN** if more than 50% of documented items are drifted — major sync needed
- **WARN** if removing documented skills — require explicit approval

## Rules

1. Never delete existing ADRs — only mark as deprecated if needed
2. CLAUDE.md updates preserve existing structure — only update drifted sections
3. New skills must follow standard SKILL.md format
4. Policy updates must be backwards-compatible
5. Always generate an update report for audit trail
6. Record `FACTORY_UPDATED` event in audit trail
7. All content in English
