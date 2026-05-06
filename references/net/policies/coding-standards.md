# Coding Standards

Extracted from the blueprint `ing-dnc-bms-clean` and agent definitions.

## 1. Architecture Standards

### Layer Rules
- **4 layers only:** Core, Application, Infrastructure, Initialization
- No new layers. No renamed layers. No extra abstraction layers.
- Core has zero NuGet dependencies
- Application depends only on Core
- Infrastructure depends on Application + Core
- Initialization depends on all (composition root)

### Dependency Injection
- Each layer has its own DI registration class:
  - `ApplicationDependencyInjection.cs`
  - `InfrastructureDependencyInjection.cs`
  - `ServicesConfiguration.cs` (per initializer)
- Register interfaces to implementations, never concrete-to-concrete

## 2. Naming Conventions

### Projects
- Each layer has its own folder under `src/`: `src/Core/`, `src/Application/`, `src/Infrastructure/`, `src/Initialization/`
- `.csproj` files live INSIDE their layer folder: `src/Core/Core.csproj`, `src/Application/Application.csproj`, `src/Infrastructure/Infrastructure.csproj`
- Initializers: `src/Initialization/[Type]Service.[ServiceName]/[Type]Service.[ServiceName].csproj`
  - Types: `RestApiService`, `GrpcApiService`, `MessagingService`, `CronJobService`
  - ALL initialization types go inside ONE SINGLE `Initialization/` folder

### Namespaces
```
Core.Entities
Core.Enumerations
Application.Services.Simple
Application.Services.Compound
Application.DTOs.[EntityName]
Application.Interfaces.Services
Application.Interfaces.Infrastructure
Application.Common.Helpers
Application.Common.Utilities
Infrastructure.Services.[Provider]
```

### Classes
| Type | Convention | Example |
|---|---|---|
| Entity | Singular or plural domain noun | `Notes`, `NoteLists` |
| Use case interface | `I[Entity][Action]UseCase` | `INotesUseCase` |
| Service | `[Entity]Service` | `NotesService` |
| Repository interface | `I[Entity]Repository` | `INotasRepository` |
| Adapter interface | `I[Name]Adapter` | `IFirebaseAdapter` |
| DTO Input | `[Entity]Input` | `NoteInput`, `ModifiedNoteInput` |
| DTO Output | `[Entity]Output` | `NoteOutput`, `SimplifiedNoteOutput` |
| Controller | `[Entity]Controller` | `NotesController` |
| Subscription | `[Entity]Subscription[Type]` | `NotesSubscriptionCommand` |
| Validator | `[Entity]InputValidation` | `NoteInputValidation` |
| Filter | `[Name]Attribute` | `FilterExceptionAttribute` |

### Methods
- Async methods use `async/await` pattern
- Repository methods follow CRUD naming
- Use case methods describe business operations

## 3. Code Style

### Enforced via `.editorconfig` and `.globalconfig`
- Follows Microsoft C# coding conventions
- Access modifiers: always explicit
- `var` usage: when type is evident
- Nullable reference types: enabled per project

### Patterns Required
- Controllers for REST endpoints (not Minimal APIs)
- Interface-based dependency injection
- Unit of Work for SQL Server transactions
- Generic repository for basic CRUD
- Specific adapters for specialized data access
- AutoMapper profiles for all entity-DTO mappings

## 4. Service Patterns

### Simple Services
- Single-responsibility use cases
- Depend on repository interfaces
- Inject `IManageLogs` for logging
- Throw `BusinessException` for business errors

### Compound Services
- Orchestrate multiple simple services or repositories
- Used when a use case spans multiple aggregates

### Configuration Pattern (all initializers)
```csharp
// ConfigurationExtensions.cs - App/host configuration
public static class ConfigurationExtensions
{
    public static void AddCustomConfiguration(this IHostBuilder hostBuilder) { }
}

// ServicesConfiguration.cs - DI service registration
public static class ServicesConfiguration
{
    public static void AddCustomServices(this IServiceCollection services, IConfiguration configuration) { }
}
```

### Program.cs Startup Contract (mandatory)
`Program.cs` is only the composition root. It orchestrates startup and delegates registration to extension classes.

Required order for every Initialization project:

1. Create `WebApplicationBuilder` or `HostApplicationBuilder`.
2. Load local non-secret configuration (`appsettings.json`, `appsettings.{Environment}.json`, environment variables).
3. Add dynamic configuration providers such as `AddMongoProvider` when required.
4. Call `ResolveSecrets` against the final configuration.
5. Register `ApplicationDependencyInjection`.
6. Register `InfrastructureDependencyInjection` with the resolved configuration.
7. Register initializer-specific services through `ServicesConfiguration`.
8. Build and configure the middleware/endpoints/subscriptions/jobs.
9. Run the app/host asynchronously with `await app.RunAsync()` or `await host.RunAsync()`.

`ResolveSecrets` MUST happen before any service registration that reads `ConnectionStrings`, Service Bus settings, certificates, API keys, or provider credentials.

Prohibited in `Program.cs`:
- Business logic
- Repository/adapter implementation details
- Hardcoded URLs, keys, tokens, passwords, or connection strings
- Direct DI registrations for Application or Infrastructure services when the layer already owns a DI extension
- Minimal API endpoint definitions in REST initializers
- Global `try/catch` wrapping builder creation, DI registration, `Build`, or `RunAsync`
- Synchronous host execution with `app.Run()` or `host.Run()`

## 5. Error Handling
- Business errors: `BusinessException` with `BusinessExceptionTypes`
- API errors: `FilterExceptionAttribute` (REST), `ExceptiongRPCInterceptor` (gRPC)
- Unhandled errors: `ExceptionMiddleware` (REST)
- Never expose system details in error messages (security policy)

## 6. Logging
- Use `IManageLogs` interface, never static loggers
- Structured logging via Serilog
- All log entries must include: timestamp, origin, severity, description

## 7. Configuration
- `appsettings.json` for structure and non-secret defaults
- Azure Key Vault for secrets (resolved at startup via `ResolveSecrets`)
- MongoDB Configuration Provider for dynamic configuration
- `AddMongoProvider` at startup for remote config

## 8. CHANGELOG
- Every release must update `CHANGELOG.md`
- Follow Keep a Changelog format: Added, Fixed, Changed, Removed

## 9. Sonar Standards

- Cyclomatic complexity must stay **below 10** per method
- Cognitive complexity must stay **below 15** per method
- Avoid nesting deeper than **3 levels**
- Do not leave dead code, unused variables, duplicated branches, or unreachable paths
- Do not leave commented-out code
- Do not add source-code comments to explain routine logic; prefer self-documenting names and extractions
- If a method exceeds Sonar thresholds, split responsibilities into smaller private methods or collaborators
