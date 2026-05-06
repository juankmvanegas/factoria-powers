---
name: python-skill-creator
description: "Use when a new reusable skill needs to be proposed and created for the current factory"
---

---
name: skill-creator
description: "Create new custom skills with SKILL.md frontmatter and register in CLAUDE.md"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new custom skills for the Factoria-Python ecosystem. Interviews the user about the skill's purpose, generates the SKILL.md with proper frontmatter and sections, and registers it in the project's CLAUDE.md.

## When to Use

- When the user needs a reusable workflow that doesn't exist yet
- When a repeated task should be formalized into a skill
- When extending the Factoria-Python skill catalog for project-specific needs

## Execution Flow — 6 Strict Steps

1. **Interview the user** — Gather skill requirements:
   - What is the skill's name? (kebab-case)
   - What does it do? (one-sentence description)
   - When should it be triggered? (user-invocable vs auto-activated)
   - What tools does it need? (Read, Write, Edit, Grep, Glob, Bash)
   - What are the main execution steps?
   - What are the safety rules?

2. **Check for conflicts** — Scan existing skills in `.claude/skills/`:
   - Verify the name doesn't conflict with existing skills
   - Check if a similar skill already exists that could be extended instead
   - If conflict found, suggest alternatives to the user

3. **Generate SKILL.md** — Create `.claude/skills/{skill-name}/SKILL.md` with:
   - Frontmatter: name, description, allowed-tools, user-invocable
   - Purpose section: what the skill accomplishes
   - When to Use section: trigger conditions
   - Execution Flow: numbered strict steps
   - Auto-Shielding: safety boundaries
   - Rules: invariant constraints

4. **Register in CLAUDE.md** — Update the project's `CLAUDE.md`:
   - Add the skill to the available skills list
   - Include a one-line description
   - Specify trigger conditions

5. **Create associated command (optional)** — If the skill is user-invocable:
   - Create `.claude/commands/{skill-name}.md` as a command alias
   - The command loads and executes the skill

6. **Verify** — Confirm:
   - SKILL.md has valid frontmatter (parseable YAML)
   - All referenced tools are in the allowed-tools list
   - The skill is discoverable by the DocRegistry

## Auto-Shielding

- NEVER create skills that bypass security policies
- NEVER create skills with `allowed-tools` broader than needed
- ALWAYS verify the skill name is unique
- ALWAYS include Auto-Shielding section in generated skills

## Rules

- Skill names MUST be kebab-case
- Every skill MUST have at least one Auto-Shielding rule
- Every skill MUST have at least one Rule
- Auto-activated skills (`user-invocable: false`) MUST document their trigger conditions
- Skills that modify code MUST include validation steps
- The allowed-tools list should be minimal — only include what's actually needed
