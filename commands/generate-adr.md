# /generate-adr

Creates a new ADR (Architecture Decision Record) for a technical decision.

## What it does
Generates a properly formatted ADR document following the project's numbering convention and stores it in `.cloud/architecture/decisions/`.

## Instructions
1. Determine the next ADR number by reading existing ADRs
2. Interview the user about the decision context, options considered, and chosen approach
3. Generate the ADR with sections: Context, Decision, Consequences, Status
4. Save to `.cloud/architecture/decisions/ADR-{NNN}-{slug}.md`
5. Update the ADR table in `CLAUDE.md`

## Usage
```
/generate-adr [decision title]
```
