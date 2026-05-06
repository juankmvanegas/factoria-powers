---
name: loading-factory-context
description: Use when the factory is known but its policies, ADRs, and technology stack have not yet been loaded into context — typically at session start or after factory selection
---

# Loading Factory Context

## What to Load

For the active factory (replace `<factory>` with `net`, `ang`, `nest`, `pyt`, `pytml`, `dataeng`, `kot`, `swf`, or `wps`):

### 1. Factory Identity (required)
```
Read: references/<factory>/CLAUDE.md
```
This establishes the technology stack, golden rules, and architecture overview.

### 2. Mandatory Policies (read ALL files in the policies folder — count varies by factory)
```
Read all: references/<factory>/policies/*.md
```
Net/Ang/Pyt typically have 6 policies (security, testing, coding-standards + qa, performance, security-testing).
DataEng has 6 specialized policies. Kot/Swf/Wps have 3–4. Read them all.

### 3. Core ADRs (minimum 5; read all when possible)
```
Read: references/<factory>/adrs/ADR-001-*.md
Read: references/<factory>/adrs/ADR-002-*.md
Read: references/<factory>/adrs/ADR-003-*.md
Read: references/<factory>/adrs/ADR-004-*.md
Read: references/<factory>/adrs/ADR-005-*.md
```

For tasks touching infrastructure, security, testing, or CI/CD: read all ADRs (count varies 10–15 by factory).

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
