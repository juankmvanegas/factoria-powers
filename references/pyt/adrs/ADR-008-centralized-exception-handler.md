# ADR-008: Centralized Exception Handling

## Status

Accepted

## Decision

HTTP error translation is centralized in `api/exception_handler`.

## Consequences

- Error responses stay semantic and consistent
- Internal details are not leaked
- Dependency failures can be mapped in a single place
