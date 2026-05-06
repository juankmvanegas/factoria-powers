---
name: python-generate-adr
description: "Use when an architectural decision needs to be formally documented — new technology, framework change, new layer dependency, or new coding convention"
---

---
name: generate-adr
description: "Create a new Architecture Decision Record following standard format"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate ADR

## Purpose

Create a new Architecture Decision Record (ADR) documenting an important architectural decision for the project. Follows the standard ADR format with context, decision, and consequences.

## When to Use

- When making a significant architectural decision
- When choosing between technology alternatives
- When establishing a new pattern or convention
- When a PRP identifies the need for an architectural decision

## Execution Flow — 5 Strict Steps

1. **Determine next ADR number** — Scan `.cloud/architecture/decisions/` for existing ADRs. Find the highest number and increment by 1.

2. **Interview the user** — Gather decision context:
   - What is the architectural question or problem?
   - What alternatives were considered?
   - What is the chosen solution and why?
   - What are the constraints or drivers?
   - What are the expected consequences (positive and negative)?

3. **Generate ADR document** — Write to `.cloud/architecture/decisions/ADR-{NNN}-{slug}.md`:
   ```markdown
   # ADR-{NNN}: {Title}

   ## Status
   Accepted

   ## Date
   {YYYY-MM-DD}

   ## Context
   {Description of the problem, forces, and constraints}

   ## Decision
   {The chosen solution with justification}

   ## Alternatives Considered
   {List of alternatives and why they were rejected}

   ## Consequences

   ### Positive
   {Benefits of this decision}

   ### Negative
   {Trade-offs and costs of this decision}

   ### Risks
   {Potential risks and mitigations}
   ```

4. **Cross-reference** — Check if the new ADR affects or supersedes existing ADRs. If so, update the status of affected ADRs to "Superseded by ADR-{NNN}".

5. **Verify indexing** — Ensure the new ADR will be picked up by the DocRegistry. Verify the filename follows the pattern `ADR-{NNN}-{kebab-case-slug}.md`.

## Auto-Shielding

- NEVER create an ADR without user input on the decision context
- NEVER modify existing ADR decisions (only status can change to "Superseded" or "Deprecated")
- ALWAYS check for conflicts with existing ADRs
- ALWAYS include both positive and negative consequences

## Rules

- ADR numbers are sequential and NEVER reused
- ADR status is one of: Proposed, Accepted, Deprecated, Superseded
- The slug MUST be kebab-case and descriptive
- Consequences MUST include both positive and negative sections
- If the ADR supersedes another, both ADRs MUST cross-reference each other
- ADRs are append-only — once accepted, the Decision section is immutable
