# ADR-006: Infrastructure Owns Technical Adapters

## Status

Accepted

## Decision

Outbound REST clients, repositories, persistence connectors, and machine learning model loaders live in `infrastructure`.

## Consequences

- Technical concerns remain isolated
- Application consumes abstractions instead of concrete adapters
- Changing providers has reduced impact on use cases
