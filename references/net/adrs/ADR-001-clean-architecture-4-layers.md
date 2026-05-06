# ADR-001: Clean Architecture with 4 Layers

## Status
Accepted

## Date
2023-04-19 (Blueprint v1.0.0)

## Context
The organization needed a standardized backend architecture for .NET microservices that enforces
separation of concerns, testability, and maintainability across all teams.

## Decision
Adopt Clean Architecture with exactly 4 layers:

1. **Core** - Domain entities and enumerations. Zero external dependencies.
2. **Application** - Business logic, use cases (Simple/Compound), DTOs, interfaces.
3. **Infrastructure** - Data access (EF Core, Dapper, MongoDB), external services (ServiceBus, Firebase).
4. **Initialization** - Composition root with 4 service types (REST, gRPC, Messaging, CronJob).

### Dependency Rule
```
Core <- Application <- Infrastructure
                    <- Initialization (depends on all layers for DI composition)
```

## Consequences
- Core layer must never reference NuGet packages
- New layers cannot be invented
- Existing layer names cannot be changed
- All new services must follow this exact structure
- Architecture tests (`CheckArchitectureRules.cs`) enforce these rules automatically
