# ADR-013: BusinessException Pattern for Error Handling

## Status
Accepted

## Date
2023-04-19

## Context
Error handling must be consistent across all services, with clear separation
between business errors and technical errors.

## Decision
Use a custom `BusinessException` pattern with typed exception categories.

### Implementation
- `BusinessException` in `Application/Common/Helpers/Exceptions/`
- `BusinessExceptionTypes` - Enum of exception categories
- `CommonExceptions` - Predefined common exception instances

### Error Flow
1. Application services throw `BusinessException` for business rule violations
2. REST API: `FilterExceptionAttribute` catches and formats the response
3. REST API: `ExceptionMiddleware` catches unhandled exceptions
4. gRPC: `ExceptiongRPCInterceptor` translates to gRPC status codes

### REST API Error Response
- `ServiceError` utility in `Application/Common/Utilities/` standardizes error format
- `SuccessFilterAttribute` wraps successful responses in standard envelope

## Consequences
- Business errors are typed and predictable
- Technical errors are caught by middleware/interceptors
- Error responses follow a standard format across all service types
- Security policy compliance: error messages never expose system internals
