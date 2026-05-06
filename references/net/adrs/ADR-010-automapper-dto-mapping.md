# ADR-010: AutoMapper for DTO Mapping

## Status
Accepted

## Date
2023-04-19

## Context
Mapping between domain entities and DTOs is repetitive and error-prone when done manually.

## Decision
Use AutoMapper for entity-to-DTO and DTO-to-entity mapping.

### Implementation
- `MappingProfile.cs` in `Application/DTOs/` defines all mappings
- AutoMapper registered via `AddAutoMapper()` in DI
- Package: `AutoMapper` 12.0.1, `AutoMapper.Extensions.Microsoft.DependencyInjection` 12.0.0

### DTO Conventions
- Input DTOs: `[Entity]Input`, `Modified[Entity]Input`, `Checked[Entity]Input`
- Output DTOs: `[Entity]Output`, `Simplified[Entity]Output`
- DTOs organized by domain entity folder (e.g., `DTOs/Notes/`, `DTOs/NoteLists/`)

### gRPC Mapping
- gRPC services have their own `GRPCProfile.cs` for proto-to-DTO mapping

## Consequences
- All mappings centralized in profile classes
- Mapping profiles are testable
- DTO folder structure mirrors entity organization
