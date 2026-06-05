# ADR-008: Centralized Exception Handling

## Status

Accepted

## Decision

HTTP error translation is centralized in `api/exception_handler`, fed by a custom exception hierarchy rooted in `DomainError`.

### Exception Hierarchy

- All domain errors inherit from a base `DomainError` (carrying `message` and `code`) defined in the `core`/domain layer
- Typed subclasses represent domain concepts: `BusinessError`, `NotFoundError`, `ConflictError`, `ValidationError`, `AuthorizationError`
- The API layer maps each exception type to an HTTP status code via a single mapping table (e.g. `BusinessError` → 400, `NotFoundError` → 404, `AuthorizationError` → 403, `ConflictError` → 409, `ValidationError` → 422; unmapped → 500)

### Rules

- NEVER expose stack traces, internal paths, or system details in API responses
- NEVER catch generic `Exception` without logging and re-raising (or wrapping in a domain error)
- Use `raise ... from err` to preserve exception chains for debugging

## Consequences

- Error responses stay semantic and consistent
- Internal details are not leaked
- Dependency failures can be mapped in a single place
- New error types are added by extending the hierarchy and the mapping table
