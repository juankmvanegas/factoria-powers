# ADR-004: Multiple Initialization Types (REST, gRPC, Messaging, CronJob)

## Status
Accepted

## Date
2023-04-19

## Context
Microservices need different communication protocols depending on use case:
synchronous APIs, inter-service RPC, event-driven processing, and scheduled tasks.

## Decision
Support 4 initialization types in the `Initialization` layer, each as a separate project:

### 1. RestApiService.ServiceName
- ASP.NET Core Web API with Controllers
- Includes: Filters (`FilterExceptionAttribute`, `SuccessFilterAttribute`), Middlewares (`ExceptionMiddleware`), Health checks, Swagger, FluentValidation (`CustomResultFactory`)
- Pattern: Controllers, NOT Minimal APIs

### 2. GrpcApiService.ServiceName
- ASP.NET Core gRPC service
- Includes: Exception interceptors (`ExceptiongRPCInterceptor`), Validations, AutoMapper profiles (`GRPCProfile`)

### 3. MessagingService.ServiceName
- Azure Service Bus consumer
- Includes: `SubscriptionBase`, `ISubscription`, Command and Event subscriptions
- Background processing via `TransferSubscriptionsHostedService`

### 4. CronJobService.ServiceName
- Scheduled job runner (Hangfire/Coravel)
- Includes: `ConfigurationJobs`, job definitions

### Shared Configuration Pattern
All initialization types share:
- `ConfigurationExtensions.cs` - Extension methods for app configuration
- `ServicesConfiguration.cs` - DI service registration
- `Program.cs` - Entry point with builder pattern

### Mandatory Startup Contract
Every `Program.cs` in the Initialization layer is the composition root and MUST follow the same startup sequence:

1. Create the builder.
2. Load local non-secret configuration from `appsettings.json` and the environment-specific file.
3. Configure remote/dynamic configuration providers (`AddMongoProvider` when used by the service).
4. Resolve Azure Key Vault secrets by calling `ResolveSecrets` before any infrastructure service is registered.
5. Register Application services through `ApplicationDependencyInjection`.
6. Register Infrastructure services through `InfrastructureDependencyInjection`, using the resolved configuration.
7. Register initializer-specific services through `ServicesConfiguration`.
8. Build the app/host.
9. Configure middleware, endpoints, subscriptions, or jobs according to the initializer type.
10. Run the app/host asynchronously with `await app.RunAsync()` or `await host.RunAsync()`.

`Program.cs` MUST NOT contain business logic, repository registrations, hardcoded connection strings, hardcoded URLs, inline secret values, ad hoc service registrations that belong to Application or Infrastructure, or a global `try/catch` wrapping startup/run. Those registrations belong in their layer DI class and are composed from Initialization. Startup failures must surface through the host/runtime, observability pipeline, and deployment platform instead of being swallowed or reformatted in `Program.cs`.

## Folder Structure
ALL initialization types live inside ONE SINGLE `src/Initialization/` folder:
```
src/Initialization/
├── RestApiService.{Name}/
├── GrpcApiService.{Name}/
├── MessagingService.{Name}/
└── CronJobService.{Name}/
```
NEVER create separate top-level folders per initialization type. Even with a single type, it goes inside `Initialization/`.

## Consequences
- `.ServiceName` suffix must be renamed to actual service name in new projects
- Each initializer has its own `.csproj` and can be deployed independently
- Shared business logic stays in Application layer
- Each initializer registers its own DI + Application DI + Infrastructure DI
- All initializers coexist inside the same `Initialization/` folder
- Startup order and asynchronous host execution are testable and standardized across REST, gRPC, Messaging, and CronJob initializers
