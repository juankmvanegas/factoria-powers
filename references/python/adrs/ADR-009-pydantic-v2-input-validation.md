# ADR-009: Pydantic v2 for Input Validation

## Status
Accepted

## Date
2025-06-01

## Context
API input validation is critical for security, data integrity, and a good developer experience. We need a validation framework that integrates natively with FastAPI, generates OpenAPI documentation automatically, and provides comprehensive validation capabilities including custom validators and cross-field validation.

## Decision
We adopt **Pydantic v2** `BaseModel` for all input validation at the API boundary.

### Validation Strategy

- All incoming request data (body, query params, path params) is validated via Pydantic models
- Validation happens at the API layer BEFORE data reaches the Application layer
- Field-level validators handle simple rules (length, range, pattern)
- Model-level validators handle cross-field validation (date ranges, conditional fields)

```python
from pydantic import BaseModel, Field, field_validator, model_validator

class NoteCreateInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1, max_length=10000)
    tags: list[str] = Field(default_factory=list, max_length=10)
    due_date: date | None = None

    @field_validator("tags")
    @classmethod
    def validate_tag_format(cls, v: list[str]) -> list[str]:
        for tag in v:
            if not tag.strip():
                raise ValueError("Tags must not be empty strings")
        return [tag.strip().lower() for tag in v]

    @model_validator(mode="after")
    def validate_due_date_is_future(self) -> Self:
        if self.due_date and self.due_date < date.today():
            raise ValueError("Due date must be in the future")
        return self
```

### Key Design Decisions

- Pydantic v2 (not v1) for performance improvements (Rust-based core)
- `Field()` for declarative constraints (min/max length, regex, numeric ranges)
- `@field_validator` for single-field custom validation
- `@model_validator` for cross-field validation
- Automatic OpenAPI schema generation from Pydantic models
- `model_config = ConfigDict(strict=True)` for strict type coercion where needed

## Consequences
### Positive
- FastAPI natively integrates Pydantic — zero configuration needed for request parsing
- Automatic OpenAPI/Swagger documentation from model schemas
- Pydantic v2 is 5-50x faster than v1 thanks to Rust core
- Comprehensive validation with clear, structured error messages
- Type-safe: IDE autocompletion and mypy support out of the box

### Negative
- Pydantic validation error messages may need customization for user-facing APIs
- Complex validation logic can make models verbose
- v2 has breaking changes from v1 — third-party libraries must support v2

### Neutral
- Pydantic v2 is the industry standard for Python data validation
- Models serve as both validation and documentation (single source of truth)
