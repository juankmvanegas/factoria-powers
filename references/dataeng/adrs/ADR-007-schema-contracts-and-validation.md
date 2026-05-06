# ADR-007: Schema Contracts and Validation

## Status

Accepted

## Decision

Dataset boundaries use explicit schema contracts, nullable-field decisions, partitioning rules, and validation expectations.

## Consequences

- Schema drift is detected early
- Dataset contracts document producer and consumer expectations
- Critical validation failures block promotion
