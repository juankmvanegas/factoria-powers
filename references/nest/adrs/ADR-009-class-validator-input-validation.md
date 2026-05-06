# ADR-009: class-validator for Input Validation

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
All data entering the BFF must be validated before processing. Invalid or malicious input must be rejected at the API boundary. NestJS integrates natively with `class-validator` through its `ValidationPipe`, providing decorator-based validation co-located with DTO definitions.

## Decision
Use `class-validator` decorators for all input validation:

- **Global ValidationPipe** in `main.ts` with: `whitelist: true` (strip unknown properties), `forbidNonWhitelisted: true` (400 for unknown properties), `transform: true`, `enableImplicitConversion: false` (require explicit `@Type()` decorators).
- ALL request DTOs (body, query, params) must use class-validator decorators.
- Nested objects require `@ValidateNested()` with `@Type()`. Arrays require `@ValidateNested({ each: true })`.
- Custom validators in `application/common/validators/` for application-level rules.
- Validation errors transformed to `HttpBusinessException` via custom `exceptionFactory` (ADR-013).

## Consequences
- Validation rules co-located with DTO definitions
- Global ValidationPipe ensures no endpoint receives unvalidated data
- `whitelist` + `forbidNonWhitelisted` prevents mass-assignment attacks
- Custom validators are reusable across DTOs
- Decorators can make DTOs verbose
- `enableImplicitConversion: false` requires explicit `@Type()` for complex types
