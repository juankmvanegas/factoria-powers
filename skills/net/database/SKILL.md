---
name: net-database
description: "Use when database-specific operations are needed — migrations, schema changes, seed data, or query optimization"
---

---
name: database
description: "Data access specialist — EF Core, Dapper, MongoDB"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Data Access — EF Core, Dapper, MongoDB

This skill is automatically activated when working with EF Core migrations, Dapper queries, MongoDB operations, or repository patterns.

## Three Data Access Providers (ADR-005)

The architecture defines three data access providers, each with its specific purpose:

### 1. EF Core (SQL Server)

Primary provider for CRUD and transactional operations on SQL Server.

- **ContextSQLServer** — DbContext configured for SQL Server. It is the central access point to the relational database.
- **GenericRepositoryService** — Generic repository implementing basic CRUD operations (`GetAll`, `GetById`, `Insert`, `Update`, `Delete`) on any entity registered in the context.
- **UnitWork** — Unit of Work pattern implementation. Coordinates transactions spanning multiple repositories, guaranteeing atomicity. Call `SaveAsync()` or equivalent to persist changes.

Typical use: standard business operations, multi-table transactions, queries with relationship navigation.

### 2. Dapper

Provider for high-performance SQL queries and direct access.

- **DapperContext** — `IDbConnection` connection factory. Creates configured connections against the corresponding provider.
- **Provider-specific adapters** — Adapter classes encapsulating native SQL queries. Each adapter specializes in a data context or provider (SQL Server, PostgreSQL, etc.).
- **Custom type mapping** — When Dapper does not resolve mapping automatically, define custom `TypeHandler<T>` for complex types, enums, or value objects.

Typical use: complex reports, queries with massive JOINs, stored procedures, scenarios where EF Core performance is insufficient.

### 3. MongoDB

Provider for NoSQL document storage.

- **Context** (MongoDB) — Client and database factory. Manages the `IMongoClient` instance and exposes `IMongoDatabase` to access collections.
- **Collection adapters** — Classes encapsulating access to specific MongoDB collections. Each adapter manages a collection and exposes typed methods to query, insert, update, and delete documents.

Typical use: JSON document storage, structured logs, data with flexible schema, high-read catalogs.

## Interface and Implementation Location

- **Repository interfaces** are defined in `Application.Interfaces.Infrastructure`.
  - Example: `IGenericRepositoryService<T>`, `IUnitWork`, `IDapperContext`, `IMongoCollectionAdapter<T>`.
- **Implementations** reside in `Infrastructure.Services.[Provider]`.
  - EF Core: `Infrastructure.Services.EFCore` or `Infrastructure.Services.SQLServer`.
  - Dapper: `Infrastructure.Services.Dapper`.
  - MongoDB: `Infrastructure.Services.MongoDB`.

## Unit of Work Pattern (SQL Server)

- Use `UnitWork` for every operation that modifies data in SQL Server.
- Group related operations in a single unit of work.
- Call `SaveAsync()` only once at the end of the business operation.
- Do not mix writes from different transactional contexts in the same Unit of Work.
- In case of error, the transaction rolls back automatically.

## Generic Repository for Basic CRUD

- `GenericRepositoryService<T>` covers standard operations on any entity.
- For queries beyond simple CRUD (complex filters, projections), create a specific adapter.
- Do not overload the generic repository with specialized methods.

## Specific Adapters for Specialized Access

- When the generic repository is insufficient, create a dedicated adapter.
- The adapter implements its own interface defined in `Application.Interfaces.Infrastructure`.
- The adapter encapsulates complex data access logic, including native SQL (Dapper) or aggregation queries (MongoDB).
- One adapter per functional context or domain aggregate.

## Connection Strings and Secrets

- Connection strings are stored in **Azure Key Vault**.
- **Never** hardcode connection strings directly in `appsettings.json` or source code.
- In local development, use User Secrets or environment variables.
- Key Vault configuration is initialized in the Initialization layer.

## Dependency Registration

- All data access services are registered in `InfrastructureDependencyInjection.cs`.
- Register contexts, generic repositories, Unit of Work, and specific adapters.
- Respect appropriate lifetimes:
  - DbContext → `Scoped`.
  - Repositories and Unit of Work → `Scoped`.
  - Connection factories (DapperContext, MongoDB Context) → `Singleton` or `Scoped` depending on configuration.
- Do not register infrastructure services outside of `InfrastructureDependencyInjection`.
