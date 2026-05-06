---
name: python-update-architecture
description: "Use when the architecture documentation must reflect recent changes — after an ADR is accepted, new service types added, or new infrastructure providers introduced"
---

---
name: update-architecture
description: "Update .cloud/architecture/current.md after structural changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Architecture

## Purpose

Update the architecture documentation in `.cloud/architecture/current.md` to reflect the current state of the project after structural changes have been made.

## When to Use

- After adding new modules or layers
- After completing a migration module
- After significant refactoring
- When the actual code structure has diverged from the documented architecture

## Execution Flow — 5 Strict Steps

1. **Scan current structure** — Analyze the project source tree:
   - List all packages under `src/`
   - Identify domain entities and their relationships
   - Map port interfaces to their adapter implementations
   - Catalog all API routers and their endpoints
   - Count tests by category (unit, integration, architecture)

2. **Load existing documentation** — Read `.cloud/architecture/current.md` if it exists. Compare documented state with actual state. Identify additions, removals, and changes.

3. **Update architecture document** — Write/update `.cloud/architecture/current.md` with:
   - **Project overview** — Name, type, framework, Python version
   - **Layer structure** — Domain entities, application use cases, infrastructure adapters, API routers
   - **Dependency graph** — Which modules depend on which (text diagram)
   - **External integrations** — Databases, APIs, queues, caches
   - **Test coverage summary** — Tests per layer, coverage percentage
   - **Active ADRs** — List of applicable ADRs with status

4. **Verify consistency** — Cross-check:
   - Every port interface has at least one adapter implementation
   - Every use case is reachable from at least one router
   - Every router is registered in main.py
   - Architecture documentation matches import-linter contracts

5. **Update timestamp** — Add last-updated date to the document header.

## Auto-Shielding

- NEVER fabricate architecture details — only document what actually exists in code
- NEVER remove documentation for components that still exist
- ALWAYS scan the actual source tree, do not rely on memory
- ALWAYS verify port-adapter pairings

## Rules

- Architecture documentation MUST reflect actual code, not aspirational state
- Every entity in the document MUST reference its file path
- The dependency graph MUST be consistent with import-linter contracts
- Update this document after every structural change, not just periodically
- If inconsistencies are found between code and ADRs, flag them — do not silently ignore
