---
name: kot-documentacion
description: "Automatic documentation — CHANGELOG, architecture, ADRs"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Automatic Documentation — CHANGELOG, Architecture, ADRs

This skill activates automatically after code changes, CHANGELOG updates, or architecture modifications.

## CHANGELOG.md — Update on Each Release

- Update `CHANGELOG.md` on **each release** following the [Keep a Changelog](https://keepachangelog.com/) format.
- Allowed sections within each version:
  - **Added** — New features.
  - **Fixed** — Bug fixes.
  - **Changed** — Changes to existing functionality.
  - **Removed** — Removed features.
  - **Security** — Security fixes.
- Each entry must be a concise line describing the change from the user or developer perspective.
- Maintain an `[Unreleased]` section at the top to accumulate changes before the next version.
- When creating a release, move changes from `[Unreleased]` to a new section with version number and date (`## [X.Y.Z] - YYYY-MM-DD`).
- Never delete previous CHANGELOG entries.

## Architecture Documentation

- The `.cloud/architecture/current.md` file reflects the current state of the system architecture.
- Update this file **every time the architecture changes**: new modules, layer changes, new data providers, modifications to the dependency flow.
- **Never delete history** from architecture documents. If a component is replaced, document the change indicating what was replaced and why.
- Maintain a change history section within the architecture document.

## Synchronized Diagrams

- If architecture diagrams exist (Mermaid, PlantUML, or images), keep them synchronized with the current state of the code.
- When adding a new module, feature, or layer, reflect the change in the corresponding diagrams.
- Diagrams must be consistent with the textual documentation; they cannot contradict each other.

## ADR References

- When a code change relates to a documented architectural decision (ADR), include the reference in the commit, PR, or documentation.
- Reference format: `(ADR-XXX)` where `XXX` is the ADR number.
- If a change contradicts a current ADR, stop work and report the inconsistency before proceeding.
- ADRs are never deleted; if a decision is reversed, a new ADR is created documenting the new decision and referencing the previous ADR as superseded.

## README and Public API

- Update the project `README.md` when the following change:
  - Build instructions.
  - Installation or configuration requirements.
  - Required environment variables.
  - External dependencies.
  - SDK or tool versions.
