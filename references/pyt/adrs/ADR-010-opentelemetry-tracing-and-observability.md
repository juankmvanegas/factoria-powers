# ADR-010: OpenTelemetry for Tracing and Observability

## Status

Accepted

## Decision

Tracing and observability use OpenTelemetry as the baseline approach.

## Consequences

- Diagnostic information remains consistent across services
- Temporary debug logs are not the primary observability strategy
- Production diagnosis relies on structured tracing instead of ad hoc prints
