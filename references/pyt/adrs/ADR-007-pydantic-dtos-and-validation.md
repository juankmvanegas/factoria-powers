# ADR-007: Typed DTOs and Validation

## Status

Accepted

## Decision

Request and response contracts use typed DTOs and validation models compatible with FastAPI.

## Consequences

- API boundaries are explicit
- Validation is centralized near the input boundary
- Use cases receive normalized data
