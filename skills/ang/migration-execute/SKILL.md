---
name: ang-migration-execute
description: "Use when the migration plan is approved and actual code migration should begin phase by phase"
---

---
name: migration-execute
description: "Migration step 3 — execute ONE Angular module at a time"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Step 3 of the migration flow. Execute the migration of ONE single module at a time, following the approved plan.

## Prerequisites

- `.cloud/planning/migration-plan.md` with `APPROVED` status MUST exist
- If no approved plan exists, indicate that `/migration-plan` should be run first

## Execution Flow

### Phase 1: Module Preparation

1. Read the specific module plan in `migration-plan.md`
2. Read the contracts in `legacy-discovery/` for this module
3. Verify that dependent modules are already migrated
4. Confirm with the user to proceed

### Phase 2: Migration by Layers

Strictly follow the Clean Architecture Angular order:

#### 2.1 Application — Abstractions
- Create DTOs in `application/dtos/{entity}/`
- Create abstract Use Cases in `application/abstractions/use-cases/`
- Create abstract Adapters in `application/abstractions/infraestructure/`
- Create Events in `application/events/`
- Map legacy types to TypeScript strict

#### 2.2 Application — Services
- Create Services that implement Use Cases
- Port business logic from the legacy
- Register in `application.module.ts`

#### 2.3 Infrastructure
- Create HTTP Adapters in `infrastructure/services/api-bff/`
- Create Storage Adapters if applicable
- Create/update providers
- Register in `infraestructure.module.ts`

#### 2.4 Presentation
- Create Views with Container/Module/Router pattern
- Create Pages and Components
- Configure routing with lazy loading
- Migrate styles to ITCSS
- Register routes in `presentation.router.ts`

### Phase 3: Logic Verification (MANDATORY)

**BEFORE generating tests**, execute the `verify-logic` skill:

1. Read the legacy path from `migration-constraints.md`
2. For EACH service migrated in this module:
   - Read the original legacy code
   - Read the new generated code
   - Compare: business logic, subscriptions, event handling, error handling, edge cases
3. Generate report in `.cloud/planning/logic-verification/{module}-verification.md`
4. **If coverage < 95%**: fix the gaps BEFORE continuing
5. **If coverage >= 95%**: approve for tests

**NEVER proceed to tests without approved logic verification.**

### Phase 4: Auto-chaining — Tests

Invoke `/generate-tests` automatically:
1. Service tests (use case implementations)
2. Adapter tests
3. Guard/interceptor tests if applicable
4. Execute: `ng test --watch=false`

### Phase 5: Auto-chaining — Documentation

Invoke `/documentacion` automatically:
1. Update CHANGELOG.md
2. Mark module as completed in `migration-plan.md`

### Phase 6: Validation

1. `ng build` — without errors
2. `ng test --watch=false` — all tests pass
3. `ng lint` — without warnings
4. Verify functional routes
5. Verify that previous modules are not broken

### Phase 7: Module Approval

Wait for explicit approval before proceeding to the next module.

## Auto-Shielding

If errors occur during migration:
1. Capture complete error
2. Fix and re-verify
3. If not resolved after 3 attempts, STOP and escalate

## Rules

- NEVER migrate more than one module at a time
- NEVER skip modules — follow the plan order
- NEVER omit tests
- NEVER proceed without team approval
- ALWAYS follow the order Application → Infrastructure → Presentation → Tests → Docs
