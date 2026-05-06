# ADR-011: xUnit with Test Doubles Pattern for Testing

## Status
Accepted

## Date
2023-09-08 (Blueprint v2.0.0)

## Context
Automated testing was added as a practice requirement. The organization needed a standardized
approach to test structure and test double management.

## Decision
Use xUnit as the testing framework with a structured test doubles organization.

### Test Projects
| Project | Purpose |
|---|---|
| `Unit.Tests` | Application layer service tests (Simple + Compound) |
| `Double.Tests` | Shared test doubles for all test projects |
| `Integration.Tests` | Per-initializer integration tests |
| `Architecture.Tests` | Structural architecture validation |

### Test Doubles Organization (`Double.Tests`)
```
Double.Tests/
  Application.Common.Tests/    - Common helper test utilities
  Application.DTOs.Tests/      - DTO test data
  Core.Tests/Entities/         - Entity test data
  Dummy/                       - Objects with no behavior
  Fake/                        - Working implementations (in-memory)
  Mocks/                       - Objects with expectations (Moq)
  Spy/                         - Objects that record calls
  Stubs/                       - Objects with predetermined responses
```

### Testing Rules
- AAA pattern (Arrange-Act-Assert) mandatory
- `[Fact]` for single-case tests, `[Theory]` for parameterized
- One behavior per test
- Behavior-oriented naming: `Method_Scenario_ExpectedResult`
- FluentAssertions for assertions
- Moq for mocking interfaces

### What Gets Tested
- Application services (business logic)
- Infrastructure is doubled (never directly tested in unit tests)
- Architecture rules (layer dependency validation)

## Consequences
- All test doubles shared via `Double.Tests` project
- Unit tests focus exclusively on Application layer
- Integration tests are per-initializer
- Architecture tests run in CI/CD to prevent violations
