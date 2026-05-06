---
name: net-generate-adr
description: "Use when an architectural decision needs to be formally documented — new technology, framework change, new layer dependency, or new coding convention"
---

---
name: generate-adr
description: "Create a new Architecture Decision Record (ADR)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate ADR

## Purpose

Create a new Architecture Decision Record when a significant architectural decision is made. ADRs document the context, the decision, the alternatives considered, and the consequences.

## When to Create an ADR

- New technology adopted
- Design pattern change
- New data store or change to existing one
- New significant external dependency
- Change in authentication/authorization strategy
- Change in deployment strategy
- Any decision that affects multiple modules or layers

## Execution Flow

### Step 1: Gather Information

Ask the user (or infer from context):

1. What is the decision? (one sentence)
2. What is the context? (why is this decision needed)
3. What alternatives were considered?
4. Why was this option chosen over the others?
5. What are the positive and negative consequences?

### Step 2: Determine Number

1. Search in `.cloud/architecture/decisions/` for the last ADR
2. Increment the number: if the last is ADR-005, the new one is ADR-006
3. If there are no previous ADRs, start with ADR-001

### Step 3: Generate the ADR

Create the file `ADR-{NNN}-{kebab-case-name}.md` in `.cloud/architecture/decisions/`:

```markdown
# ADR-{NNN}: {Decision Title}

## Status

ACCEPTED

## Date

{YYYY-MM-DD}

## Context

{Description of the problem or situation requiring a decision.
Include relevant technical, business factors, and constraints.
Be specific about what makes this decision necessary now.}

## Decision

{Clear and concise description of the decision made.
Use active voice: "We will use...", "We adopt...", "We will implement..."}

## Alternatives Considered

### Alternative 1: {Name}
- **Description**: {what it is}
- **Pros**: {advantages}
- **Cons**: {disadvantages}
- **Reason for rejection**: {why it was not chosen}

### Alternative 2: {Name}
- **Description**: {what it is}
- **Pros**: {advantages}
- **Cons**: {disadvantages}
- **Reason for rejection**: {why it was not chosen}

## Consequences

### Positive
- {Positive consequence 1}
- {Positive consequence 2}

### Negative
- {Negative consequence 1 — and how it is mitigated}
- {Negative consequence 2 — and how it is mitigated}

### Neutral
- {Changes that are neither good nor bad, but should be known}
```

### Step 4: Update References

1. If `.cloud/architecture/current.md` exists, add reference to the new ADR
2. If there is an in-progress PRP that motivated this decision, reference it

## Valid ADR States

- **PROPOSED**: Still under discussion
- **ACCEPTED**: Decision made and in effect
- **DEPRECATED**: Replaced by another ADR (reference which one)
- **SUPERSEDED**: Explicitly replaced (reference ADR-{NNN})

## Rules

- NEVER create an ADR without clear context — if the user cannot explain why, ask
- NEVER create ADRs for trivial decisions (e.g., naming a variable)
- ALWAYS include at least 2 considered alternatives
- ALWAYS document negative consequences and their mitigation
- ALWAYS number sequentially
- ALWAYS use kebab-case for the file name
- The title must be a decision, not a question (correct: "Use PostgreSQL", incorrect: "Which database?")
- ADRs are immutable — if a decision changes, create a new ADR that supersedes the previous one
- Fixed location: `.cloud/architecture/decisions/`
