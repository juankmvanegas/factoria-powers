# ADR-007: Custom Logger, Tracer, and Observability

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
Observability is critical for a BFF orchestrating calls to multiple backend services. NestJS's basic Logger lacks structured logging, correlation ID propagation, and request/response tracing. The BFF needs a custom observability stack compatible with the organization's monitoring infrastructure.

## Decision
Implement a custom logger and tracer system in `libs/tracer/`:

- **CustomLoggerService** — Structured JSON output to stdout, compatible with Azure Monitor / Application Insights. Includes timestamp, level, correlationId, context, and message.
- **TracerInterceptor** — Logs every incoming request (method, URL, sanitized headers) and outgoing response (status, duration). Attaches correlationId to all entries.
- **CorrelationIdMiddleware** — Extracts `x-correlation-id` from incoming requests or generates UUID v4. Stores in `AsyncLocalStorage` for propagation. Forwards to all downstream calls.

Rules:
- `console.log` is **PROHIBITED** — ESLint `no-console` enforced. Use `CustomLoggerService` exclusively.
- All infrastructure service calls must log URL, duration, and status code.
- Sensitive data (tokens, passwords, PII) must NEVER be logged.
- Log levels: ERROR for failures, WARN for degraded states, INFO for request lifecycle, DEBUG for development only.

## Consequences
- Structured JSON logs enable search and alerting in Azure Monitor
- CorrelationId traces requests from frontend through all backend microservices
- TracerInterceptor automatically captures per-endpoint performance metrics
- Prohibiting console.log guarantees consistent log format
- CorrelationId propagation with AsyncLocalStorage may have edge cases with complex async code
