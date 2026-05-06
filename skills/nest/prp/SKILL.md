---
name: nest-prp
description: "Use when starting any non-trivial feature — before writing any code, to produce a Product Requirements Proposal with measurable success criteria"
---

---
name: prp
description: "Product Requirements Proposal — plan features before implementation"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: PRP

## Purpose

Create a Product Requirements Proposal document to plan a feature before implementation.

## Execution Flow

1. Understand the user's requirement
2. Analyze which layers are affected (application, infrastructure, api)
3. Identify backend microservice integrations needed
4. Generate PRP document from `.claude/PRPs/prp-base.md` template
5. Save to `.cloud/planning/prp-[feature-name].md`
6. Generate DRP using `.ai/skills/generate-drp/`
7. Present to user for approval

## Rules

- NEVER implement without an approved PRP for complex features
- ALWAYS identify security implications
- ALWAYS estimate test coverage needs
- Wait for explicit user approval before proceeding to implementation
