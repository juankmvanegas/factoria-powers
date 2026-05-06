---
name: nest-skill-creator
description: "Use when a new reusable skill needs to be proposed and created for the current factory"
---

---
name: skill-creator
description: "Create new custom skills for the NestJS BFF factory"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new custom skills when repetitive patterns are detected or when the user requests a new reusable workflow.

## Execution Flow

1. Interview: skill name, purpose, activation conditions, execution steps
2. Determine if user-invocable or auto-activated
3. Generate skill file at `.claude/skills/[name]/SKILL.md`
4. If user-invocable, generate command at `.claude/commands/[name].md`
5. Update CLAUDE.md skills table
6. Test the skill by running it once

## Rules

- NEVER create a skill without user approval
- Follow the frontmatter format (name, description, allowed-tools, user-invocable)
- Skills must be specific to NestJS BFF context
