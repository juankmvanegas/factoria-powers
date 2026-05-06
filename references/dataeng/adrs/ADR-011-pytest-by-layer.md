# ADR-011: pytest for Spark Transformations and Pipeline Helpers

## Status

Accepted

## Decision

The default testing framework is pytest, focused on Spark transformation behavior, orchestration helpers, schema validation, and quality rules.

## Consequences

- Tests follow architecture boundaries
- Business-relevant data logic is protected
- Spark tests can use local Spark sessions or approved test helpers
