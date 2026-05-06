# ADR-003: Databricks Asset Bundle Entrypoint

## Status

Accepted

## Decision

`databricks.yml` is the root deployment entrypoint. Jobs, Lakeflow pipelines, permissions, variables, and environment-specific resources are declared through Databricks Asset Bundle resources.

## Consequences

- Deployments are reproducible across environments
- Ad-hoc workspace changes are discouraged
- CI/CD can validate bundle structure before release
