---
name: next-skill-creator
description: "Use when a new reusable skill needs to be proposed and created for the current factory"
---

---
name: skill-creator
description: "Create new custom skills for Factoria-Next"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new custom skills for Factoria-Next. Conducts an interview to capture the skill's purpose, activation mode, and behavior, then generates the SKILL.md file and optional command file. Updates the factory CLAUDE.md to register the new skill.

## Execution Flow — 5 Steps

### Step 1: Interview

Ask the user the following questions:

1. **Skill name** — kebab-case identifier (e.g., `generate-sitemap`)
2. **Purpose** — one-sentence description of what the skill does
3. **User-invocable?** — can the user call it with `/skill-name`? (true/false)
4. **Auto-activated?** — does it trigger automatically on certain conditions? (true/false)
5. **Activation triggers** — if auto-activated, when does it fire? (e.g., "when pages are created")
6. **Allowed tools** — which tools does it need? (Read, Write, Edit, Grep, Glob, Bash)
7. **Key rules** — any NEVER/ALWAYS constraints specific to this skill

### Step 2: Generate SKILL.md

Create `.claude/skills/{skill-name}/SKILL.md` with:

```yaml
---
name: {skill-name}
description: "{purpose}"
allowed-tools: {tools}
user-invocable: {true/false}
---
```

Include sections: Purpose, Execution Flow (numbered steps), Rules (NEVER/ALWAYS).

If auto-activated, include: "Activates automatically when" and "Does NOT activate when" sections.

### Step 3: Generate Command (if user-invocable)

If `user-invocable: true`, create `.claude/commands/{skill-name}.md`:

```markdown
# /{skill-name}

## What it does
{purpose}

## Instructions
Run the skill `{skill-name}` following its SKILL.md definition.

## Usage
/{skill-name} [optional arguments]
```

### Step 4: Update CLAUDE.md

Add the new skill to the appropriate table in `CLAUDE.md`:
- If user-invocable → add to "User-Invocable" skills table
- If auto-activated → add to "Auto-Activated" skills table

### Step 5: Confirmation

```
Skill Created
═════════════
  Name: {skill-name}
  Type: {user-invocable / auto-activated}
  Files:
    ✅ .claude/skills/{skill-name}/SKILL.md
    ✅ .claude/commands/{skill-name}.md (if applicable)
    ✅ CLAUDE.md updated

  Test it with: /{skill-name}
```

## Rules

- NEVER create a skill without completing the interview
- NEVER overwrite an existing skill — warn the user and ask for confirmation
- ALWAYS follow the SKILL.md frontmatter format (name, description, allowed-tools, user-invocable)
- ALWAYS include NEVER/ALWAYS rules in the generated skill
- ALWAYS register the skill in CLAUDE.md
- If the skill needs auto-activation, ALWAYS define both "activates when" and "does NOT activate when"
