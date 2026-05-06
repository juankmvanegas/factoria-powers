---
name: dataeng-migration-start
description: "Migration step 0 — capture constraints before discovery"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Step 0 of the migration workflow. Capture all constraints, architectural decisions, and business context BEFORE analyzing the legacy code. This step establishes the boundaries and objectives of the migration.

## Execution Context

This skill runs from the **DESTINATION project** (the new .NET 8.0 project). The legacy project is external and Factoria only reads it — never modifies it.

## Execution Flow

### Phase 0: Request Legacy Project Path

**MANDATORY before any other question.**

Ask the user:
> What is the absolute path of the legacy project we are going to migrate?

Validate that:
1. The path exists and is accessible
2. It contains a software project (look for `.sln`, `.csproj`, `pom.xml`, `package.json`, or similar)
3. It is DIFFERENT from the current directory (the destination)

Save this path — it will be used in `/migration-discovery`.

If the path is not valid, ask the user to correct it. **Do NOT continue without a validated path.**

### Phase 1: Constraint Gathering

Interview the user about the following areas:

#### Target Architecture
1. What is the target architecture? (default: Clean Architecture 4 layers)
2. Are there necessary deviations from the Factoria standard?
3. Are all modules being kept or are some being removed?
4. Are there new modules that do not exist in the legacy?

#### Technology
1. What technology stack does the legacy system have? (framework, language, version)
2. What database does it currently use?
3. Is the database changing? If so, to what?
4. Are there external dependencies that must be maintained?
5. Are there external dependencies that must be replaced?

#### Business
1. Is there functionality that is NOT being migrated? (deprecated features)
2. Is there new functionality being added during the migration?
3. What is the estimated/desired timeline?
4. Is a coexistence period required (legacy + new)?
5. Is there data that must be migrated? What is the volume?

#### Known Risks
1. Are there parts of the legacy without documentation?
2. Are there parts of the legacy without tests?
3. Are there fragile or undocumented integrations?
4. Are there business rules that only exist in the code?

### Phase 2: Generate migration-constraints.md

Create `.cloud/planning/migration-constraints.md` with all gathered information:

```markdown
# Migration Constraints

**Date**: {date}
**Legacy System**: {name/description}
**Legacy Path**: {absolute path of the legacy project}
**Destination Project**: {current directory}
**Status**: PENDING CONFIRMATION

## Target Architecture
{Structured answers}

## Technology
### Legacy
- Framework: {x}
- Database: {x}
- Key dependencies: {list}

### Target
- Framework: .NET 8.0
- Database: {x}
- Dependencies to maintain: {list}
- Dependencies to replace: {list with alternatives}

## Business Constraints
{Structured answers}

## Identified Risks
{Prioritized list}

## Pending Decisions
{Any point that requires more information}
```

### Phase 3: ADR Generation

If migration decisions involve architectural changes, generate new ADRs:

- Database change → ADR
- Authentication pattern change → ADR
- Caching strategy change → ADR
- Module removal → ADR
- New integration → ADR

### Phase 4: Team Confirmation

Present the complete document to the user/team and request explicit confirmation:

- **Confirms**: Proceed to `/migration-discovery`
- **Changes**: Modify and present again
- **Cancel**: Archive the document

## Rules

- NEVER analyze legacy code in this step — only capture constraints
- NEVER assume constraints — always ask
- ALWAYS document pending decisions explicitly
- ALWAYS generate ADRs for architectural decisions
- ALWAYS wait for explicit confirmation before considering this step complete
- This step is BLOCKING — cannot advance to discovery without confirmation
