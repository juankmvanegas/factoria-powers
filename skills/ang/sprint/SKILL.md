---
name: ang-sprint
description: "Use when planning or executing a sprint — multiple features or tasks to be implemented in sequence"
---

---
name: sprint
description: "Quick Angular task without formal planning"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute quick tasks that affect 1-3 files without needing a PRP.

## When to use

- Bug fix
- CSS style adjustment
- Add a field to a component
- Fix a typo
- Adjust a pipe or directive

## Flow

1. Understand the task
2. Read affected files
3. Implement change
4. Verify: `ng build` without errors
5. If it is production code, invoke `/generate-tests`
6. Invoke `/documentacion` for CHANGELOG if applicable

## Auto-Shielding

If there are errors, maximum 3 attempts before escalating.

## Rules

- Only for tasks that affect 1-3 files
- If complexity grows, pivot to `/prp` + `/bucle-agentico`
- ALWAYS respect Clean Architecture even for small changes
