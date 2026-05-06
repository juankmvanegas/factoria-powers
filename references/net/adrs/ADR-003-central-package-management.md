# ADR-003: Central Package Management

## Status
Accepted

## Date
2023-04-19

## Context
With multiple projects in a single solution, package version inconsistencies
across projects create maintenance burden and potential runtime conflicts.

## Decision
Use NuGet Central Package Management via `Directory.Packages.props` at the solution root.

### Key Packages Managed
| Category | Package | Version |
|---|---|---|
| ORM | EntityFrameworkCore | 8.0.5 |
| ORM | Dapper | 2.1.35 |
| ORM | MongoDB.Driver | 2.23.1 |
| API | Grpc.AspNetCore | 2.52.0 |
| API | Swashbuckle | 6.5.0 |
| Messaging | Azure.Messaging.ServiceBus | 7.17.3 |
| Validation | FluentValidation.AspNetCore | 11.3.0 |
| Mapping | AutoMapper | 12.0.1 |
| Observability | OpenTelemetry.* | 1.5.0+ |
| Logging | Serilog | 2.12.0 |
| Jobs | Hangfire | 1.8.1 |
| Jobs | Coravel | 4.2.1 |
| Testing | xUnit | 2.6.6 |
| Testing | Moq | 4.18.4 |
| Testing | FluentAssertions | 6.12.0 |
| Testing | NetArchTest.Rules | 1.3.2 |
| Config | SC.Configuration.Provider.Mongo | 1.0.40329 |

## Consequences
- Individual `.csproj` files use `<PackageReference>` without `Version` attribute
- Version updates happen in one place only
- `Directory.Build.props` sets shared properties (target framework, etc.)
- All teams use the same package versions
