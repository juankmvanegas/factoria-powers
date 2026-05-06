# ADR-005: Application Owns Serving and Orchestration Contracts

## Status

Accepted

## Decision

Serving contracts, warmup rules, and runtime orchestration are defined in `application`.

## Consequences

- API remains thin
- Analytical code does not dictate serving behavior
