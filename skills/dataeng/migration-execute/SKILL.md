---
name: dataeng-migration-execute
description: "Migration step 3 — execute ONE module at a time"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Step 3 of the migration workflow. Execute the migration of ONE single module at a time, following the approved plan. Use the migration-agent role with auto-chaining to testing-agent and docs-agent.

## Prerequisites

- `.cloud/planning/migration-plan.md` with status `APPROVED` MUST exist
- Must know which module to execute (the next one in the plan, or the one the user indicates)
- If no approved plan exists, indicate that `/migration-plan` should be run first

## Execution Flow

### Phase 1: Module Preparation

1. Read the specific module plan in `migration-plan.md`
2. Read the contracts in `legacy-discovery/` for this module's entities/services
3. Verify that dependent modules are already migrated
4. Confirm with the user to proceed with this module

### Phase 2: Migration by Layers

Follow the Clean Architecture order strictly:

#### 2.1 Core
- Create entities in `Core/Entities/`
- Create repository interfaces in `Core/Interfaces/`
- Create enums and domain exceptions
- Map legacy types to .NET 8.0 types

#### 2.2 Application
- Create DTOs (Request/Response)
- Create service interfaces
- Create services (Simple/Compound as appropriate)
- Create validators with FluentValidation
- Create mappers Entity ↔ DTO
- Port business rules from legacy

#### 2.3 Infrastructure
- Create repositories with EF Core
- Create entity configurations (Fluent API)
- Create EF migrations if applicable
- Register in DependencyInjection.cs

#### 2.4 Api
- Create controllers
- Configure routes matching legacy (if backward compatibility is required)
- Register services in DI

### Phase 3: Business Logic Verification (MANDATORY)

**BEFORE generating tests**, execute the `verify-logic` skill:

1. Read the legacy path from `.cloud/planning/migration-constraints.md`
2. For EACH service migrated in this module:
   - Read the original legacy code
   - Read the new generated code
   - Compare: business rules, validations, calculations, side effects, error handling, edge cases
3. Generate report in `.cloud/planning/logic-verification/[module]-verification.md`
4. **If coverage < 95%**: fix the gaps BEFORE continuing
5. **If coverage >= 95%**: approve for tests

**NEVER proceed to tests without approved logic verification.**

### Phase 4: Auto-Chaining — Tests

Automatically after APPROVED LOGIC VERIFICATION:

1. Create test doubles in `Double.Tests/`
2. Create unit tests in `Unit.Tests/`
3. AAA pattern, naming `Method_Scenario_ExpectedResult`
4. Cover all public methods of services
5. Cover edge cases identified in discovery AND in logic verification
6. Run: `dotnet test`

### Phase 5: Auto-Chaining — Documentation

Automatically after tests:

1. Update CHANGELOG.md
2. Update API documentation if it exists
3. Mark the module as completed in `migration-plan.md`

### Phase 6: Validation

1. `dotnet build` — no errors
2. `dotnet test` — all tests pass
3. Verify module success criteria
4. Compare contracts: are all legacy endpoints covered?
5. Verify that previously migrated modules are not broken

### Phase 7: Module Approval

Present to the team:

1. Summary of what was migrated
2. Test results
3. Any deviations from the plan
4. Any new discoveries
5. Status of the next module

Wait for explicit approval before proceeding to the next module.

## Auto-Shielding

If there are errors during migration:

1. Capture full error
2. Check if it's a legacy mapping problem
3. Check if it's a dependency issue
4. Fix and re-verify
5. If after 3 attempts it is not resolved, STOP and escalate

## Rules

- NEVER migrate more than one module at a time
- NEVER skip modules — follow the plan order
- NEVER omit tests — each migrated module MUST have tests
- NEVER proceed to the next module without team approval
- NEVER do batch execution (migrate multiple modules without pause)
- ALWAYS verify that previous modules still work
- ALWAYS follow the order Core → Application → Infrastructure → Api → Tests → Docs
- ALWAYS compare the result with the discovery contracts
- If something not anticipated in the plan is discovered, INFORM the team before continuing
- Maximum 3 auto-shielding attempts per error before escalating
