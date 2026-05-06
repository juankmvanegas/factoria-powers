# ADR-002: .NET 8.0 as Target Framework

## Status
Accepted

## Date
2024-05-06 (Blueprint v2.1.4)

## Context
The organization needed to standardize on a .NET version that provides LTS support,
performance improvements, and access to modern C# features.

## Decision
Use .NET 8.0 as the target framework for all services. This is enforced via
`Directory.Build.props` which sets the target framework centrally for all projects.

### Migration History
- v1.0.0: Initial release (framework version not specified)
- v2.1.4: Migrated to .NET 8.0

## Consequences
- All `.csproj` files inherit the target framework from `Directory.Build.props`
- NuGet packages must be compatible with .NET 8.0
- C# 12 features are available
- Docker base images must use `mcr.microsoft.com/dotnet/aspnet:8.0`
