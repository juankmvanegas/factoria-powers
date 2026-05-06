---
name: next-generate-drp
description: "Use when documenting a development request plan before starting a new feature, architectural change, or database migration"
---

---
name: generate-drp
description: "Generate Detailed Requirements Proposals for Next.js 14 features"
type: agent-skill
used-by: planning-agent
---

# AI Skill: Generate DRP

## Purpose

Used by the `planning-agent` to generate DRPs (Detailed Requirements Proposals) that break down a feature into implementable files per layer.

## Output Structure

### Files to Create/Modify per Layer

#### Application Layer
- Abstractions (use cases, adapter contracts)
- DTOs (input/output types)
- Services (use case implementations)
- Events (if cross-component communication needed)

#### Infrastructure Layer
- Fetch adapters (HTTP implementations)
- Storage adapters (localStorage/sessionStorage)
- Providers (React Context bindings)

#### Presentation Layer
- Pages (page.tsx in App Router)
- Layouts (layout.tsx if needed)
- Components (Server or Client)
- Hooks (custom React hooks)
- Route Handlers (app/api/ if needed)
- Loading/Error states (loading.tsx, error.tsx)

#### Tests
- Service tests (*.service.test.ts)
- Adapter tests (*.adapter.test.ts)
- Component tests (*.test.tsx, if significant logic)
- Route Handler tests (route.test.ts)

### Dependencies Between Files
- Which files must be created before others
- Cross-layer dependencies

### Implementation Order
1. Application abstractions and DTOs
2. Application services
3. Infrastructure adapters and providers
4. Presentation pages, components, hooks
5. Tests
6. Documentation

### Validation Criteria
- `next build` without errors
- `next lint` without warnings
- All tests pass
- Architecture rules respected (no cross-layer violations)

## Rules

- Every file must belong to exactly one layer
- Server Components by default in Presentation
- `'use client'` only with justification
- Each phase in the DRP must have clear deliverables
- Include rollback considerations
