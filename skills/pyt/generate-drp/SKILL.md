---
name: pyt-generate-drp
description: "Use when documenting a development request plan before starting a new feature, architectural change, or database migration"
---

---
name: generate-drp
description: "Generate Development Request Plan from PRP"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate DRP

## Purpose

Transform a Product Requirements Proposal (PRP) into an actionable Development Request Plan (DRP) with per-module execution steps aligned to the Clean Architecture layers.

## Execution Flow Ã¢â‚¬â€ 6 Strict Steps

### Step 1: Load and Parse PRP

1. Read the PRP file provided by the user
2. Extract: feature name, description, acceptance criteria, constraints
3. Identify all modules and layers affected by the feature

### Step 2: Analyze Impact

1. Determine which Clean Architecture layers are involved:
   - Domain (entities, value objects, domain services)
   - Application (use cases, DTOs, ports)
   - Infrastructure (repositories, external services, adapters)
   - Presentation (API endpoints, request/response models)
2. Identify cross-cutting concerns (logging, auth, validation)
3. Map dependencies between modules

### Step 3: Define Execution Order

Follow the mandatory layer execution order:

1. **Domain first** Ã¢â‚¬â€ Entities, value objects, domain events
2. **Application second** Ã¢â‚¬â€ Use cases, DTOs, port interfaces
3. **Infrastructure third** Ã¢â‚¬â€ Repository implementations, adapters
4. **Presentation last** Ã¢â‚¬â€ API endpoints, middleware

Within each layer, order by dependency (modules with no dependencies first).

### Step 4: Generate Per-Module Steps

For each module, create a detailed execution step:

```markdown
### Module: {module_name} ({layer})

**Files to create/modify:**
- `app/{layer}/{module}/file.py`

**Implementation details:**
- {Specific instructions}

**Dependencies:**
- Requires: {list of modules that must be completed first}

**Tests:**
- Unit tests: `tests/unit/{layer}/{module}/test_file.py`
- Integration tests (if applicable): `tests/integration/test_{module}.py`

**Validation:**
- [ ] Type hints on all functions
- [ ] Tests pass
- [ ] Layer boundaries respected
```

### Step 5: Add Quality Gates

Include quality gate checkpoints after each layer:

```markdown
## Quality Gate: Domain Layer Complete
- [ ] All entities have type hints
- [ ] No external dependencies in domain
- [ ] Unit tests pass with 100% coverage
- [ ] mypy --strict passes
```

### Step 6: Write DRP File

1. Create the DRP at `.cloud/plans/DRP-{feature-slug}.md`
2. Include: summary, execution order, per-module steps, quality gates, estimated effort
3. Link back to the source PRP

## Output Format

```markdown
# DRP: {Feature Name}

## Source PRP
{Link to PRP file}

## Summary
{1-2 sentence description of what will be built}

## Execution Order
1. Domain: {modules}
2. Application: {modules}
3. Infrastructure: {modules}
4. Presentation: {modules}

## Detailed Steps
{Per-module steps as described above}

## Quality Gates
{Checkpoints after each layer}

## Estimated Effort
- Domain: {estimate}
- Application: {estimate}
- Infrastructure: {estimate}
- Presentation: {estimate}
- Testing: {estimate}
- Total: {estimate}
```

## Rules

- NEVER skip the layer execution order
- EVERY module MUST have associated test steps
- NEVER create a DRP without quality gate checkpoints
- Keep steps atomic Ã¢â‚¬â€ each step should be completable independently
- Include rollback notes for risky steps
