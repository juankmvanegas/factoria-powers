---
name: net-generate-tests
description: "Use when new code has been written and tests need to be generated or a service/component needs full test coverage"
---

---
name: generate-tests
description: "Generate test suite for an Application service"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate a complete unit test suite for an Application layer service, including test doubles and tests following the AAA pattern.

## Required Input

Request from the user:

1. **Service name**: (e.g., `OrderService`, `UserService`)
2. **Layer**: Simple (one repository) or Compound (multiple services/repositories)
3. **Methods to test**: (if not specified, test all public methods)
4. **Dependencies**: (can be discovered by reading the code)

If the user only provides the service name, read the code to automatically discover the layer, methods, and dependencies.

## Execution Flow

### Step 1: Service Analysis

1. Locate the service in `Application/Services/Simple/` or `Application/Services/Compound/`
2. Read the complete class
3. Identify:
   - All injected dependencies (constructor)
   - All public methods
   - Return types
   - Exceptions it can throw
   - Validations it performs
   - Alternative flows (edge cases)

### Step 2: Create Test Doubles

In `{Project}.Double.Tests/`:

1. **Repository fakes** if they don't exist:
   ```csharp
   public class Fake{Entity}Repository : I{Entity}Repository
   {
       private readonly List<{Entity}> _items = new();
       // Implement CRUD methods over in-memory list
   }
   ```

2. **Entity builders** if they don't exist:
   ```csharp
   public class {Entity}Builder
   {
       private {Entity} _entity = new();

       public {Entity}Builder With{Property}({type} value) { ... return this; }
       public {Entity} Build() => _entity;
   }
   ```

### Step 3: Create Unit Tests

In `{Project}.Unit.Tests/`:

Create `{ServiceName}Tests.cs` with the following structure:

```csharp
public class {ServiceName}Tests
{
    private readonly Mock<I{Dependency1}> _{dependency1}Mock;
    private readonly Mock<I{Dependency2}> _{dependency2}Mock;
    private readonly {ServiceName} _sut;

    public {ServiceName}Tests()
    {
        _{dependency1}Mock = new Mock<I{Dependency1}>();
        _{dependency2}Mock = new Mock<I{Dependency2}>();
        _sut = new {ServiceName}(_{dependency1}Mock.Object, _{dependency2}Mock.Object);
    }
}
```

For each public method, generate tests covering:

#### Base Cases (Happy Path)
- `{Method}_WhenValidInput_Returns{Expected}`
- `{Method}_WhenValidInput_Calls{Dependency}`

#### Error Cases
- `{Method}_WhenNullInput_ThrowsArgumentNullException`
- `{Method}_When{Entity}NotFound_Throws{Entity}NotFoundException`
- `{Method}_WhenInvalidState_ThrowsBusinessException`

#### Edge Cases
- `{Method}_WhenEmptyCollection_ReturnsEmpty`
- `{Method}_WhenDuplicate_ThrowsDuplicateException`
- Others based on the service's logic

### Step 4: Test Conventions

Each test MUST follow:

1. **Naming**: `Method_Scenario_ExpectedResult`
   ```csharp
   [Fact]
   public async Task GetById_WhenEntityExists_ReturnsEntity()
   ```

2. **AAA Pattern**:
   ```csharp
   // Arrange
   var entity = new {Entity}Builder().WithId(1).Build();
   _{repoMock}.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(entity);

   // Act
   var result = await _sut.GetByIdAsync(1);

   // Assert
   result.Should().NotBeNull();
   result.Id.Should().Be(1);
   ```

3. **One behavior per test**: Each test validates ONE single thing.

4. **FluentAssertions**: Use `.Should()` for all assertions.

5. **Moq**: Use `Mock<T>` for all dependencies.

### Step 5: Integration Tests (if connection string available)

If the Task prompt includes a connection string for integration tests:

1. Verify that the `Integration.Tests/` project exists
   - If it doesn't exist, create it with references to Infrastructure and Application
2. Configure the connection string:
   - **Preferred**: user secrets → `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "{value}" --project tests/Integration.Tests/`
   - **Alternative**: `appsettings.Testing.json` → add to `.gitignore`
3. Create `IntegrationTestBase.cs` with `WebApplicationFactory` or `ServiceCollection` setup using the real connection string
4. Generate integration tests for repositories/adapters that touch the DB:
   - `{Repository}_WhenInsert_PersistsToDatabase`
   - `{Repository}_WhenQuery_ReturnsFromDatabase`
5. **NEVER** commit the connection string to the repository

If there is NO connection string:
- Use `UseInMemoryDatabase("TestDb")` for basic integration tests
- Document that a real connection string is needed for complete tests

### Step 6: Verification

1. Run `dotnet build` on the test projects
2. Run `dotnet test` to verify all pass
3. Report coverage: number of methods covered vs total

## Rules

- NEVER create tests that depend on execution order
- NEVER test internal implementations — only public behavior
- ALWAYS one behavior per test
- ALWAYS use AAA pattern
- ALWAYS use naming `Method_Scenario_ExpectedResult`
- ALWAYS use Moq for mocking in unit tests
- ALWAYS use FluentAssertions for assertions
- ALWAYS verify both happy path and error cases
- Test doubles are reused across tests — do not duplicate
- Unit tests: NEVER depend on external state (DB, files, network) — everything mocked
- Integration tests: ONLY if a connection string is provided — use real DB but NEVER commit credentials

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/testing-policy.md`** — Testing policy (absolute priority)

In case of any doubt or conflict between this skill and the policy, **the policy wins**.
