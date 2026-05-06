---
name: wps-generate-adr
description: "Generate a new Architecture Decision Record (ADR) for WordPress block theme"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate ADR

## Purpose
Create a new ADR document following the standard format, numbered sequentially after the latest existing ADR.

## Execution Flow — 4 Strict Steps

### Step 1: Read Existing ADRs
1. List all files in `.cloud/architecture/decisions/`
2. Find the highest ADR number
3. Assign next sequential number to new ADR

### Step 2: Gather Context
1. Read the proposed decision from user
2. Read `CLAUDE.md` for current technology stack
3. Read `.cloud/architecture/current.md` for architecture state
4. Identify related existing ADRs

### Step 3: Write ADR
1. Create file: `ADR-{NNN}-{slug}.md`
2. Follow format:
   ```markdown
   # ADR-{NNN}: {Title}

   ## Status
   Proposed

   ## Date
   {YYYY-MM-DD} (Factoria-Wps v1.0.0)

   ## Context
   {Problem and forces}

   ## Decision
   {What was decided and why}

   ## Consequences
   {Impacts and tradeoffs}
   ```

### Step 4: Update Architecture
1. Add ADR reference to `.cloud/architecture/current.md`
2. Report new ADR to user

## Rules
- **NEVER** skip the Context or Consequences sections
- **ALWAYS** reference related ADRs
- **ALWAYS** set initial status to "Proposed"
