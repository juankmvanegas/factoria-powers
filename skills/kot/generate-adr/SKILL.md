# Skill: Generate ADR (Architecture Decision Record)

## Purpose
Generate a new ADR document when an architectural decision is being made,
following the project's ADR format and numbering convention for Android/Kotlin.

## When to Use
- When introducing a new library or dependency (Gradle)
- When changing an existing architectural pattern (MVVM, Repository, etc.)
- When adding a new data store (Room, DataStore) or external service
- When modifying dependencies between layers or modules
- When establishing a new coding convention or Compose pattern

## Inputs Required
1. **Decision title** — What is being decided
2. **Context** — Why this decision is needed
3. **Options considered** — Alternatives evaluated (if applicable)
4. **Decision** — What was chosen and why
5. **Consequences** — Impact on the codebase

## Output
A new ADR file at `.cloud/architecture/decisions/ADR-[NNN]-[kebab-case-name].md`

## Format
```markdown
# ADR-[NNN]: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
[YYYY-MM-DD]

## Context
[Why is this decision needed?]

## Decision
[What was decided and key implementation details]

## Consequences
[Positive and negative impacts]
```

## Rules
1. Number sequentially from the last ADR in `.cloud/architecture/decisions/`
2. Use kebab-case for the filename suffix
3. Status starts as "Proposed" unless already approved
4. Always document consequences (both positive and negative)
5. Reference related ADRs if applicable
6. Update `current.md` if the decision changes the architecture diagram
7. Consider impact on Gradle Version Catalogs if adding dependencies

## Process
1. Read all existing ADRs to understand current decisions
2. Read `.cloud/architecture/current.md` for current state
3. Determine the next ADR number
4. Generate the ADR document
5. If the decision modifies architecture, flag that `current.md` needs updating
