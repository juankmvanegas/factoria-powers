# Testing Policy

These testing rules are mandatory for Factoria-Pyt.

## Unit Tests

- Application use cases must have unit tests
- Core rules must have unit tests whenever domain behavior exists
- Use pytest as the default framework
- Follow Arrange, Act, Assert

## Scope

- Tests mirror the solution structure by layer
- `tests/application.Tests` validates use case orchestration
- `tests/core.Tests` validates entities, rules, and domain exceptions

## Quality Gates

- Every code change must leave the affected tests passing
- New features require new tests or explicit justification
- Migration steps must add tests as the destination design stabilizes

## Error Cases

- Validate expected exceptions and semantic error mapping
- Cover dependency failure paths when the use case relies on external integrations

## Documentation

- If a behavior changes, update the technical documentation and the API contract when applicable
