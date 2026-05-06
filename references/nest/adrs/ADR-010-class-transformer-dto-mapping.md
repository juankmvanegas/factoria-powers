# ADR-010: class-transformer for DTO Mapping

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF constantly transforms data between frontend request DTOs, backend service objects, and frontend response DTOs. A consistent, declarative approach to serialization prevents manual mapping errors, reduces boilerplate, and ensures sensitive data is never accidentally exposed. `class-transformer` integrates natively with NestJS and works alongside `class-validator` (ADR-009).

## Decision
Use `class-transformer` for all DTO transformations:

- **Whitelist serialization**: `@Exclude()` at class level with explicit `@Expose()` per property. Properties are hidden by default via `excludeExtraneousValues: true`.
- Core decorators: `@Expose()`, `@Exclude()`, `@Type()` for nested objects, `@Transform()` for custom logic.
- Transformation functions: `plainToInstance()` for deserialization, `instanceToPlain()` for serialization.
- Transformation locations: controllers (request-to-command, result-to-response), infrastructure services (backend response-to-model), use cases work with application types only.
- ALL response DTOs must use `@Exclude()` + `@Expose()`. NEVER return raw backend responses to frontend.

## Consequences
- Whitelist approach prevents accidental exposure of sensitive data
- Declarative transformation is more maintainable than manual mapping
- class-transformer and class-validator share the same DTOs, reducing duplication
- `excludeExtraneousValues: true` requires `@Expose()` on every property (verbose)
- Transformation errors are silent (missing properties ignored instead of failing)
