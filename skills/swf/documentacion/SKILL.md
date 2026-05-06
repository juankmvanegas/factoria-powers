---
name: swf-documentacion
description: "Automatic documentation — CHANGELOG, architecture, ADRs after code changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Automatic Documentation — CHANGELOG, Architecture, ADRs

This skill is automatically activated after code changes, tests pass, or architecture modifications.

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
- Update this file **every time the architecture changes**: new SPM modules, layer changes, new data providers, modifications to the dependency flow.
- **Never delete history** from architecture documents. If a component is replaced, document the change indicating what was replaced and why.
- Update the module dependency graph when Package.swift changes.

## Synchronized Diagrams

- If architecture diagrams exist (Mermaid, PlantUML), keep them synchronized with the current SPM module structure.
- When adding a new feature module, reflect the change in the dependency graph.
- Diagrams must be consistent with textual documentation; they cannot contradict each other.

## ADR References

- When a code change relates to a documented architectural decision (ADR), include the reference in the commit or documentation.
- Reference format: `(ADR-XXX)` where `XXX` is the ADR number.
- If a change contradicts a current ADR, stop work and report the inconsistency before proceeding.
- ADRs are never deleted; if a decision is reversed, a new ADR is created documenting the new decision and referencing the previous ADR as superseded.

## README and Module Documentation

- Update the project's `README.md` when the following change:
  - SPM module structure or new feature modules
  - Build or configuration requirements
  - Required environment variables or configuration files
  - Setup or deployment instructions
- Do not update the README for internal changes that do not affect the public interface.
- Each SPM module should have a brief description in its Package.swift or README.

## Auto-Shielding — Document Errors

When an error, recurring failure, or problematic pattern is detected, document it in the appropriate location:

- **DRP** — If the error requires a specific recovery procedure.
- **Corresponding skill** — If the error reveals a rule or constraint the skill should account for.
- **CLAUDE.md** — If the error affects the agent's general behavior or project conventions.

The goal of auto-shielding is that every error found becomes documented knowledge, preventing the same problem from recurring.

## Rules

1. Documentation updates are non-negotiable after code changes
2. CHANGELOG entries must be human-readable, not technical jargon
3. Architecture diagrams must match actual Package.swift dependencies
4. Never remove history from any document
5. ADR references must be accurate — verify the ADR exists
