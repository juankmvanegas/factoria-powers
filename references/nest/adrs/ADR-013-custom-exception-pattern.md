# ADR-013: Custom Exception Pattern

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF interacts with multiple backend services that can fail in different ways (HTTP errors, gRPC errors, timeouts). The frontend needs consistent, predictable error responses regardless of which backend failed. System details (stack traces, internal URLs) must never leak to the frontend.

## Decision
Implement a custom exception hierarchy with global exception handling:

- **8 exception types** in `libs/errors/`: `HttpBusinessError` (409), `HttpInternalError` (500), `HttpNotFoundEntityError` (404), `GrpcBusinessError` (409/gRPC code 9), `GrpcInternalError` (500/gRPC code 13), `GrpcNotFoundEntityError` (404/gRPC code 5), `BadGatewayError` (502), `InitializationError`.
- **CustomExceptionFilter** (api layer) — global filter registered in `main.ts`. Single exit point for all errors. Logs full details internally, returns sanitized response to frontend.
- **HttpErrorInterceptor** (infrastructure layer) — transforms backend HTTP errors into typed BFF exceptions. Used in infrastructure services.
- Error response format: `{ statusCode, errorCode, message, details, timestamp, path }`.

Rules:
- NEVER throw raw `Error` or NestJS `HttpException` — use custom exceptions.
- NEVER expose stack traces, internal URLs, or system details in responses.
- All exceptions logged with full details before sanitization.

## Consequences
- Frontend receives consistent, predictable errors regardless of which backend failed
- System details never exposed, improving security
- Exception hierarchy enables specific handling per error type
- Developers must learn the exception hierarchy
- HttpErrorInterceptor must be kept updated with backend error codes
