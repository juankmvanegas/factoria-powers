# /primer

Loads full project context into the agent's memory.

## What it does
Reads CLAUDE.md, ADRs, policies, architecture docs, and project structure so the agent understands the project before working.

## Instructions
1. Read the main `CLAUDE.md` for project rules and conventions
2. Scan `.cloud/architecture/decisions/` for all ADRs
3. Scan `.cloud/policies/` for all policies
4. Analyze the current project structure and identify existing entities, services, and features
5. Report a summary of the project state to the user

## Usage
```
/primer
```
