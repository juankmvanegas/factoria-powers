# ADR-012: External Source Integrations

## Status

Accepted

## Decision

External sources are integrated through infrastructure adapters with explicit schemas, incremental strategy, retry behavior, and security configuration.

## Consequences

- Source integration behavior remains testable
- Retry and incremental semantics are documented
- Source-specific credentials and endpoints stay externalized
