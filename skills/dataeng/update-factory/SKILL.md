---
name: dataeng-update-factory
description: "Update Factoria when a new version is available"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Factory

## Purpose

Update the Factoria installation in the project when a new version is available. Merge new skills, policies, and patterns while predata pipeline the project's custom modifications.

## Execution Flow

### Step 1: Identify Current Version

1. Read the current Factoria version in the project (if there is a version marker)
2. List current skills in `.claude/skills/`
3. Read current `CLAUDE.md`
4. Identify custom modifications (files the team has changed)

### Step 2: Obtain Updates

1. The user must provide the update source:
   - Path to the new Factoria version
   - Or indicate what changes to apply manually
2. Compare current vs new skill structure
3. Identify:
   - New skills (do not exist locally)
   - Updated skills (exist but changed)
   - Removed skills (exist locally but not in the new version)
   - Changed policies in CLAUDE.md

### Step 3: Classify Changes

For each changed file:

- **No conflict**: The local file was not modified → update directly
- **With conflict**: The local file was modified → manual merge needed
- **New**: Does not exist locally → add directly
- **Removed**: Exists locally but not in new version → confirm with user

### Step 4: Apply Updates

#### New Skills
1. Copy the complete skill directory
2. Add entry in CLAUDE.md if it has a skills table

#### Updated Skills (no conflict)
1. Replace the SKILL.md file
2. Update scripts if any

#### Updated Skills (with conflict)
1. Show differences to the user
2. Propose merge
3. Wait for user confirmation
4. Apply confirmed merge

#### Updated Policies
1. Show changes in CLAUDE.md
2. Propose merge predata pipeline custom sections
3. Wait for confirmation

### Step 5: Verification

1. Verify all skills have valid SKILL.md
2. Verify CLAUDE.md references all skills
3. Verify no custom modifications were lost
4. List summary of applied changes

## Rules

- NEVER overwrite custom modifications without user confirmation
- NEVER delete skills without explicit confirmation
- ALWAYS back up files before modifying them (copy to .bak temporarily)
- ALWAYS show differences before applying conflicting merges
- ALWAYS verify integrity after the update
- If there are doubts about a merge, ask the user
- Preserve any custom skills the team has created
