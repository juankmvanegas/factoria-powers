# ADR-007: Typed DTOs and Validation

## Status

Accepted

## Decision

Request and response contracts use typed DTOs and validation models compatible with FastAPI, built on **Pydantic v2** `BaseModel`.

### Validation Strategy

- All incoming request data (body, query params, path params) is validated via Pydantic models
- Validation happens at the API layer BEFORE data reaches the Application layer
- `Field()` declares simple constraints (length, range, pattern)
- `@field_validator` handles single-field custom rules; `@model_validator` handles cross-field validation
- Pydantic v2 (not v1) for its Rust-based performance core and automatic OpenAPI schema generation

## Consequences

- API boundaries are explicit
- Validation is centralized near the input boundary
- Use cases receive normalized data
- Models serve as both validation and OpenAPI documentation (single source of truth)
