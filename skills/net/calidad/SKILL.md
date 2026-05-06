---
name: net-calidad
description: "Use when code quality needs to be checked — linting, conventions, patterns, and coding standards compliance"
---

---
name: calidad
description: "Quality gates — testing and automatic validation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Quality — Testing and Automatic Validation

This skill is automatically activated when writing tests, validations, or quality checks.

## Mandatory AAA Pattern

All tests must follow the **Arrange-Act-Assert** pattern explicitly:

1. **Arrange** — Prepare the initial state: create objects, configure mocks, set up input data.
2. **Act** — Execute the action under test: invoke the method or service being tested.
3. **Assert** — Verify the result: check return values, states, exceptions, or interactions.

Separate each section with a `// Arrange`, `// Act`, `// Assert` comment for readability.

## Naming Convention

Name each test method with the format:

```
Method_Scenario_ExpectedResult
```

Examples:
- `GetUserById_UserExists_ReturnsUserDto`
- `CreateOrder_InvalidQuantity_ThrowsBusinessException`
- `DeleteProduct_ProductNotFound_ReturnsFalse`

The name must be self-documenting: reading it should convey what is being tested, under what condition, and what is expected.

## Test Attributes

- **`[Fact]`** — For individual test cases without parameters.
- **`[Theory]`** with **`[InlineData]`** — For parameterized tests with inline values.
- **`[Theory]`** with **`[MemberData]`** — For parameterized tests with complex data sets defined in static properties or methods.

Choose `[Theory]` when the same behavior is verified with multiple inputs. Do not duplicate tests that only vary in input data.

## One Behavior per Test

- Each test verifies **one single behavior** or scenario.
- Do not combine multiple assertions testing different behaviors in the same test.
- If a test needs multiple asserts, they must all verify facets of the **same** result.

## Mocking with Moq

- Use **Moq** to create mocks of interfaces and dependencies.
- Configure only the interactions relevant to the current test.
- Use `It.IsAny<T>()` when the exact value is not relevant to the test.
- Verify interactions with `mock.Verify()` only when the interaction is part of the expected behavior.
- Do not verify interactions that are internal implementation details.

## Assertions with FluentAssertions

- Use **FluentAssertions** for all assertions.
- Prefer expressive and readable assertions:
  - `result.Should().NotBeNull()`
  - `result.Should().BeEquivalentTo(expected)`
  - `action.Should().ThrowAsync<BusinessException>()`
  - `list.Should().HaveCount(3)`
  - `value.Should().BeInRange(1, 10)`
- Do not use `Assert.Equal`, `Assert.True`, or native xUnit assertions.

## Test Doubles in Double.Tests/

Organize test helper objects in the `Double.Tests/` folder with the following classification:

- **Dummy** — Objects passed as parameters but not used. They serve to complete signatures.
- **Stub** — Objects with predefined responses. They return fixed data without logic.
- **Mock** — Objects that verify interactions. They are configured with expectations.
- **Fake** — Simplified functional implementations (e.g., in-memory repository).
- **Spy** — Objects that record received calls for later inspection.

Use the appropriate category based on the test double's purpose.

## Unit Test Scope

- Unit tests target **exclusively** Application layer services.
- Do not unit test controllers, infrastructure, or Core entities in isolation (unless there is complex domain logic).
- Mock all infrastructure dependencies (repositories, external services, loggers).
- The service under test is instantiated directly with its injected mocks.

## Architecture Tests with NetArchTest

- Use **NetArchTest** to validate that inter-layer dependencies are correct.
- Verify that:
  - Core does not depend on any other layer.
  - Application only depends on Core.
  - Infrastructure depends on Core and Application, never on Initialization.
  - No circular dependencies exist.
- Run architecture tests after any structural change (new class, new project, reorganization).

## CI Execution Order

The continuous integration pipeline runs tests in this strict order:

1. **Architecture Tests** — Validate the dependency structure. If they fail, do not continue.
2. **Unit Tests** — Validate business logic. If they fail, do not continue.
3. **Integration Tests** — Validate interaction between real components.

Respect this order when running tests locally as well.

## Quality Gates

- **All tests must pass** before proceeding with any merge, deployment, or delivery.
- If a test fails, investigate and fix before continuing with other tasks.
- After any structural change, run architecture tests to confirm layer rules are maintained.
- Do not disable or ignore tests (`[Skip]`) without documented justification.

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/testing-policy.md`** — Testing policy (absolute priority)
- **`.cloud/policies/coding-standards.md`** — Code standards (naming, structure)

In case of any doubt or conflict between this skill and the policies, **policies win**.
