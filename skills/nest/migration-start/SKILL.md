---
name: nest-migration-start
description: "Use when starting a migration of a legacy system — first step before any code analysis"
---

---
name: migration-start
description: "Migration step 0: Capture constraints and prepare migration"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Step 0 of the migration workflow. Capture constraints, identify architecture changes needed, and prepare the project for migration.

## Execution Flow

1. Interview user: legacy BFF path, known constraints, timeline
2. Read legacy project structure
3. Identify architecture differences (layers, patterns, dependencies)
4. Generate `.cloud/planning/migration-constraints.md`
5. Generate new ADRs if architecture changes are needed
6. Wait for team confirmation before proceeding to discovery

## Rules

- NEVER proceed to discovery without team confirmation
- Document ALL constraints, even seemingly minor ones
- Generate ADRs for every architecture change
