---
name: net-update-architecture
description: "Use when the architecture documentation must reflect recent changes — after an ADR is accepted, new service types added, or new infrastructure providers introduced"
---

---
name: update-architecture
description: "Update architecture documentation after changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Update Architecture

## Purpose

Update the project's architecture documentation after changes have been made. Maintains `.cloud/architecture/current.md` as the source of truth for the current architecture state.

## Execution Flow

### Step 1: Current State Analysis

1. Read `.cloud/architecture/current.md` if it exists
2. Scan the current project structure:
   - Projects in the solution (`dotnet sln list`)
   - Entities in Core
   - Services in Application (Simple and Compound)
   - Repositories in Infrastructure
   - Controllers in Api
3. Read recent ADRs to understand decisions made
4. Read CHANGELOG.md to understand recent changes

### Step 2: Identify Changes

Compare the documented state with the actual state:

- New undocumented entities
- New undocumented services
- New undocumented endpoints
- New or removed dependencies
- Changes in the layer structure
- New ADRs since the last update

### Step 3: Update current.md

Update `.cloud/architecture/current.md` with the following structure:

```markdown
# Current Architecture: {ProjectName}

**Last updated**: {date}

## Overview
{High-level description of the system and its purpose}

## Layer Structure

### Core
- **Entities**: {list with brief description}
- **Interfaces**: {list}
- **Enums**: {list}
- **Exceptions**: {list}

### Application
- **Simple Services**: {list with responsibility}
- **Compound Services**: {list with responsibility}
- **DTOs**: {list grouped by feature}
- **Validators**: {list}

### Infrastructure
- **Repositories**: {list}
- **EF Configurations**: {list}
- **External Services**: {list}
- **Database**: {type and version}

### Api
- **Controllers**: {list with endpoints}
- **Middleware**: {list}
- **Authentication**: {type}

## Dependency Diagram
```
Api → Application → Core
Infrastructure → Application → Core
Infrastructure → Core
```

## External Integrations
{List of external services with description}

## Current Architectural Decisions
| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | {title} | ACCEPTED |
| ADR-002 | {title} | ACCEPTED |

## Architectural Change History
| Date | Change | Related ADR |
|------|--------|-------------|
| {date} | {change description} | ADR-{NNN} |
```

### Step 4: Verify Consistency

1. All referenced ADRs exist
2. All listed entities exist in the code
3. All listed services exist in the code
4. The dependency diagram reflects actual references between projects

## Rules

- NEVER delete history — only add new entries
- NEVER invent components that do not exist in the code
- ALWAYS verify that what is documented matches the actual code
- ALWAYS keep the ADR table updated
- ALWAYS record the update date
- ALWAYS keep the dependency diagram in sync
- If an inconsistency between documentation and code is detected, report it to the user
- Documentation should be concise — do not repeat what is already in the ADRs
