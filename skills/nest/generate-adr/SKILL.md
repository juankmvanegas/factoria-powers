---
name: nest-generate-adr
description: "Use when an architectural decision needs to be formally documented — new technology, framework change, new layer dependency, or new coding convention"
---

---
name: generate-adr
description: "Create Architecture Decision Record for NestJS BFF"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate ADR

## Purpose

Create a formal Architecture Decision Record documenting a technical decision for the NestJS BFF project.

## Execution Flow

1. Read `.ai/skills/generate-adr/SKILL.md` for format and process
2. Determine next ADR number from `.cloud/architecture/decisions/`
3. Interview user: context, options considered, decision, consequences
4. Generate ADR file at `.cloud/architecture/decisions/ADR-[NNN]-[kebab-case].md`
5. Update CLAUDE.md ADR registry table

## Rules

- Number ADRs sequentially
- Use kebab-case for filenames
- Reference related existing ADRs
- ADRs are mandatory once accepted — they become contracts
