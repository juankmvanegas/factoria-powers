---
name: loading-factory-context
description: Use when the factory is known but its policies, ADRs, and technology stack have not yet been loaded into context — typically at session start or after factory selection
---

# Loading Factory Context

## What to Load

For the active factory (replace `<factory>` with `net`, `ang`, `nest`, `next`, or `python`):

### 1. Factory Identity (required)
```
Read: references/<factory>/CLAUDE.md
```
This establishes the technology stack, golden rules, and architecture overview.

### 2. Mandatory Policies (all 3 required)
```
Read: references/<factory>/policies/security-policy.md
Read: references/<factory>/policies/testing-policy.md
Read: references/<factory>/policies/coding-standards.md
```

### 3. Core ADRs (minimum 5, read all 14 when possible)
```
Read: references/<factory>/adrs/ADR-001-*.md
Read: references/<factory>/adrs/ADR-002-*.md
Read: references/<factory>/adrs/ADR-003-*.md
Read: references/<factory>/adrs/ADR-004-*.md
Read: references/<factory>/adrs/ADR-005-*.md
```

For tasks touching infrastructure, security, testing, or CI/CD: read all 14 ADRs.

## After Loading

Confirm to the user (or yourself if running autonomously):
> "Factoria context loaded for factory: `<factory>`. 3 policies and N ADRs active."

Then proceed with the original user task.

## Red Flags

| Thought | Reality |
|---|---|
| "I already know this factory's rules" | Context windows are fresh each session. Read them. |
| "Loading all ADRs is too many tokens" | ADRs are the contract. Skipping them means violations. |
| "I'll load later if needed" | Load NOW, before any code generation. |
