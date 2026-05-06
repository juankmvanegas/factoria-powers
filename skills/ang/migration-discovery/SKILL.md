---
name: ang-migration-discovery
description: "Use when the migration constraints are approved and legacy code analysis needs to begin"
---

---
name: migration-discovery
description: "Migration step 1 — extract contracts from the Angular legacy"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Step 1 of the migration flow. Analyze the legacy Angular project and extract all contracts.

## Execution Context

This skill runs from the **DESTINATION project** (new). It reads the **LEGACY project** (original) remotely. **NEVER modifies the legacy.**

## Prerequisites

- `.cloud/planning/migration-constraints.md` with the legacy path MUST exist
- If it doesn't exist, indicate that `/migration-start` should be run first

## Phase 0: Validate Legacy Access

1. Read legacy path from `migration-constraints.md`
2. Validate that the path is accessible
3. Validate that it contains an Angular project

## Execution Flow

### Phase 1: Legacy Scan

Fully analyze the legacy project:

1. **angular.json** — Configuration, build configs, assets
2. **package.json** — Dependencies and versions
3. **tsconfig.json** — TypeScript configuration
4. **Folder structure** — Identify layers/modules
5. **Routing** — All routes and guards
6. **Components** — All components and their structure
7. **Services** — All services and their logic
8. **Models/DTOs** — Interfaces, types, classes
9. **Interceptors/Guards** — HTTP and routing middleware
10. **Auth** — Authentication mechanism
11. **CSS** — Styles architecture

### Phase 2: Extract Contracts

Generate files in `.cloud/planning/legacy-discovery/`:

#### `components.md`
```markdown
# Legacy Components
| Component | Path | Template | Logic | Dependencies |
|-----------|------|----------|-------|-------------|
```

#### `services.md`
```markdown
# Legacy Services
| Service | Methods | Dependencies | Business Logic |
|---------|---------|--------------|----------------|
```

#### `routes.md`
```markdown
# Legacy Routes
| Route | Component | Guard | Lazy? | Resolver? |
|-------|-----------|-------|-------|-----------|
```

#### `models.md`
```markdown
# Legacy Models/DTOs
| Model | Properties | Used in |
|-------|------------|---------|
```

#### `dependencies.md`
```markdown
# Legacy Dependencies
| Package | Version | New Equivalent | Action |
|---------|---------|----------------|--------|
```

#### `summary.md`
```markdown
# Discovery Summary
- Total components: N
- Total services: N
- Total routes: N
- Total models: N
- Estimated complexity: High/Medium/Low
- Suggested modules for migration: [list]
```

### Phase 3: Risk Analysis

Identify:
- Dependencies without an equivalent in Angular 16
- Patterns incompatible with Clean Architecture 3 layers
- Business logic embedded in components (must be moved to services)
- State management that needs rewriting
- CSS that needs migration to ITCSS

### Phase 4: Approval

Present contracts to the team. Wait for approval before `/migration-plan`.

## Rules

- NEVER modify the legacy
- ALWAYS document ALL components, not just the main ones
- ALWAYS identify hidden logic in components, pipes, directives
