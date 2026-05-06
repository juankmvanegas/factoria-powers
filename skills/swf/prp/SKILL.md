---
name: swf-prp
description: "Planning Review Proposal — structured proposal for complex features with scope, risk, and implementation plan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP (Planning Review Proposal)

## Purpose

Create a structured Planning Review Proposal for complex features. Includes scope definition, affected modules, architecture impact assessment, risk analysis, implementation plan, and test strategy. Used before starting any non-trivial feature work.

## Execution Flow — 8 Strict Steps

### Step 1: Interview for Scope

Collect from the user:

1. **Feature name** — Short descriptive name
2. **User story** — As a [role], I want [action], so that [benefit]
3. **Acceptance criteria** — Numbered list of verifiable conditions
4. **Priority** — Critical / High / Medium / Low
5. **Deadline** — Target completion date (if any)

### Step 2: Identify Affected Modules

1. Map which SPM modules will be created or modified
2. For each module, list specific files/components affected
3. Identify shared modules that may need changes (Core, CoreUI, Dependencias)
4. Flag cross-cutting concerns (authentication, analytics, error handling)

### Step 3: Architecture Impact Assessment

1. Check if feature requires new ADR
2. Verify alignment with existing ADRs
3. Assess impact on module dependency graph
4. Check if new Factory DI registrations are needed
5. Evaluate if Coordinator changes are needed
6. Flag if CoreUI needs new Atomic Design components

### Step 4: Risk Assessment

| Risk Category | Check |
|---------------|-------|
| Complexity | More than 3 modules affected? |
| Dependencies | Requires external API changes? |
| Performance | Large data sets or complex UI? |
| Security | Handles PII or credentials? |
| Compatibility | iOS version constraints? |
| Third-party | New library needed? |

Rate overall risk: LOW / MEDIUM / HIGH / CRITICAL

### Step 5: Implementation Plan

Break the feature into ordered tasks:

```markdown
## Implementation Plan

### Phase 1: Data Layer (Est: Xh)
- [ ] Create API models in Datos[Feature]
- [ ] Create ApiProtocol and ApiImplementacion
- [ ] Create EnrutadorApi routes
- [ ] Register in Factory Container

### Phase 2: Business Logic (Est: Xh)
- [ ] Create ViewModel with @MainActor
- [ ] Implement Combine publishers
- [ ] Map error states

### Phase 3: UI (Est: Xh)
- [ ] Create SwiftUI Views
- [ ] Use CoreUI components
- [ ] Handle loading/error/empty states

### Phase 4: Navigation (Est: Xh)
- [ ] Update Coordinator
- [ ] Configure navigation routes

### Phase 5: Testing (Est: Xh)
- [ ] Generate ViewModel tests
- [ ] Generate Api tests
- [ ] Generate Coordinator spy tests
```

### Step 6: Test Strategy

1. List all components that need tests
2. Define test types per component (unit, integration, UI)
3. Map mock classes needed
4. Define coverage targets
5. Identify edge cases to test

### Step 7: Dependencies and Prerequisites

1. List external dependencies (API endpoints, backend changes)
2. List internal prerequisites (other PRs, module updates)
3. Identify blocking dependencies
4. Propose parallel work streams

### Step 8: Generate PRP Document

Save to `.claude/PRPs/PRP-[YYYYMMDD]-[feature-name].md`:

```markdown
# PRP: [Feature Name]
## Date: [YYYY-MM-DD]
## Author: [Name]
## Status: DRAFT

## Scope
[User story and acceptance criteria]

## Affected Modules
[Module list with specific files]

## Architecture Impact
[ADR alignment, new patterns, DI changes]

## Risk Assessment
Overall: [LOW/MEDIUM/HIGH/CRITICAL]
[Risk table]

## Implementation Plan
[Phased task breakdown with estimates]

## Test Strategy
[Components, test types, coverage targets]

## Dependencies
[External and internal prerequisites]

## Estimated Total Effort: [X hours]
## Estimated Completion: [Date]
```

## Auto-Shielding

- **ABORT** if no user story or acceptance criteria provided
- **WARN** if feature affects more than 5 modules — suggest decomposition
- **WARN** if risk is CRITICAL — require explicit approval before proceeding
- **WARN** if no deadline provided — assign default sprint timeline

## Rules

1. Every complex feature (> 1 module, > 8h estimated) requires a PRP
2. PRP must be reviewed before implementation begins
3. Include time estimates for every phase
4. Test strategy is mandatory — cannot skip
5. Risk assessment must consider all 6 categories
6. Save PRP to `.claude/PRPs/` directory
7. Reference related ADRs and policies
8. Update PRP status as work progresses (DRAFT → APPROVED → IN_PROGRESS → DONE)
