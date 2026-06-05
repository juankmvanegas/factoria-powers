# ADR-010: Mapster for DTO Mapping

## Status
Accepted

## Date
2026-05-07

## Context
Mapping between domain entities and DTOs is repetitive and error-prone when done manually.
The factory previously standardized this concern with a different mapper, but the .NET golden path now
requires Mapster for a lighter mapping model, explicit configuration, and better performance.

## Decision
Use Mapster for entity-to-DTO and DTO-to-entity mapping.

### Implementation
- `MappingConfig.cs` or `[Aggregate]MappingConfig.cs` in `Application/DTOs/` defines all mappings with `TypeAdapterConfig`
- Mapster registered in DI via `TypeAdapterConfig.GlobalSettings` and `ServiceMapper`
- Package: `Mapster` 10.0.7, `Mapster.DependencyInjection` 10.0.7
- Do not add legacy mapper dependencies that contradict this ADR

### DTO Conventions
- Input DTOs: `[Entity]Input`, `Modified[Entity]Input`, `Checked[Entity]Input`
- Output DTOs: `[Entity]Output`, `Simplified[Entity]Output`
- DTOs organized by domain entity folder (e.g., `DTOs/Notes/`, `DTOs/NoteLists/`)

### gRPC Mapping
- gRPC services have their own `GRPCMappingConfig.cs` for proto-to-DTO mapping

## Consequences
- All mappings centralized in Mapster configuration classes
- Mapping configurations are testable
- DTO folder structure mirrors entity organization
- Generated .NET projects must not include legacy mapper dependencies or profiles
