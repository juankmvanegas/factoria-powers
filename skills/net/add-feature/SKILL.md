---
name: net-add-feature
description: "Use when the user wants to add a new feature, endpoint, component, or module to the current project"
---

---
name: add-feature
description: "Add a new feature following the strict layer execution order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Add a new feature to the project strictly following the Clean Architecture layer execution order. Each step must be completed before moving to the next.

## Execution Flow — 6 Strict Steps

### Step 1: Core (Entities and Contracts)

Create in `{Project}.Core/`:

1. **Entities** in `Entities/`
   - Properties with correct types
   - Nullable reference types where applicable
   - No persistence logic
   - No external dependencies

2. **Interfaces** in `Interfaces/`
   - `I{Entity}Repository` with base CRUD methods
   - Additional service interfaces if applicable

3. **Enums** in `Enums/` if applicable

4. **Domain exceptions** in `Exceptions/` if applicable

### Step 2: Application (Services and DTOs)

Create in `{Project}.Application/`:

1. **DTOs** in `DTOs/`
   - Request DTOs (input)
   - Response DTOs (output)
   - NEVER expose entities directly

2. **Service interfaces** in `Interfaces/`
   - `I{Feature}Service` with the feature's methods

3. **Services** in `Services/Simple/` or `Services/Compound/`
   - **Simple**: operates on a single entity/repository
   - **Compound**: orchestrates multiple simple services
   - Constructor dependency injection
   - Input validation
   - Error handling with typed exceptions

4. **Validators** in `Validators/`
   - FluentValidation for each Request DTO
   - Clear validation rules

5. **Mappers** in `Mappers/`
   - Entity ↔ DTO mappings
   - Static methods or extensions

### Step 3: Infrastructure (Persistence and Integrations)

Create in `{Project}.Infrastructure/`:

1. **Repositories** in `Persistence/Repositories/`
   - Implementation of `I{Entity}Repository`
   - Entity Framework Core
   - No business logic

2. **EF Configurations** in `Persistence/Configurations/`
   - `IEntityTypeConfiguration<{Entity}>`
   - Fluent configuration (not data annotations)

3. **External services** in `External/` if applicable

4. **Third-party adapters** in `Services/{Provider}/` if the prompt includes external integration documentation:
   - Implement `I{Provider}Adapter` defined in Application
   - Use `HttpClient` with `IHttpClientFactory` (typed clients)
   - URLs from configuration (`ExternalServices:{Provider}:BaseUrl`), NEVER hardcoded
   - API keys/tokens from Azure Key Vault, NEVER in code
   - If third-party OpenAPI/Swagger was received → generate implementation faithful to the spec
   - If textual description was received → generate implementation as described
   - If no documentation → generate stub with `NotImplementedException` + TODO

5. **Register DI** in `DependencyInjection.cs`
   - Register repositories
   - Register infrastructure services
   - Register third-party adapters with `AddHttpClient<T>` if applicable

### Step 4: API (Controllers and Configuration)

Create in `{Project}.Api/`:

1. **Controller** in `Controllers/`
   - `[ApiController]` and `[Route("api/[controller]")]`
   - Application service injection
   - Async methods
   - Return `ActionResult<T>`
   - Documentation with XML comments

2. **Register DI** in `Program.cs` or configuration file
   - Register Application services

### Step 5: Tests

Create tests in the test projects:

1. **Test Doubles** in `{Project}.Double.Tests/`
   - Fakes/Stubs for repositories
   - Builders for test entities

2. **Unit Tests** in `{Project}.Unit.Tests/`
   - One test class per service
   - Naming: `{Method}_{Scenario}_{ExpectedResult}`
   - AAA pattern (Arrange, Act, Assert)
   - Moq for mocking
   - FluentAssertions for assertions
   - One behavior per test

3. Run all tests: `dotnet test`

### Step 6: Tests and Documentation (Automatic Chain)

After implementing the code:
1. `/generate-tests` runs automatically for created/modified services
2. Run tests: `dotnet test` — all must pass
3. `/documentacion` runs automatically:
   - Updates `CHANGELOG.md` with the new feature
   - Updates API documentation if it exists
   - Creates ADR if an architectural decision was made (via `/generate-adr`)

The chain is: code implemented → `/generate-tests` auto → `/documentacion` auto.

## Auto-Shielding

If any test fails or the build breaks:
1. Read the full error
2. Identify the affected layer (Core, Application, Infrastructure, Initialization)
3. Fix in the corresponding layer
4. Verify build: `dotnet build`
5. Re-run tests: `dotnet test`
6. Document the error and solution (auto-shielding via `/documentacion`)
7. Maximum 3 attempts. If not resolved, STOP and report to the user.

## Rules

- NEVER skip steps or change the order
- NEVER put business logic in Infrastructure or Api
- NEVER expose Core entities directly in the API
- NEVER use data annotations for EF configuration — use Fluent API
- ALWAYS register new dependencies in DI
- ALWAYS create tests for new services
- ALWAYS verify build after each step: `dotnet build`
- ALWAYS run tests at the end: `dotnet test`
- If the service uses multiple repositories, it is a Compound service
- If the service uses a single repository, it is a Simple service
