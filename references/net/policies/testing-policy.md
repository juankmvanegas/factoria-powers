# Testing Policy

> **Mandatory**: All production code must have tests. No code is delivered without tests. This policy is not optional and cannot be skipped by user request.

Extracted from the blueprint `ing-dnc-bms-clean` and agent definitions.

## 1. Test Organization

### Project Structure
```
Tests/
  Architecture.Tests/          - Architecture rule validation
    CheckArchitectureRules.cs
  Double.Tests/                - Shared test doubles
    Application.Common.Tests/  - Common helper test utilities
    Application.DTOs.Tests/    - DTO test data generators
    Core.Tests/Entities/       - Entity test data generators
    Dummy/                     - Objects passed but never used
    Fake/                      - Working in-memory implementations
    Mocks/                     - Objects with behavioral expectations
    Spy/                       - Objects that record interactions
    Stubs/                     - Objects with predetermined responses
  Unit.Tests/                  - Unit tests
    Application/
      Services/
        Compound/              - Compound service tests
        Simple/                - Simple service tests
  Integration.Tests/           - Integration tests
    Inicialization.Tests/
      CronJobService.Tests/
      GrpcApiService.Tests/
      MessagingService.Tests/
      RestApiService.Tests/
```

## 2. Testing Frameworks

| Package | Version | Purpose |
|---|---|---|
| xUnit | 2.6.6 | Test framework |
| Moq | 4.18.4 | Mocking library |
| FluentAssertions | 6.12.0 | Assertion library |
| NetArchTest.Rules | 1.3.2 | Architecture testing |
| TngTech.ArchUnitNET.xUnit | 0.10.6 | Architecture testing (ArchUnit) |
| ComplexityAnalyzer | 1.0.0 | Code complexity analysis |

## 3. Mandatory Rules

### AAA Pattern
Every test must follow Arrange-Act-Assert:
```csharp
[Fact]
public void GetNote_WhenNoteExists_ReturnsNoteOutput()
{
    // Arrange
    var mockRepo = new Mock<INotasRepository>();
    mockRepo.Setup(r => r.GetById(It.IsAny<string>()))
        .Returns(NotesStub.ValidNote());
    var service = new NotesService(mockRepo.Object, _mapper, _logger);

    // Act
    var result = service.GetNote("123");

    // Assert
    result.Should().NotBeNull();
    result.Title.Should().Be("Test Note");
}
```

### Test Naming
- Format: `Method_Scenario_ExpectedResult`
- Examples:
  - `CreateNote_WithValidInput_ReturnsCreatedNote`
  - `DeleteNote_WhenNotFound_ThrowsBusinessException`
  - `GetAllNotes_WhenEmpty_ReturnsEmptyList`

### Test Attributes
- `[Fact]` for single-case tests
- `[Theory]` with `[InlineData]` or `[MemberData]` for parameterized tests

### What to Test
- **Application services** (Simple and Compound) - primary test target
- **Architecture rules** - layer dependency validation
- **DTOs and Mappings** - AutoMapper profile correctness

### What NOT to Test (in unit tests)
- Infrastructure implementations (use test doubles instead)
- Controllers directly (covered by integration tests)
- Framework code

## 4. Test Doubles Usage

| Type | When to Use | Example |
|---|---|---|
| Dummy | Parameter needed but not used | Empty logger passed to a service |
| Stub | Provide predetermined responses | Repository returning fixed entity |
| Mock | Verify behavior/interactions | Verify repository was called with correct params |
| Fake | Working simplified implementation | In-memory repository |
| Spy | Record calls for later verification | Logger that stores log entries |

### Rules
- Doubles live in `Double.Tests/` project, shared across test projects
- Use Moq for mocking interfaces
- Use FluentAssertions for all assertions
- One behavior per test method

## 5. Architecture Tests

### Required Rules in `CheckArchitectureRules.cs`
1. Core must not reference Application, Infrastructure, or Initialization assemblies
2. Application must not reference Infrastructure or Initialization assemblies
3. Infrastructure must not reference Initialization assemblies
4. Core must have no NuGet package dependencies
5. Naming convention validation

## 6. CI/CD Integration
- All tests run as gates before deployment
- Test execution order: Architecture Tests -> Unit Tests -> Integration Tests
- Test failures block the pipeline
- Code coverage reporting mandatory (minimum defined by the team)

## 7. Test Design Spreadsheet
- `Dev/DesignUnitTest/NombreFuncionalidad.xlsx` provides a template for test case design
- Teams should document test cases before implementation
