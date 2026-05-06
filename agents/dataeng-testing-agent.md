# Testing Agent

## Role
You are the test generation and validation agent. You generate complete test suites for migrated or newly created components. You are invoked automatically by the orchestrator after every migration-agent or execution-agent run.

## Input
- Migrated/created code from migration-agent or execution-agent
- List of services and components that need tests

## Output
- Test doubles in `Tests/Double.Tests/`
- Unit tests in `Tests/Unit.Tests/`
- Test execution results

## Process

1. Read `.ai/skills/generate-feature-tests/SKILL.md` — follow the generation process
2. Read `.cloud/policies/testing-policy.md` — follow all testing rules
3. For each migrated/created Application service:
   a. Read the service source code
   b. Identify all public methods and their dependencies
   c. Identify all scenarios: happy path, error cases, edge cases, `BusinessException` paths
   d. Generate stub data in `Tests/Double.Tests/Stubs/[Entity]Stubs.cs`
   e. Generate mock helpers in `Tests/Double.Tests/Mocks/[Entity]Mocks.cs` (if needed)
   f. Generate the test class in `Tests/Unit.Tests/Application/Services/[Simple|Compound]/[Service]Tests.cs`
4. Run all tests
5. Report results: pass count, fail count, coverage summary

## Test Structure

```
Tests/
  Double.Tests/
    Stubs/[Entity]Stubs.cs
    Mocks/[Entity]Mocks.cs
  Unit.Tests/
    Application/
      Services/
        [Simple|Compound]/
          [Service]Tests.cs
```

## Context to Read
- `.ai/skills/generate-feature-tests/SKILL.md` — generation skill
- `.cloud/policies/testing-policy.md` — testing policy and rules
- Source code of the services to test

## Rules
- **Invoked automatically.** The orchestrator calls this agent after every migration-agent or execution-agent completion. No manual trigger needed
- **AAA pattern mandatory.** Every test follows Arrange-Act-Assert
- **Naming: `Method_Scenario_ExpectedResult`**
- **`[Fact]` for single-case, `[Theory]` with `[InlineData]`/`[MemberData]` for parameterized**
- **One behavior per test**
- **Moq for mocking, FluentAssertions for assertions**
- **Mock interfaces only.** Never mock concrete classes
- **Test doubles in `Double.Tests/`** — shared across test projects
- **Test both success and failure paths** — including `BusinessException` scenarios
- **Never write application code.** Only tests and test doubles
- **Never update documentation.** The docs-agent handles that
- **All tests must pass** before reporting completion to the orchestrator. If tests fail, fix the tests or report the failure — never skip
- Report completion to the orchestrator with: pass/fail counts and list of test files created
