# Current System Architecture

## Overview

The system follows a **Clean Architecture** pattern for .NET 8.0 microservices, organized in a
monorepo blueprint that serves as the canonical reference for all new backend services.

## Architecture Diagram (Conceptual)

```
+------------------------------------------------------------------+
|                        INITIALIZATION LAYER                       |
|  +-------------+ +-------------+ +----------+ +--------------+   |
|  | RestApi     | | GrpcApi     | | Messaging| | CronJob      |   |
|  | Service     | | Service     | | Service  | | Service      |   |
|  | (Controllers| | (gRPC Svc)  | | (SvcBus) | | (Hangfire/   |   |
|  |  Middleware) | | Interceptors| | Subscr.) | |  Coravel)    |   |
|  +------+------+ +------+------+ +----+-----+ +------+-------+   |
|         |               |              |              |           |
+---------|---------------|--------------|--------------|------------+
          |               |              |              |
+---------|---------------|--------------|--------------|------------+
|         v               v              v              v           |
|                     APPLICATION LAYER                             |
|  +-----------------------------------------------------------+   |
|  | Services (Simple / Compound)  | DTOs | Interfaces          |   |
|  | ApplicationDependencyInjection | ManageLogs | Exceptions   |   |
|  | OpenTelemetryInstrumentor | BusinessSettings               |   |
|  +-----------------------------------------------------------+   |
+------------------------------------------------------------------|
          |                                                         |
+---------|---------------------------------------------------------+
|         v              CORE LAYER                                 |
|  +-----------------------------------------------------------+   |
|  | Entities | Enumerations                                    |   |
|  | (Zero external dependencies)                               |   |
|  +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
          ^
+---------|---------------------------------------------------------+
|         |          INFRASTRUCTURE LAYER                            |
|  +-----------------------------------------------------------+   |
|  | MSQLServer (EF Core) | MongoDB | DapperOrm                |   |
|  | AzServiceBus (Generic, ModelData) | Firebase               |   |
|  | InfrastructureDependencyInjection                          |   |
|  +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

## Layer Details

### Core Layer
- **Entities:** Domain models (e.g., `Notes`, `NoteLists`)
- **Enumerations:** Domain enums (e.g., `NoteStates`, `JobIdentifier`, `ClientNameServiceBus`)
- **Rules:** Zero NuGet dependencies. Pure C# only.

### Application Layer
- **Services/Simple:** Single-responsibility use cases (e.g., `NotesService`, `ClearAllService`)
- **Services/Compound:** Orchestrated use cases combining multiple services (e.g., `NoteListsService`)
- **DTOs:** Input/Output data transfer objects with AutoMapper `MappingProfile`
- **Interfaces/Services:** Use case contracts (e.g., `INotesUseCase`, `INoteListsUseCase`)
- **Interfaces/Infrastructure:** Repository/adapter contracts (e.g., `INotasRepository`, `IFirebaseAdapter`)
- **Common/Helpers:** `ManageLogs` (structured logging), `BusinessException` (error handling)
- **Common/Utilities:** `OpenTelemetryInstrumentor`, `BusinessSettings`, `ServiceBusSettings`
- **DI:** `ApplicationDependencyInjection.cs` registers all application services

### Infrastructure Layer
- **MSQLServer:** `ContextSQLServer` (EF Core DbContext), `GenericRepositoryService`, `UnitWork`
- **MongoDB:** `Context`, `NotasAdapter`
- **DapperOrm:** `DapperContext`, `NotasDapperAdapter`, `NotesMapper`
- **AzServiceBus:** Generic service bus with Command/Event/AsyncQuery patterns
- **Firebase:** `FirebaseAdapter`
- **DI:** `InfrastructureDependencyInjection.cs` registers all infrastructure services

### Initialization Layer (4 service types)

| Service Type | Entry Point | Key Components |
|---|---|---|
| **RestApiService** | `Program.cs` | Controllers, Filters, Middlewares, Health, Validations |
| **GrpcApiService** | `Program.cs` | gRPC Services, Interceptors, Validations |
| **MessagingService** | `Program.cs` | Subscriptions (Command/Event), TransferSubscriptionsHostedService |
| **CronJobService** | `Program.cs` | Jobs (Hangfire/Coravel), ConfigurationJobs |

### Tests Structure

| Project | Purpose |
|---|---|
| `Architecture.Tests` | NetArchTest rules validating layer dependencies |
| `Unit.Tests` | xUnit tests for Application services (Simple + Compound) |
| `Double.Tests` | Test doubles organized by type (Dummy, Fake, Mocks, Spy, Stubs) |
| `Integration.Tests` | Per-initializer integration tests |

## Cross-Cutting Concerns

- **Observability:** OpenTelemetry (traces, metrics, logs) + Serilog
- **Secrets:** Azure Key Vault with `ResolveSecrets` at startup
- **Configuration:** MongoDB Configuration Provider (`SC.Configuration.Provider.Mongo`)
- **Startup:** every initializer uses the same `Program.cs` order: local configuration, dynamic providers, `ResolveSecrets`, Application DI, Infrastructure DI, initializer DI, build, asynchronous `RunAsync`; no global startup `try/catch`
- **Logging:** `ManageLogs` abstraction with `IManageLogs` interface
- **Error Handling:** `BusinessException` with typed `BusinessExceptionTypes`
- **Validation:** FluentValidation at API boundaries

## Deployment

- **CI/CD:** Azure DevOps Pipelines (pipeline definitions per initializer: REST, gRPC, Messaging, CronJob)
- **ALM Structure:** `.azuredevops/` contains one pipeline YAML per initializer type present in `src/Initialization/`
- **Containerization:** Docker support (`.dockerignore` present)
- **Environments:** Development, QA, Production (with approval gates)
- **Cloud:** Azure (App Service, Service Bus, Key Vault, SQL Server, Cosmos DB/MongoDB)
