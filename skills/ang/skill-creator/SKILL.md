---
name: ang-skill-creator
description: "Use when a new reusable skill needs to be proposed and created for the current factory"
---

---
name: skill-creator
description: "Create new skills to extend Factoria-Ang"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new skills when a repetitive pattern is detected that deserves automation.

## Flow

1. Define skill name, purpose, and trigger
2. Create directory in `.claude/skills/{name}/`
3. Generate `SKILL.md` with V4 format (YAML frontmatter + markdown)
4. Register in `CLAUDE.md` (skills table)
5. Create command in `.claude/commands/` if user-invocable

## Template

```markdown
---
name: {name}
description: "{description}"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: {true|false}
---

# Skill: {Name}

## Purpose
{description}

## Execution Flow
{steps}

## Rules
{rules}
```

## Rules

- NEVER create without user approval
- ALWAYS follow V4 format
- ALWAYS register in CLAUDE.md
- ALWAYS write skill files in English
