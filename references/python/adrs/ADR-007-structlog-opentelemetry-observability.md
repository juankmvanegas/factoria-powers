# ADR-007: structlog + OpenTelemetry for Observability

## Status
Accepted

## Date
2025-06-01

## Context
Observability is essential for understanding system behavior in production. Traditional unstructured logging is difficult to query, correlate, and analyze at scale. We need a structured logging approach that integrates with distributed tracing to provide full visibility into request flows across services.

## Decision
We adopt **structlog** for structured logging and **OpenTelemetry** for distributed tracing.

### structlog

- All logging goes through structlog — the ONLY approved logging library
- Output format: structured JSON for machine parsing
- Every log entry includes a `request_id` for correlation
- Processors: timestamp, log level, caller info, request context

```python
import structlog

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.PrintLoggerFactory(),
)

logger = structlog.get_logger()
```

### OpenTelemetry

- Automatic instrumentation for FastAPI, SQLAlchemy, httpx, and Celery
- Trace context propagation across HTTP boundaries
- Span attributes include: service name, operation, user ID, request ID
- Exporter: OTLP to a collector (Jaeger, Tempo, Azure Monitor)

### Prohibited Patterns

- NEVER use `print()` for any purpose in production code
- NEVER use `logging.basicConfig()` or raw `logging.getLogger()`
- NEVER log sensitive data (passwords, tokens, PII, credit card numbers)

## Consequences
### Positive
- Structured JSON logs are easily queryable in log aggregation tools (ELK, Loki)
- Request correlation IDs enable end-to-end request tracing
- OpenTelemetry provides vendor-neutral distributed tracing
- Automatic instrumentation reduces manual tracing boilerplate
- Combined logs + traces give full observability into system behavior

### Negative
- structlog has a learning curve for developers accustomed to `logging.getLogger()`
- OpenTelemetry adds slight runtime overhead for trace collection
- Requires infrastructure for collecting, storing, and visualizing traces

### Neutral
- structlog integrates well with Python's stdlib logging (can be used as a wrapper)
- OpenTelemetry is a CNCF project with broad industry adoption
- Log volume increases with structured format (mitigated by log level configuration)
