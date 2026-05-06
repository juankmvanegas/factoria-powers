---
name: net-backend
description: "Use when backend-specific implementation guidance is needed for this factory's backend stack"
---

---
name: backend
description: ".NET backend specialist — automatically applies enterprise standards"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Backend .NET — Enterprise Standards

This skill is automatically activated when writing .NET code: services, controllers, dependency injection, middleware, or any backend component.

## Clean Architecture 4 Layers

Always respect the dependency hierarchy (current ADR):

1. **Core** — Domain entities, enums, constants, business exceptions. No external dependencies.
2. **Application** — Interfaces, DTOs, application services, validators, mapping profiles. Depends only on Core.
3. **Infrastructure** — Data access implementations, external services, adapters. Depends on Core and Application.
4. **Initialization** (bootstrap / API layer) — Controllers, configuration, DI composition. Depends on all layers.

Dependencies flow **always inward**: Initialization → Infrastructure → Application → Core. Never in the opposite direction.

## Explicit Access Modifiers

- Always explicitly declare `public`, `internal`, `private`, or `protected`.
- Do not rely on compiler defaults.
- Internal service classes should be `internal` unless exposed outside the assembly.

## Interface-Based Dependency Injection

- Every dependency is injected through its interface, never as a concrete implementation.
- Constructors receive interfaces; concrete classes are registered in the DI container.
- Avoid `new` to instantiate services; always resolve from the container.

## Business Error Handling

- Use `BusinessException` (defined in Core) for business logic errors.
- Never throw generic `Exception` or `ApplicationException`.
- Global middleware catches `BusinessException` and returns appropriate HTTP responses.
- **Never expose internal system details** (stack traces, server names, connection strings) in error messages to the client.

## Logging with IManageLogs

- Use the `IManageLogs` interface for all logging.
- **Never** use static loggers, `Console.WriteLine`, or `Debug.WriteLine`.
- Inject `IManageLogs` via constructor like any other dependency.
- Log relevant events: errors, warnings, and critical business operations.

## AutoMapper — Mapping Profiles

- Create AutoMapper profiles for each Entity ↔ DTO conversion.
- Profiles reside in the Application layer.
- One profile per aggregate or functional context.
- Do not perform manual mappings when AutoMapper can handle them.

## FluentValidation at API Boundaries

- Validate all input DTOs with FluentValidation.
- Validation classes reside in the Application layer.
- Register validators in the DI pipeline for automatic execution.
- Clear, user-oriented validation messages.

## Controllers — Controllers Only

- Use **MVC controllers** (`[ApiController]`) for all endpoints.
- **Do not use Minimal APIs** under any circumstances.
- Controllers are thin: they delegate all logic to the corresponding application service.
- Decorate with route attributes, HTTP verb, and documented responses (`[ProducesResponseType]`).

## Per-Layer Dependency Registration

Each layer registers its own dependencies in its designated class:

- **Application** → `ApplicationDependencyInjection` — registers application services, validators, AutoMapper profiles.
- **Infrastructure** → `InfrastructureDependencyInjection` — registers repositories, contexts, external adapters.
- **Initialization** → `ServicesConfiguration` — composes the above and adds middleware, authentication, Swagger, etc.

Do not register dependencies from one layer in another layer's class.

## Naming Conventions

- **Interfaces**: prefix `I` (e.g., `IUserService`, `IManageLogs`).
- **Application services**: suffix `Service` (e.g., `UserService`).
- **Repositories**: suffix `Repository` or `RepositoryService` (e.g., `GenericRepositoryService`).
- **DTOs**: suffix `Dto` (e.g., `UserDto`, `CreateUserDto`).
- **Validators**: suffix `Validator` (e.g., `CreateUserDtoValidator`).
- **Controllers**: suffix `Controller` (e.g., `UserController`).
- **Exceptions**: suffix `Exception` (e.g., `BusinessException`).
- Use PascalCase for classes, methods, and public properties.
- Use camelCase for parameters and local variables.
- Prefix `_` for private injected fields (e.g., `_userService`).

## Security

- **Never** include secrets, passwords, connection strings, or tokens in source code.
- Secrets are obtained from Azure Key Vault or environment configuration.
- Do not commit `appsettings.Development.json` files with sensitive data.
- Sanitize all user input before processing.

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/coding-standards.md`** — Code standards (naming, architecture, DI, patterns)
- **`.cloud/policies/security-policy.md`** — Security (secrets, encryption, auth, error handling)

In case of any doubt or conflict between this skill and the policies, **policies win**.
