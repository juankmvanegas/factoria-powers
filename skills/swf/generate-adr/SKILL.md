# Skill: Generate ADR (Architecture Decision Record)

## Purpose
Generate a new ADR document when an architectural decision is being made,
following the project's ADR format and numbering convention for the iOS/Swift stack.

## When to Use
- When introducing a new SPM package or third-party library
- When changing an existing architectural pattern (MVVM, Coordinator, etc.)
- When adding a new data store, API provider, or external service
- When modifying module dependencies or SPM structure
- When establishing a new coding convention for Swift/SwiftUI
- When changing DI strategy, navigation approach, or state management

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

## Process
1. Read all existing ADRs in `.cloud/architecture/decisions/` to understand current decisions
2. Read `.cloud/architecture/current.md` for current architecture state
3. Determine the next ADR number (sequential from last)
4. Interview the user for context if not fully provided:
   - What problem does this solve?
   - What alternatives were considered?
   - What are the trade-offs?
5. Generate the ADR document following the format above
6. If the decision modifies architecture, flag that `current.md` needs updating
7. Record `ADR_CREATED` event in audit trail

## Auto-Shielding
- **ABORT** if the proposed decision contradicts an existing accepted ADR without explicitly superseding it
- **ABORT** if the decision introduces a technology not in the Golden Path without justification
- **WARN** if the decision affects more than 3 SPM modules

## Rules
1. Number sequentially from the last ADR in `.cloud/architecture/decisions/`
2. Use kebab-case for the filename suffix
3. Status starts as "Proposed" unless already approved
4. Always document consequences (both positive and negative)
5. Reference related ADRs if applicable
6. Update `current.md` if the decision changes the architecture diagram
7. Validate the decision does not break existing module dependency graph
8. For Swift-specific decisions, reference relevant Apple documentation or WWDC sessions
