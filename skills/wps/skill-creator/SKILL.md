---
name: wps-skill-creator
description: "Create new factory skills following standard format"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Skill Creator

## Purpose

Create new factory skills for the WordPress block theme factory following the standard SKILL.md format. This skill ensures consistency across all factory skills by enforcing the correct frontmatter, section structure, and content guidelines.

## Execution Flow — 5 Strict Steps

### Step 1 — Gather Skill Parameters

- Collect: skill name (kebab-case), one-line description, user-invocable (true/false).
- Determine the skill's purpose: what problem does it solve, when is it activated, what does it produce.
- Identify the tools the skill needs: Read, Write, Edit, Grep, Glob, Bash (subset or all).
- If `user-invocable: false`, document the auto-activation trigger (file patterns, events).

### Step 2 — Validate Skill Uniqueness

- Glob `.claude/skills/*/SKILL.md` to list all existing skills.
- Verify the proposed skill name does not conflict with an existing skill.
- Verify the skill's purpose does not fully overlap with an existing skill.
- If overlap exists, recommend extending the existing skill or clearly document the boundary between them.

### Step 3 — Generate SKILL.md Content

- Frontmatter:
  ```yaml
  ---
  name: {skill-name}
  description: "{One-line description}"
  allowed-tools: {tools list}
  user-invocable: {true|false}
  ---
  ```
- Sections in order:
  1. `# Skill: {Skill Name}` — Title matching the frontmatter name (Title Case).
  2. `## Purpose` — 2-3 sentences describing what the skill does and why.
  3. `## Execution Flow — N Strict Steps` — Numbered steps with `### Step N — Title` format.
  4. `## Rules` — Bullet list of NEVER/ALWAYS constraints.
- Each step must include:
  - Clear action description.
  - Specific file paths or glob patterns where applicable.
  - Validation criteria or expected output.

### Step 4 — Write Skill File

- Create directory `.claude/skills/{skill-name}/`.
- Write `SKILL.md` with the generated content.
- Verify the file is valid Markdown with correct YAML frontmatter.

### Step 5 — Verify Integration

- Confirm the skill appears in the factory's skill inventory (glob check).
- If the skill has an associated command: create `.claude/commands/{skill-name}.md` linking to the skill.
- Update any relevant documentation that lists available skills.

## Rules

- NEVER create a skill without the standard frontmatter (name, description, allowed-tools, user-invocable).
- ALWAYS use kebab-case for skill directory names.
- ALWAYS include at least 3 rules in the Rules section.
- NEVER create a skill that duplicates an existing skill's functionality without clear differentiation.
- ALWAYS include `## Purpose`, `## Execution Flow`, and `## Rules` sections in that order.
- NEVER omit step numbers — each step must be explicitly numbered.
- ALWAYS write skill content in English.
- NEVER create empty or placeholder steps — each step must have actionable content.
