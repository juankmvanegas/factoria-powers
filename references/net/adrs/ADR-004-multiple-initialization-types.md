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
