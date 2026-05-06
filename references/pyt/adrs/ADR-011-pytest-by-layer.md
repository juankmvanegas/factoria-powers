# ADR-011: pytest Test Strategy by Layer

## Status

Accepted

## Decision

The default testing framework is pytest, organized by solution layer.

## Consequences

- `tests/application.Tests` validates use case orchestration
- `tests/core.Tests` validates domain behavior
- Tests remain aligned with architectural boundaries
