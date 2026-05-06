---
name: kot-skill-creator
description: "Create a new custom skill for the project"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill Creator — Create New Skill

## Purpose

Generate the structure of a new skill with its SKILL.md and register it in the project.

## Interview

Ask the user:

1. **Skill name**
   - In kebab-case (e.g., `my-new-skill`)

2. **Short description**
   - 1 line that appears in the frontmatter

3. **Is it user-invocable?**
   - `true` → the user can call it directly
   - `false` → it activates automatically by other skills

4. **Purpose**
   - What problem does it solve?

5. **When to use**
   - Activation conditions

6. **Required inputs**
   - What information does it need?

7. **Expected output**
   - What does it produce?

8. **Rules**
   - Constraints and validations

9. **Process**
   - Steps to follow

## SKILL.md Template

```markdown
---
name: kot-{name}
description: "{short description}"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: {true|false}
---

# Skill: {Name in Title Case}

## Purpose
{Detailed purpose}

## When to Use
{Activation conditions}

## Inputs Required
1. {Input 1}
2. {Input 2}

## Output
{Output description}

## Rules
1. {Rule 1}
2. {Rule 2}

## Process
1. {Step 1}
2. {Step 2}
```

## Output

1. Create directory `.claude/skills/{name}/`
2. Create `SKILL.md` inside
3. Update documentation if applicable

## Post-Creation

- Verify the skill follows the standard format
- Test manual invocation (if user-invocable: true)
- Document in the project README if it is an important skill
