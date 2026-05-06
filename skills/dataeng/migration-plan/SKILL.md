---
name: dataeng-migration-plan
description: "Migration step 2 — generate the module-by-module migration plan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Purpose

Step 2 of the migration workflow. Take the contracts discovered in the previous step and generate a detailed module-by-module migration plan, with a rollback strategy for each. Use the architecture-agent role.

## Prerequisites

- `.cloud/planning/migration-constraints.md` confirmed MUST exist
- `.cloud/planning/legacy-discovery/` with team-validated files MUST exist
- If they do not exist, indicate the pending steps

## Execution Flow

### Phase 1: Technical Decision Confirmation

Review the migration constraints and confirm:

1. Is the database being kept? Being migrated?
2. What packages/dependencies are being replaced and with what?
3. Are there legacy patterns being kept or is everything being rewritten?
4. What level of backward compatibility is needed?

Generate ADRs for any new technical decisions that arise.

### Phase 2: Module Definition

Divide the system into independently migratable modules:

1. Group related entities, services, and APIs
2. Identify inter-module dependencies
3. Determine migration order (modules with fewer dependencies first)
4. Estimate complexity of each module (S/M/L/XL)

### Phase 3: Per-Module Plan

For each module, define:

```markdown
### Module: {ModuleName}
**Complexity**: {S/M/L/XL}
**Dependencies**: {modules it must wait for}
**Order**: {N of M}

#### Entities to Migrate
- {Entity1} → {Location in Clean Architecture}
- {Entity2} → {Location}

#### Services to Migrate
- {Service1} → Simple/Compound in Application/
- {Service2} → Simple/Compound in Application/

#### APIs to Migrate
- {Endpoint1} → Controller + method
- {Endpoint2} → Controller + method

#### Data
- Data migration: {Yes/No}
- Strategy: {SQL Script / ETL / Manual}
- Estimated volume: {rows/GB}

#### Rollback Strategy
- **Point of no return**: {description}
- **Rollback before the point**: {concrete steps}
- **Rollback after the point**: {concrete steps or "Not possible — justification"}
- **Rollback verification**: {how to confirm the rollback worked}

#### Module Success Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}
```

### Phase 4: Plan Generation

Create `.cloud/planning/migration-plan.md` with:

```markdown
# Migration Plan: {SystemName}

**Date**: {date}
**Status**: PENDING APPROVAL
**Total modules**: {N}
**Estimated total complexity**: {sum}

## Migration Order
1. {Module1} (S) — no dependencies
2. {Module2} (M) — depends on Module1
3. ...

## General Strategy
- **Approach**: {Big bang / Strangler fig / Parallel run}
- **Coexistence**: {Yes/No — details}
- **Data migration**: {General strategy}

## Generated ADRs
- ADR-{N}: {title}
- ADR-{M}: {title}

## Per-Module Plan
{Detail of each module per Phase 3}

## Risks and Mitigations
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| {risk} | High/Medium/Low | High/Medium/Low | {mitigation} |

## Global Success Criteria
- [ ] All modules migrated
- [ ] All tests passing
- [ ] Performance equal to or better than legacy
- [ ] No data loss
- [ ] {Additional criteria}
```

### Phase 5: Team Approval

Present the complete plan and wait for EXPLICIT approval:

- The team must approve the module order
- The team must approve the rollback strategies
- The team must approve the data migration approach
- Any objections must be resolved before approval

## Rules

- NEVER execute migration in this step — planning only
- NEVER omit the rollback strategy for any module
- ALWAYS generate ADRs for new technical decisions
- ALWAYS estimate complexity of each module
- ALWAYS define measurable success criteria
- ALWAYS wait for explicit team approval
- Migration order must minimize risk (simple and independent modules first)
- Each module must be migratable and validatable independently
