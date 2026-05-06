# ADR-004: Single Initialization Type — REST API Only

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
Unlike .NET microservices that support multiple initialization types (REST, gRPC, Messaging, CronJob), the BFF serves as the single entry point for frontend applications and only needs to expose REST endpoints. Supporting multiple initialization types would add unnecessary complexity.

## Decision
The BFF uses a single initialization type: **REST API via HTTP**.

- `main.ts` as the single entry point using `NestFactory.create()`.
- `InitializationModule` as the composition root that imports all feature modules.
- Global pipes (ValidationPipe), filters (CustomExceptionFilter), and interceptors (TracerInterceptor) configured in `main.ts`.
- Swagger documentation configured via `DocumentBuilder`.

**Not supported** (these belong in backend microservices):
- gRPC server endpoints (BFF may consume gRPC backends via infrastructure)
- Standalone messaging consumer (BFF may publish/subscribe via modules)
- CronJob/Worker scheduled tasks

## Consequences
- Single entry point simplifies configuration, deployment, and debugging
- `main.ts` is clear and predictable — no conditional initialization logic
- `InitializationModule` acts as explicit composition root
- If WebSockets or SSE are needed in the future, a new ADR is required
- GraphQL federation not supported without extension
