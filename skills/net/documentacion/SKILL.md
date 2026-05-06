---
name: net-documentacion
description: "Use when documentation (CHANGELOG, README, API docs, comments) needs to be generated or updated after code changes"
---

---
name: documentacion
description: "Automatic documentation — CHANGELOG, architecture, ADRs"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Automatic Documentation — CHANGELOG, Architecture, ADRs

This skill is automatically activated after code changes, CHANGELOG updates, or architecture modifications.

## CHANGELOG.md — Update on Each Release

- Update `CHANGELOG.md` on **each release** following the [Keep a Changelog](https://keepachangelog.com/) format.
- Allowed sections within each version:
  - **Added** — New features.
  - **Fixed** — Bug fixes.
  - **Changed** — Changes to existing functionality.
  - **Removed** — Removed features.
- Each entry should be a concise line describing the change from the user's or developer's perspective.
- Maintain an `[Unreleased]` section at the top to accumulate changes before the next version.
- When creating a release, move changes from `[Unreleased]` to a new section with version number and date (`## [X.Y.Z] - YYYY-MM-DD`).
- Never delete previous CHANGELOG entries.

## Architecture Documentation

- The file `.cloud/architecture/current.md` reflects the current state of the system's architecture.
- Update this file **every time the architecture changes**: new components, layer changes, new data providers, modifications to the dependency flow.
- **Never delete history** from architecture documents. If a component is replaced, document the change indicating what was replaced and why.
- Maintain a change history section within the architecture document itself.

## Synchronized Diagrams

- If architecture diagrams exist (Mermaid, PlantUML, or images), keep them synchronized with the current state of the code.
- When adding a new component, service, or layer, reflect the change in the corresponding diagrams.
- Diagrams must be consistent with textual documentation; they cannot contradict each other.

## ADR References

- When a code change relates to a documented architectural decision (ADR), include the reference in the commit, PR, or documentation.
- Reference format: `(ADR-XXX)` where `XXX` is the ADR number.
- If a change contradicts a current ADR, stop work and report the inconsistency before proceeding.
- ADRs are never deleted; if a decision is reversed, a new ADR is created documenting the new decision and referencing the previous ADR as superseded.

## README and Public API

- Update the project's `README.md` when the following change:
  - Public API endpoints.
  - Installation or configuration requirements.
  - Required environment variables.
  - Execution or deployment instructions.
- Do not update the README for internal changes that do not affect the public interface.

## Auto-Shielding — Document Errors

When an error, recurring failure, or problematic pattern is detected, document it in the appropriate location:

- **PRP (Problem Resolution Prompt)** — If the error requires a specific resolution procedure that other agents or developers will need to follow.
- **Corresponding skill** — If the error reveals a rule or constraint the skill should account for to prevent recurrence.
- **CLAUDE.md** — If the error affects the agent's general behavior or project conventions that do not belong to a specific skill.

The goal of auto-shielding is that every error found becomes documented knowledge, preventing the same problem from recurring.
