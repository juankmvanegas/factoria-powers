---
name: writing-skills
description: Use when creating new Factoria skills, editing existing skills, or verifying skills work before deployment
---

# Writing Factoria Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the skill, watch tests pass (agents comply), and refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

## What is a Factoria Skill?

A **skill** is a reference guide for a proven Factoria workflow, pattern, or enforcement rule. Skills help the agent find and apply the correct factory-specific approach.

**Skills are:** Reusable workflows, patterns, enforcement guides, factory-specific how-tos

**Skills are NOT:** One-off solutions, project-specific conventions (put in CLAUDE.md), narratives about how you solved something once

## SKILL.md Structure

**Frontmatter (YAML):**
- `name`: factory-prefixed for factory-specific skills (`net-add-feature`), plain for cross-factory skills (`validate-compliance`)
- `description`: ONLY when to use — NEVER summarize workflow. Start with "Use when..."
- Max 1024 characters total in frontmatter

```markdown
---
name: <factory>-<skill-name>
description: Use when [specific triggering conditions only — no workflow summary]
---

# Skill Title

## Iron Law (for discipline skills)
[The non-negotiable rule]

## When to Use
[Bullets with symptoms and situations]

## Workflow / Steps
[The actual content]

## Red Flags
| Thought | Reality |
|---|---|
| [Rationalization] | [Why it's wrong] |

## Rules
- [Non-negotiable constraints]
```

## The Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Same as TDD: RED (baseline without skill) → GREEN (skill makes agent comply) → REFACTOR (close loopholes).

## Factory Skill Naming

- Factory-specific: `<factory>-<name>` in frontmatter AND in `skills/<factory>/<name>/SKILL.md`
- Cross-factory: `<name>` in frontmatter AND in `skills/<name>/SKILL.md`
- Use lowercase, hyphens only — no special chars

## CSO — Description Must Be "When to Use Only"

**NEVER summarize workflow in the description.** If the description explains WHAT the skill does, the agent shortcuts the skill body.

```yaml
# ❌ BAD: Summarizes the workflow
description: "Add a new feature following the Angular 6-step execution order"

# ✅ GOOD: When to use only
description: "Use when the user wants to add a new feature, endpoint, or component to the Angular project"
```

## Red Flags

| Excuse | Reality |
|---|---|
| "The description is clear enough" | Test it with a subagent first. |
| "I'll skip testing, it's obvious" | Obvious to you ≠ obvious to the agent under pressure. |
| "Factory skills don't need Red Flags tables" | Factory skills face the same rationalization attacks. |

## Common Mistakes

- Description contains workflow steps → will be skipped
- No Iron Law for discipline skills → agent will rationalize
- Missing factory prefix in `name` field → naming conflict
- Skill too long → add a `references/` subdir for heavy content
