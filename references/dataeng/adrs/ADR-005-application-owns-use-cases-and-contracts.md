# ADR-005: Application Owns Pipeline Use Cases and Contracts

## Status

Accepted

## Decision

The `application` layer owns pipeline use cases, job contracts, orchestration boundaries, and publication workflows.

## Consequences

- Job and pipeline entrypoints remain thin
- Transformation logic does not dictate deployment behavior
- Dataset publication contracts stay stable
