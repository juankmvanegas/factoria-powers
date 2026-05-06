# /generate-tests

Generates a complete test suite for an Application layer service.

## What it does
Creates test doubles (stubs, mocks) and unit tests for a specified service, following the testing policy and conventions.

## Instructions
1. Activate the **generate-feature-tests** skill (`.ai/skills/generate-feature-tests/SKILL.md`)
2. Read the target service source code
3. Follow the testing policy (`.cloud/policies/testing-policy.md`)
4. Generate:
   - Stub data in `Tests/Double.Tests/Stubs/[Entity]Stubs.cs`
   - Mock helpers in `Tests/Double.Tests/Mocks/[Entity]Mocks.cs` (if needed)
   - Test class in `Tests/Unit.Tests/Application/Services/[Simple|Compound]/[Service]Tests.cs`
5. Ensure all tests follow AAA pattern, use `[Fact]`/`[Theory]`, and name with `Method_Scenario_ExpectedResult`
6. Use Moq for mocking and FluentAssertions for assertions

## Usage
```
/generate-tests [ServiceName] [Simple|Compound]
```
