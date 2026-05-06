---
name: kot-migration-plan
description: "Create the migration plan based on discovery"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Migration Plan — Generate Migration Plan

## Purpose

Create a detailed migration plan based on the discovery report, defining phases, priorities, and strategy.

## Prerequisites

1. ✅ Discovery completed
2. ✅ Discovery report in `.cloud/planning/discovery-report.md`
3. ✅ Discovery report reviewed and approved by the team

## Migration Strategies

### 1. Strangler Pattern (Recommended)
- Module by module, gradually replacing legacy
- Coexistence of old and new code
- Lower risk, more time

### 2. Feature-by-Feature
- Migrate complete features (vertical slice)
- Each feature includes all layers
- Balance between risk and speed

### 3. Layer-by-Layer
- Migrate all entities first, then domain, etc.
- Higher risk of inconsistencies
- Useful for small projects

## Plan Contents

```markdown
# Migration Plan — [Project]
## Date: YYYY-MM-DD
## Strategy: [Strangler | Feature | Layer]

## 1. Summary
- Total modules to migrate: N
- Total estimation: X weeks
- Recommended team size: Y devs

## 2. Phases

### Phase 0: Setup (Week 1)
- [ ] Configure new project with target architecture
- [ ] Configure Hilt
- [ ] Configure Room + SQLCipher
- [ ] Configure Compose
- [ ] Setup CI/CD

### Phase 1: Core (Week 2)
- [ ] Migrate shared entities
- [ ] Migrate extensions and utils
- [ ] Tests for core

### Phase 2: [Module 1] (Week 3-4)
- [ ] Discovery → Plan → Execute → Test
- Dependencies: Phase 1
- Risk: [High/Medium/Low]
- Owner: [TBD]

### Phase 3: [Module 2] (Week 5-6)
...

## 3. Dependencies Between Phases
[Dependency diagram]

## 4. Risks and Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ... | | | |

## 5. Success Criteria per Phase
- [ ] Tests pass
- [ ] Coverage >= 70%
- [ ] Architecture validated
- [ ] Code review approved

## 6. Rollback Strategy
[Plan in case of issues]
```

## Output

Save to `.cloud/planning/migration-plan.md`

## Next Step

Plan approved → `/migration-execute [phase-number]`
