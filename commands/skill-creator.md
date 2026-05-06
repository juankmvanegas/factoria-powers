# /skill-creator

Creates a new skill with SKILL.md and optional command file.

## What it does
Scaffolds a new skill following the Factoria conventions, registers it in CLAUDE.md, and optionally creates a command file.

## Instructions
1. Interview the user about the skill's purpose, triggers, and behavior
2. Create `.claude/skills/{name}/SKILL.md` with proper frontmatter
3. If user-invocable, create `.claude/commands/{name}.md`
4. Register the skill in the appropriate CLAUDE.md table
5. Report the new skill's location and activation rules

## Usage
```
/skill-creator [skill name]
```
