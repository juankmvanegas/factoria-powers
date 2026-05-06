# ADR-007: Explicit Validation at the Serving Boundary

## Status

Accepted

## Decision

The serving boundary uses explicit typed validation for requests and responses.

## Consequences

- Inputs are normalized before orchestration
- Error handling becomes more predictable
