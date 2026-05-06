# ADR-010: Operational Observability for Data Engineering Services

## Status

Accepted

## Decision

Observability is treated as an operational capability for jobs, Lakeflow pipelines, data quality, dataset freshness, and downstream SLA monitoring.

## Consequences

- Pipeline behavior is diagnosable
- Monitoring is not mixed into core transformation logic
- Failures include enough evidence for incident triage
