---
name: pyt-documentacion
description: "Use when documentation (CHANGELOG, README, API docs, comments) needs to be generated or updated after code changes"
---

---
name: documentacion
description: "Auto-skill for documentation updates â€” CHANGELOG, architecture docs, ADRs"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Documentacion (Auto-Activated)

## Activation Trigger

This skill activates automatically when code changes are made that need documentation updates.

## Purpose

Keep project documentation synchronized with code changes, including CHANGELOG, architecture docs, and ADR references.

## Enforcement Rules

### CHANGELOG.md

- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Organize under sections: Added, Changed, Deprecated, Removed, Fixed, Security
- Include the date and version for each release
- Write entries from the user's perspective (what changed, not how)
- Link to relevant issues or PRs when available

```markdown
## [Unreleased]

### Added
- Order creation endpoint with validation (POST /api/v1/orders)
- Customer lookup by email

### Fixed
- Race condition in concurrent order status updates
```

- EVERY user-facing change MUST have a CHANGELOG entry
- NEVER remove or modify entries for released versions

### Architecture Documentation

Maintain `.cloud/architecture/current.md` with:

- High-level system diagram (text-based, Mermaid or ASCII)
- Layer descriptions and responsibilities
- Key design patterns in use
- External service integrations
- Data flow for critical operations

Update this file when:
- A new layer or module is added
- A new external integration is introduced
- The data flow for a critical operation changes
- A new design pattern is adopted

### ADR References

When an architectural decision is made during development:

1. Check if an existing ADR covers the decision
2. If yes, reference it in code comments or documentation
3. If no, flag it for ADR creation using the `generate-adr` AI skill
4. NEVER make significant architectural changes without an ADR

### README Updates

Update the project README when:
- New features are added that change the API surface
- Setup or installation instructions change
- New dependencies are added that require configuration
- New environment variables are introduced

### PRP "Aprendizajes" Section

When errors or unexpected behaviors are encountered during development:

1. Document the issue in the PRP's "Aprendizajes" (Learnings) section
2. Include: what happened, why it happened, how it was resolved
3. This builds institutional knowledge for future sessions

Format:
```markdown
## Aprendizajes

### [Date] â€” Issue Title
- **Problem**: Description of what went wrong
- **Root Cause**: Why it happened
- **Resolution**: How it was fixed
- **Prevention**: How to avoid it in the future
```

### Documentation Quality Rules

- Write in clear, concise English
- Use code examples for technical documentation
- Keep documentation close to the code it describes
- NEVER leave TODO placeholders in committed documentation
- Verify all code examples compile/run before committing

## Auto-Shielding

If any rule above is violated during code changes, the skill MUST:
1. Flag the missing documentation
2. Generate the required documentation updates
3. NEVER skip documentation â€” it is a mandatory part of every change
