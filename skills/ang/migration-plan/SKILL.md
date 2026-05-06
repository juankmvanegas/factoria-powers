---
name: ang-migration-plan
description: "Use when legacy discovery is complete and the migration execution plan needs to be drafted"
---

---
name: migration-plan
description: "Migration step 2 — generate module-by-module Angular migration plan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Step 2 of the migration flow. Generate a module-by-module migration plan with dependencies, order, and strategies.

## Prerequisites

- `.cloud/planning/legacy-discovery/` with extracted contracts MUST exist
- The discovery must be approved

## Execution Flow

### Phase 1: Define Modules

Group legacy components/services into logical modules:

```markdown
| Module | Components | Services | Routes | Dependencies |
|--------|-----------|----------|--------|-------------|
| Auth | LoginComponent, ... | AuthService | /login, /logout | MSAL |
| Home | HomeComponent | DashboardService | / | Auth |
| Notes | NotesListComponent, NoteDetailComponent | NotesService | /notes, /notes/:id | Auth, Home |
```

### Phase 2: Migration Order

Determine order based on dependencies:

```
Module 1: Shared/Common (DTOs, helpers, events)
Module 2: Auth (MSAL, guards, login)
Module 3: Layout (container, nav, sidebar)
Module 4+: Features by dependency order
```

### Phase 3: Strategy per Module

For each module document:

1. **Components to create** (Clean Architecture mapping)
2. **Services to migrate** (Use Cases + Adapters)
3. **Routes to maintain** (backward compatibility?)
4. **Required tests**
5. **Identified risks**
6. **Success criteria**

### Phase 4: Generate Plan

Create `.cloud/planning/migration-plan.md`:

```markdown
# Angular Migration Plan

## Status: PENDING APPROVAL

## Summary
- Total modules: N
- Migration order: [list]
- Estimated duration: [per module]

## Module 1: {name}
### Mapping Legacy → New
| Legacy | New | Layer |
|--------|-----|-------|
| Component X | X Page | Presentation |
| Service Y | Y UseCases + Y Service | Application |
| API calls | Y Adapter + ApiBffY | Infrastructure |

### Success Criteria
- [ ] All components migrated
- [ ] Tests pass
- [ ] Routes functional
- [ ] Auth functional
```

### Phase 5: Approval

Wait for explicit team approval before `/migration-execute`.

## Rules

- NEVER migrate without an approved plan
- ALWAYS respect dependencies between modules
- ALWAYS include measurable success criteria
