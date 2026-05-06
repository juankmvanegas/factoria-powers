# ADR-013: Custom Exception Hierarchy

## Status
Accepted

## Date
2025-06-01

## Context
Python's built-in exceptions are too generic for domain-specific error handling. FastAPI's default exception handling exposes implementation details in error responses. We need a structured exception hierarchy that represents domain concepts, maps cleanly to HTTP status codes, and prevents information leakage in API responses.

## Decision
We adopt a **custom exception hierarchy** rooted in `DomainError`, defined in the Domain layer and mapped to HTTP responses in the API layer.

### Exception Hierarchy

```python
# domain/exceptions/base.py
class DomainError(Exception):
    """Base exception for all domain errors."""
    def __init__(self, message: str, code: str = "DOMAIN_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(message)

class BusinessError(DomainError):
    """Business rule violation."""
    def __init__(self, message: str) -> None:
        super().__init__(message, code="BUSINESS_ERROR")

class NotFoundError(DomainError):
    """Requested resource does not exist."""
    def __init__(self, resource: str, identifier: str) -> None:
        super().__init__(
            f"{resource} with identifier '{identifier}' was not found",
            code="NOT_FOUND",
        )

class ConflictError(DomainError):
    """Operation conflicts with current state."""
    def __init__(self, message: str) -> None:
        super().__init__(message, code="CONFLICT")

class ValidationError(DomainError):
    """Domain validation failed."""
    def __init__(self, message: str) -> None:
        super().__init__(message, code="VALIDATION_ERROR")

class AuthorizationError(DomainError):
    """Insufficient permissions."""
    def __init__(self, message: str = "Insufficient permissions") -> None:
        super().__init__(message, code="AUTHORIZATION_ERROR")
```

### HTTP Mapping (API Layer)

```python
# api/exception_handlers.py
EXCEPTION_STATUS_MAP: dict[type[DomainError], int] = {
    BusinessError: 400,
    NotFoundError: 404,
    AuthorizationError: 403,
    ConflictError: 409,
    ValidationError: 422,
}

async def domain_exception_handler(request: Request, exc: DomainError) -> JSONResponse:
    status_code = EXCEPTION_STATUS_MAP.get(type(exc), 500)
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )
```

### Rules

- All domain errors MUST inherit from `DomainError`
- NEVER expose stack traces, internal paths, or system details in API responses
- NEVER catch generic `Exception` without logging and re-raising (or wrapping in a domain error)
- API exception handlers produce a consistent error envelope
- Use `raise ... from err` to preserve exception chains for debugging

## Consequences
### Positive
- Clean separation between domain errors and HTTP concerns
- Consistent error response format across all endpoints
- No information leakage — internal details stay in server logs
- Easy to add new error types by extending the hierarchy
- Exception handlers centralize error-to-HTTP mapping

### Negative
- Custom exceptions add boilerplate compared to using built-in exceptions
- Developers must choose the correct exception type (not always obvious)
- Mapping table must be updated when new exception types are added

### Neutral
- The pattern mirrors the exception handling in the .NET factory (replacing C# exception filters)
- Error codes in responses enable client-side error handling without parsing messages
