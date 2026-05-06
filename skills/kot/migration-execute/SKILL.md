---
name: kot-migration-execute
description: "Execute a phase of the migration plan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Migration Execute — Run Migration Phase

## Purpose

Execute a specific phase of the migration plan, converting legacy code to the modern MVVM + Feature Modules architecture.

## Prerequisites

1. ✅ Discovery completed and approved
2. ✅ Migration plan created and approved
3. ✅ Selected phase identified

## Migration Order per Module

For each module, migrate in this order:

1. **Entities** (core)
   - Convert POJOs to data classes
   - Add equals/hashCode if needed
   - Add serialization if needed

2. **Domain** (interfaces + use cases)
   - Create Repository interfaces
   - Create UseCase classes
   - Define Result type wrappers

3. **Data** (implementations)
   - Migrate to Room if using raw SQLite
   - Implement Repository
   - Configure SQLCipher
   - Create DAOs

4. **Presentation** (ViewModels + Compose)
   - Create ViewModel with StateFlow
   - Migrate XML to Compose
   - Connect navigation
   - State hoisting

5. **Tests**
   - Create unit tests for ViewModel
   - Create unit tests for UseCase
   - Verify coverage

## During Execution

1. Create branch: `feature/migrate-{module}`
2. Migrate component by component
3. Run tests after each component
4. Document each step in audit-trail
5. DO NOT proceed if tests fail

## Post-Migration Validations

- [ ] Tests pass at 100%
- [ ] Coverage >= 70%
- [ ] Lint without errors
- [ ] Architecture validated (correct dependencies)
- [ ] Security scan clean

## Output

Update progress in:
- `.cloud/planning/migration-plan.md` — mark phase as completed
- `.cloud/audit/audit-trail.md` — record MODULE_COMPLETED event
- `.cloud/dashboard.md` — update metrics

## Next Step

If more phases remain → Continue with next module
If all phases completed → Migration DONE 🎉
