---
name: net-primer
description: "Use at the start of a session to load the full factory context when the automatic bootstrap did not run or needs to be refreshed"
---

---
name: primer
description: "Load project context at session start by reading key files"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Purpose

Load the complete project context at the start of a work session. Read key files to understand the current state and present a summary to the agent/user.

## Execution Flow

### Step 1: Read CLAUDE.md

Find and read the `CLAUDE.md` file at the project root. This file contains:
- Project policies
- Available skills
- Code standards
- Project structure

If it does not exist, inform the user that the project is not initialized with Factoria.

### Step 2: Read Solution Structure

Identify the `.sln` file and analyze:
- Included projects
- Architecture layers (Core, Application, Infrastructure, Api)
- Test projects

Run `dotnet sln list` if a .sln file is available.

### Step 3: Read Existing ADRs

Search in `.cloud/architecture/decisions/` for all existing ADRs. Read each one to understand the architectural decisions made.

### Step 4: Read Current Architecture

Find and read `.cloud/architecture/current.md` if it exists. This provides the current architecture state.

### Step 5: Read CHANGELOG

Read `CHANGELOG.md` to understand recent changes and the current development state.

### Step 6: Read BUSINESS_LOGIC.md

If it exists, read to understand the domain and business rules.

### Step 7: Check Active PRPs

Search in `.cloud/planning/` for any PRP with status IN PROGRESS or APPROVED.

### Step 8: Generate Summary

Present the user with a structured summary:

```
## Project Status: {ProjectName}

### Architecture
- Layers: {list layers found}
- ADRs: {count} registered decisions
- Last decision: {title of the last ADR}

### Current State
- Last change: {most recent CHANGELOG entry}
- Active PRPs: {list if any}

### Domain Entities
- {list entities found in Core/Entities}

### Services
- Simple: {list}
- Compound: {list}

### Observations
- {any detected anomalies: missing tests, empty layers, etc.}
```

## Rules

- NEVER modify any file during primer
- READ ONLY — this skill is purely observational
- If a file does not exist, report it as absent but continue
- Be concise in the summary — the goal is quick context, not a full audit
- If the project does not have Factoria structure, suggest running `/new-project` or `/codebase-analyst`
