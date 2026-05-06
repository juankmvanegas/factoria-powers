# ADR-009: Externalized Configuration for Data pipeline and Remote Execution

## Status

Accepted

## Decision

Configuration is externalized for jobs, pipelines, storage, source systems, Unity Catalog, and remote execution, with sensitive values resolved outside source code.

## Consequences

- Secrets stay outside the repository
- Environment-specific values remain portable
- Workspace identifiers and storage credentials are never hardcoded
