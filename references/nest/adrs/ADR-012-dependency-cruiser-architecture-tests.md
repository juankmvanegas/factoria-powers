# ADR-012: dependency-cruiser for Architecture Tests

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The 3-layer architecture (ADR-001) establishes strict dependency rules. Without automated enforcement, these rules are easily violated as the codebase grows. Architecture tests running in CI provide a safety net to catch violations before production.

## Decision
Use `dependency-cruiser` to enforce architecture layer rules via `.dependency-cruiser.cjs`:

- **Rule 1**: `application` must NOT import from `api` or `infrastructure` (defines abstractions only).
- **Rule 2**: `api` must NOT import from `infrastructure` directly (depends on application use cases only).
- **Rule 3**: No circular dependencies anywhere.
- **Rule 4**: `libs/` must NOT import from any layer (`api`, `infrastructure`, `application`).

All rules have `severity: 'error'`. Configuration in `.dependency-cruiser.cjs` at project root.

CI integration: `npm run arch:test` runs after lint, before tests. Any violation fails the pipeline. Dependency graph can be generated on-demand via `npm run arch:graph`.

## Consequences
- Architecture rules validated automatically on every PR
- Developers get immediate feedback on dependency violations
- Generated dependency graph facilitates visual architecture reviews
- Rules are versioned alongside code
- Adds minor time to CI pipeline (typically < 10 seconds)
- False positives may occur with re-exports or barrel files crossing layers
