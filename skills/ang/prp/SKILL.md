---
name: ang-prp
description: "Use when starting any non-trivial feature — before writing any code, to produce a Product Requirements Proposal with measurable success criteria"
---

---
name: prp
description: "Plan Angular feature with PRP (Product Requirements Proposal)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP

## Purpose

Generate a Product Requirements Proposal before implementing complex features.

## Flow

1. Understand the user's requirement
2. Analyze existing code (use cases, services, affected views)
3. Generate PRP using the template in `.claude/PRPs/prp-base.md`
4. Present to the user for approval
5. If approved, proceed to `/bucle-agentico` for implementation

## Rules

- ALWAYS before features that touch multiple layers
- ALWAYS include a testing plan
- ALWAYS document routing impact
- NEVER implement without an approved PRP for complex features
