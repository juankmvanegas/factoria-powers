# ADR-006: Infrastructure Connectors and Platform Adapters

## Status

Accepted

## Decision

Infrastructure contains concrete adapters for external sources, storage, Unity Catalog references, volumes, secrets references, observability, and Databricks platform APIs.

## Consequences

- Core transformations stay portable and testable
- Connector and platform changes are localized
- Secrets and workspace-specific references stay outside business logic
