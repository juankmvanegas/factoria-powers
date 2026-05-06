# ADR-005: Repository Pattern with Multiple Data Providers

## Status
Accepted

## Date
2023-04-19

## Context
Different data storage needs require different data access technologies.
The architecture must support multiple providers while keeping business logic decoupled.

## Decision
Implement the Repository pattern with three data access providers in the Infrastructure layer:

### 1. Entity Framework Core (MSQLServer)
- `ContextSQLServer` - DbContext
- `GenericRepositoryService` - Generic CRUD repository
- `UnitWork` - Unit of Work pattern for transaction management
- Interface: `IGenericRepositoryAdapter<T>`, `IUnitWork`

### 2. Dapper (DapperOrm)
- `DapperContext` - Connection factory
- `NotasDapperAdapter` - Specific Dapper implementation
- `NotesMapper` - Dapper type mapping
- Interface: `INotasDapperRepository`

### 3. MongoDB
- `Context` - MongoDB client/database factory
- `NotasAdapter` - MongoDB collection adapter
- Interface: `INotasRepository`

### Interface Location
All repository interfaces live in `Application/Interfaces/Infrastructure/`.
Infrastructure implements them. Application consumes them.

## Consequences
- Application layer never references data access packages
- Repositories are interchangeable via DI
- Each provider has its own folder in `Infrastructure/Services/`
- Connection strings come from Azure Key Vault at runtime
