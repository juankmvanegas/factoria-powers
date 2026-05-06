# ADR-001: Clean Architecture — 3 Layers for BFF

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF acts as an intermediary between frontend applications and backend microservices. It contains zero business logic — only orchestration, transformation, and aggregation. A traditional 4-layer architecture introduces unnecessary complexity for this role. We need a simplified architecture that enforces separation of concerns while reflecting the BFF's true responsibilities.

## Decision
Adopt a 3-layer Clean Architecture:

- **api** — Controllers, DTOs de entrada/salida, global filters, guards, interceptors, pipes. Entry point for all HTTP requests.
- **infrastructure** — HTTP/gRPC clients, Azure Service Bus producers/consumers, external service integrations. Each backend microservice gets its own folder.
- **application** — Use cases that orchestrate calls to infrastructure abstractions. Contains interfaces/abstractions. No business logic — only application logic (composition, transformation, aggregation).
- **libs/** — Cross-cutting shared utilities (config, tracer, errors). Not a layer.

Dependency rule: `application` depends on nothing. `infrastructure` depends on `application`. `api` depends on `application`. `api` must NOT import from `infrastructure`. `libs/` can be imported by any layer.

BFF constraint: NO business logic allowed. Only request routing, response aggregation, DTO transformation, authentication forwarding, and error normalization.

## Consequences
- Clear, predictable structure for all BFF developers
- Dependency rules prevent coupling between layers
- Less complexity than 4-layer architecture by eliminating the unnecessary domain layer
- Developers accustomed to 4-layer .NET architecture must adapt
- If the BFF eventually requires business logic, a new ADR is needed
