# ADR-001: Clean Architecture with 4 Layers

## Status

Accepted

## Decision

Python backends built with this factory use four fixed layers: `api`, `application`, `core`, and `infrastructure`.

## Consequences

- The API layer exposes REST endpoints and centralizes framework concerns
- Application implements use cases and interfaces
- Core contains business rules and entities
- Infrastructure implements adapters and technical integrations
- Any proposal to rename, merge, or add layers requires a new ADR
