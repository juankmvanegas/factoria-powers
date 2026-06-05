# ADR-010: OpenTelemetry for Tracing and Observability

## Status

Accepted

## Decision

Tracing and observability use OpenTelemetry as the baseline approach, paired with `structlog` for structured logging.

### OpenTelemetry

- Automatic instrumentation for FastAPI, SQLAlchemy, httpx, and Celery
- Trace context propagation across HTTP boundaries
- Span attributes include service name, operation, user ID, and request ID
- Exporter: OTLP to a collector (Jaeger, Tempo, Azure Monitor)

### structlog (Structured Logging)

- All logging goes through `structlog` — the only approved logging library
- Output format is structured JSON for machine parsing
- Every log entry includes a `request_id` for correlation
- Processors: timestamp, log level, caller info, request context

### Prohibited Patterns

- NEVER use `print()` for any purpose in production code
- NEVER use `logging.basicConfig()` or raw `logging.getLogger()`
- NEVER log sensitive data (passwords, tokens, PII, credit-card numbers)

## Consequences

- Diagnostic information remains consistent across services
- Temporary debug logs are not the primary observability strategy
- Production diagnosis relies on structured tracing and structured JSON logs instead of ad hoc prints
- Request correlation IDs enable end-to-end request tracing across services and traces
