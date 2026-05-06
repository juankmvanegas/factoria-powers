---
name: ang-generate-adr
description: "Use when an architectural decision needs to be formally documented — new technology, framework change, new layer dependency, or new coding convention"
---

---
name: generate-adr
description: "Create Architecture Decision Record for Angular project"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate ADR

## Purpose

Document architectural decisions in standard ADR format.

## Format

```markdown
# ADR-{NNN}: {Title}

## Status
{Proposed | Accepted | Deprecated | Superseded}

## Context
{Why this decision is needed}

## Decision
{What was decided and how it is implemented}

## Consequences
- Positive: {list}
- Negative: {list}
```

## Flow

1. Determine the next ADR number
2. Understand the context and decision
3. Generate file in `.cloud/architecture/decisions/`
4. Update ADR table in `CLAUDE.md`
5. Record in audit-trail

## Rules

- Sequential numbers without gaps
- Always include both positive AND negative consequences
- Kebab-case in file name
