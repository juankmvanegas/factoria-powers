---
name: dataeng-migration-discovery
description: "Migration step 1 — extract contracts from legacy code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Step 1 of the migration workflow. Analyze legacy code to extract all contracts: entities, services, APIs, database schemas, and dependencies. Use the discovery-agent role for systematic analysis.

## Execution Context

This skill runs from the **DESTINATION project** (the new .NET 8.0 project). The legacy project is read remotely — **legacy code is NEVER modified**.

## Prerequisites

- `.cloud/planning/migration-constraints.md` with confirmed status MUST exist
- If it does not exist, tell the user to run `/migration-start` first
- The legacy path MUST be documented in `migration-constraints.md` (field "Legacy Path")

## Execution Flow

### Phase 0: Obtain Legacy Path

1. Read `.cloud/planning/migration-constraints.md`
2. Extract the **Legacy Path** field
3. Validate the path is still accessible
4. If the user provides a path as argument (e.g., `/migration-discovery C:\path\legacy`), use that path and update the constraints file
5. If there is no path, ask the user

**Do NOT continue without a validated path.**

### Phase 1: Structure Scan

Analyze the legacy project structure (using the path obtained in Phase 0):

1. Identify the folder/project structure
2. Map modules/functional areas
3. Identify architecture patterns used (MVC, n-tier, microservices, etc.)
4. List all external dependencies (packages, APIs, services)

### Phase 2: Entity Extraction

For each entity found:

1. Entity name
2. Properties with types
3. Relationships with other entities
4. Existing validations
5. **Confidence**: High / Medium / Low (based on code clarity)

### Phase 3: Service Extraction

For each service/business logic component:

1. Service name
2. Public methods with signatures
3. Dependencies (other services, repositories)
4. Implemented business rules
5. **Confidence**: High / Medium / Low

### Phase 4: API Extraction

For each endpoint:

1. HTTP method + Route
2. Request body / query params
3. Response body
4. Required authentication/authorization
5. **Confidence**: High / Medium / Low

### Phase 5: Data Schema Extraction

For each table/collection:

1. Name
2. Columns with types
3. Indexes
4. Relationships (FK, etc.)
5. Estimated volume data
6. **Confidence**: High / Medium / Low

### Phase 6: Dependency Extraction

1. Internal dependencies (between modules)
2. External dependencies (packages, third-party APIs)
3. Simplified dependency graph

### Phase 7: Document Generation

Create the following files in `.cloud/planning/legacy-discovery/`:

- `entities.md` — All extracted entities
- `services.md` — All extracted services
- `apis.md` — All extracted endpoints
- `data-schema.md` — Complete data schema
- `dependencies.md` — Dependency graph
- `summary.md` — Executive summary with statistics

Each file must include the **confidence scoring** for each element:

```markdown
### {EntityName} (Confidence: High ✅)
...

### {OtherEntity} (Confidence: Low ⚠️)
**Low confidence reason**: Obfuscated code / no documentation / complex logic
```

### Phase 8: Team Review

Present the summary to the user/team:

1. Total entities, services, APIs, tables found
2. Confidence distribution (how many High/Medium/Low)
3. Identified problem areas
4. Open questions requiring human validation

Wait for the team to:
- Validate High confidence elements
- Clarify Low confidence elements
- Confirm no modules are missing
- Approve to advance to `/migration-plan`

## Rules

- NEVER modify legacy code — READ ONLY
- NEVER assume behavior of ambiguous code — mark it as Low confidence
- ALWAYS include confidence scoring on each element
- ALWAYS generate all discovery files
- ALWAYS wait for team validation before considering it complete
- If the legacy is very large, divide discovery by modules
- Document EVERYTHING found, even if it appears to be dead code
