# ADR-009: Externalized Configuration for Serving and Remote Execution

## Status

Accepted

## Decision

Configuration is externalized for serving, storage, and remote execution, with sensitive values resolved outside source code.

## Consequences

- Secrets stay outside the repository
- Runtime and remote jobs share a consistent model
