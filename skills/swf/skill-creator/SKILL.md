---
name: swf-skill-creator
description: "Create new skills — interviews for name, purpose, steps, and auto-shielding rules"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new Factoria skills by interviewing the user for skill details, then generating the SKILL.md file and optionally an associated command. Ensures all new skills follow the standard format and conventions.

## Execution Flow — 5 Strict Steps

### Step 1: Interview

Collect from the user:

1. **Skill name** — kebab-case identifier (e.g., `my-new-skill`)
2. **Description** — One-line description for the YAML frontmatter
3. **Purpose** — What the skill accomplishes
4. **User-invocable** — `true` (command) or `false` (auto-activated)
5. **Activation triggers** — (if auto-activated) When does it run?
6. **Steps/Checks** — Ordered list of execution steps
7. **Auto-shielding rules** — ABORT/WARN/BLOCK conditions
8. **Key rules** — Constraints the skill must enforce

### Step 2: Validate Skill Name

1. Check the name is unique — not used by any existing skill in `.claude/skills/`
2. Check the name follows kebab-case convention
3. Check the name does not conflict with reserved names (e.g., `help`, `config`)

### Step 3: Generate SKILL.md

Create `/.claude/skills/[skill-name]/SKILL.md` with:

```yaml
---
name: swf-[skill-name]
description: "[Description]"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: [true/false]
---
```

Then markdown sections:
- `# Skill: [Skill Name]`
- `## Purpose`
- `## Execution Flow — N Strict Steps` (or `## Activation Triggers` + checks for auto-activated)
- `## Auto-Shielding`
- `## Rules`

### Step 4: Generate Associated Command (if user-invocable)

If the skill is user-invocable, create a matching command at `.claude/commands/[skill-name].md`:

```markdown
# /[skill-name]

## What it does
[Description of the command]

## Instructions
1. Load the skill from `.claude/skills/[skill-name]/SKILL.md`
2. Execute the skill's flow
3. Report results

## Usage
```
/[skill-name] [arguments]
```
```

### Step 5: Verify

1. Validate SKILL.md has all required sections
2. Verify YAML frontmatter is valid
3. Check that `allowed-tools` includes all tools the skill needs
4. Confirm the skill is referenced in CLAUDE.md skills list

## Auto-Shielding

- **ABORT** if skill name already exists
- **ABORT** if YAML frontmatter is malformed
- **WARN** if skill has no auto-shielding rules (every skill should have at least one)
- **WARN** if user-invocable skill has no associated command

## Rules

1. Every skill must have: Purpose, Execution Flow (or Activation Triggers), Auto-Shielding, Rules
2. User-invocable skills should have matching commands
3. Auto-activated skills must document their activation triggers
4. Skill names are kebab-case, lowercase, no spaces
5. Description fits in one line (used in YAML frontmatter)
6. Auto-shielding must use standard keywords: ABORT, BLOCK, WARN, PASS
7. All content in English
