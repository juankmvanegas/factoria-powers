# Skill: Generate Feature Tests

## Purpose
Generate a complete test suite for a new or existing Application layer service,
following the project's testing policy and conventions.

## When to Use
- After creating a new service in `Application/Services/Simple/` or `Application/Services/Compound/`
- When adding new methods to existing services
- When refactoring services and tests need updating

## Inputs Required
1. **Service name** - The Application service to test (e.g., `NotesService`)
2. **Service layer** - `Simple` or `Compound`
3. **Methods to test** - List of methods with expected behaviors
4. **Dependencies** - Interfaces the service depends on (for mocking)

## Output Structure
```
Tests/
  Double.Tests/
    Stubs/[Entity]Stubs.cs        - Stub data for the entity
    Mocks/[Entity]Mocks.cs        - Mock setup helpers (if needed)
  Unit.Tests/
    Application/
      Services/
        [Simple|Compound]/
          [Service]Tests.cs       - xUnit test class
```

## Rules
1. Follow AAA pattern (Arrange-Act-Assert)
2. Use `[Fact]` for single cases, `[Theory]` for parameterized
3. Name tests: `Method_Scenario_ExpectedResult`
4. One behavior per test
5. Use Moq for interface mocking
6. Use FluentAssertions for assertions
7. Create test doubles in `Double.Tests/` if they don't exist
8. Mock Infrastructure interfaces, never concrete classes
9. Test both success and failure paths
10. Test `BusinessException` throwing scenarios

## Process
1. Read the service source code
2. Identify all public methods and their dependencies
3. Identify all possible scenarios (happy path, error cases, edge cases)
4. Generate stub data in `Double.Tests/Stubs/`
5. Generate the test class in `Unit.Tests/`
6. Verify test compiles and follows naming conventions
