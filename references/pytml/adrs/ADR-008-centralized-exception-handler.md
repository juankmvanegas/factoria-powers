# ADR-008: Centralized Error Mapping for Inference Services

## Status

Accepted

## Decision

HTTP error translation is centralized for the serving layer.

## Consequences

- Responses stay semantic
- Internal details are not leaked
