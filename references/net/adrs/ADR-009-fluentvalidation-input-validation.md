# ADR-009: FluentValidation for Input Validation

## Status
Accepted

## Date
2023-04-19

## Context
API input validation must be consistent, testable, and separated from controller logic.

## Decision
Use FluentValidation at the Initialization layer boundary (API entry points).

### Implementation
- Validators in `Initialization/[ServiceType]/Validations/`
- REST API uses `CustomResultFactory` for standardized validation error responses
- gRPC uses validators in service interceptors
- Package: `FluentValidation.AspNetCore` 11.3.0

### Pattern
```csharp
public class NoteInputValidation : AbstractValidator<NoteInput>
{
    public NoteInputValidation()
    {
        RuleFor(x => x.Title).NotEmpty();
        // ...
    }
}
```

## Consequences
- Validation rules are co-located with the API layer, not in Application
- Validators are auto-registered via DI
- Validation errors return standardized error responses
- Business validation (domain rules) stays in Application layer via `BusinessException`
