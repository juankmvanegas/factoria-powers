# ADR-005: Application Owns Use Cases and Contracts

## Status

Accepted

## Decision

Use cases, DTOs, and integration contracts are defined in the `application` layer.

## Consequences

- API remains thin
- Infrastructure cannot dictate business orchestration
- Interface-driven design becomes the default integration model
