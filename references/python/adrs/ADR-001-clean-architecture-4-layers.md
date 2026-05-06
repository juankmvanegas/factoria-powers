# ADR-001: Clean Architecture with 4 Layers

## Status
Accepted

## Date
2025-06-01

## Context
Python/FastAPI projects can quickly degrade into monolithic structures where business logic is intertwined with framework code, database access, and HTTP handling. This makes testing difficult, increases coupling, and hinders long-term maintainability. We need a clear architectural boundary model that enforces separation of concerns and allows each layer to evolve independently.

## Decision
We adopt Clean Architecture with 4 explicit layers:

1. **Domain** — Contains entities, value objects, domain services, and domain exceptions. Has ZERO third-party dependencies; only Python standard library and `typing` are allowed. This layer represents the core business logic and is completely framework-agnostic.

2. **Application** — Contains use cases, Ports (defined as `typing.Protocol`), and DTOs (Pydantic models for input/output). Depends ONLY on the Domain layer. Orchestrates business workflows by calling domain services and ports.

3. **Infrastructure** — Implements the Ports defined in Application. Contains SQLAlchemy repositories, HTTP clients, message brokers, file storage adapters, and other external integrations. Depends on Domain and Application.

4. **API** — FastAPI routers, middleware, exception handlers, and the dependency injection composition root. This is the only layer that "knows" about all other layers, because it wires everything together via `Depends()`. It NEVER contains business logic.

The dependency rule is strictly enforced:
```
Domain ← Application ← Infrastructure
              ↑
API (composition root) → all layers
```

Layer boundary compliance is verified by `import-linter` contracts in CI. Any import that violates the dependency rule causes the build to fail.

## Consequences
### Positive
- Domain logic is testable without any framework or infrastructure dependencies
- Use cases can be tested with mocked ports (fast, isolated unit tests)
- Infrastructure implementations are swappable without changing business logic
- Clear boundaries reduce accidental coupling between layers

### Negative
- More files and directories compared to a flat FastAPI structure
- Developers must understand the layer model before contributing
- Simple CRUD operations require touching multiple layers (entity, use case, repository, router)

### Neutral
- The 4-layer model mirrors the architecture used in the .NET and Angular factories, ensuring consistency across the organization
- import-linter configuration must be maintained as the codebase evolves
