---
name: pytml-skill-creator
description: "Create new custom skills for Factoria"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new custom skills for Factoria. Interview the user about the skill's purpose, generate the SKILL.md with the correct YAML frontmatter format, and register it in the project.

## Execution Flow

### Step 1: Interview

Ask the user:

1. **Skill name**: In kebab-case (e.g., `generate-report`, `deploy-staging`)
2. **Purpose**: What does this skill do? (one sentence)
3. **Is it user-invocable?**: Is it activated with a slash command? (default: yes)
4. **Required tools**: What tools does it need? (Read, Write, Edit, Grep, Glob, Bash — default all)
5. **Flow steps**: What are the main steps it should follow?
6. **Rules**: Are there constraints or rules the skill must respect?
7. **Prerequisites**: Does it need anything prior to execution?
8. **Needs auxiliary scripts?**: Are there bash/powershell scripts that complement the skill?
9. **Needs reference files?**: Are there templates or reference documents?

### Step 2: Generate SKILL.md

Create the directory `.claude/skills/{skill-name}/` and generate `SKILL.md`:

```markdown
---
name: pytml-{skill-name}
description: "{brief description}"
allowed-tools: {selected tools}
user-invocable: {true/false}
---

# Skill: {Skill Name}

## Purpose

{Complete purpose description}

## Prerequisites

{List of prerequisites if any, or "None"}

## Execution Flow

### Step 1: {Step name}
{Detailed instructions}

### Step 2: {Step name}
{Detailed instructions}

...

## Rules

- {Rule 1}
- {Rule 2}
...
```

### Step 3: Auxiliary Scripts (Optional)

If the skill needs scripts:

1. Create `.claude/skills/{skill-name}/scripts/`
2. Generate the necessary scripts
3. Reference them in the SKILL.md

### Step 4: Reference Files (Optional)

If the skill needs templates or references:

1. Create `.claude/skills/{skill-name}/references/`
2. Generate the reference files
3. Reference them in the SKILL.md

### Step 5: Register in CLAUDE.md

1. Read the project's `CLAUDE.md`
2. Find the skills table (if it exists)
3. Add a new row with:
   - Skill name
   - Command (`/{skill-name}`)
   - Brief description
4. If there is no skills table, inform the user to add it manually

### Step 6: Verification

1. Verify the SKILL.md has valid YAML frontmatter
2. Verify the directory is in the correct location
3. Verify all referenced files exist
4. Confirm to the user that the skill is ready

## YAML Frontmatter Format

Valid frontmatter fields are:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Name in kebab-case |
| description | string | Yes | Brief description |
| allowed-tools | string | Yes | Comma-separated tools |
| user-invocable | boolean | Yes | Whether the user can invoke it directly |

## Rules

- NEVER create a skill without interviewing the user first
- NEVER create a skill with a duplicate name (check existing ones)
- ALWAYS use kebab-case for the skill name
- ALWAYS include valid YAML frontmatter
- ALWAYS write skill instructions in English
- ALWAYS keep YAML keys in English
- ALWAYS include a Rules section in the generated skill
- ALWAYS verify the directory structure is correct
- The SKILL.md must be self-contained — an agent should be able to execute it without additional context
- Instructions must be specific and actionable, not generic
