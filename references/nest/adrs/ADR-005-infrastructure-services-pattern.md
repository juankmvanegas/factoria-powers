# ADR-005: Infrastructure Services Pattern

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF communicates with multiple backend microservices. Each external service integration needs a consistent structure that isolates communication details from application logic, supports NestJS dependency injection, and makes services easy to discover.

## Decision
Each external backend microservice gets its own dedicated folder in `infrastructure/services/` following a consistent pattern:

- **Service folder**: `infrastructure/services/{backend-service-name}/` containing service implementation, providers, module, optional protos and DTOs.
- **Abstractions**: defined in `application/abstractions/infrastructure/` as `abstract class` (not interface, for DI token support).
- **Provider-based DI**: providers file maps abstract class to concrete implementation. Module exports the abstraction.
- **HTTP error handling**: each service uses `HttpErrorInterceptor` (ADR-013) to transform backend HTTP errors.

Naming conventions:
- Folder: kebab-case matching backend service name
- Service class: PascalCase + `Service` suffix
- Abstraction: PascalCase + `Adapter` suffix
- Module: PascalCase + `Module` suffix

## Consequences
- Each backend service has a predictable, self-contained location
- Abstractions in application enable testing use cases without infrastructure dependencies
- Provider pattern facilitates implementation replacement (mocks in tests, stubs in dev)
- More files per service compared to monolithic approach
- Developers must keep abstraction and implementation synchronized
