---
name: ang-update-architecture
description: "Use when the architecture documentation must reflect recent changes — after an ADR is accepted, new service types added, or new infrastructure providers introduced"
---

---
name: update-architecture
description: "Update Angular architecture documentation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Architecture

## Purpose

Keep `.cloud/architecture/current.md` synchronized with the real project state.

## Flow

1. Scan current project structure
2. Identify layers, modules, services, views
3. Update `current.md` with current state
4. Reference active ADRs
5. Document dependencies between modules

## Rules

- ALWAYS reflect the REAL state, not the expected one
- ALWAYS include dependency diagram
- ALWAYS reference ADRs
