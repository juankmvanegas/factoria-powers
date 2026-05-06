# Coding Standards

Adapted from enterprise coding standards for the NestJS BFF context.

## 1. Architecture Standards

### Layer Rules
- **3 layers only:** api, infrastructure, application. No new/renamed layers.
- application has zero external dependencies (only `abstract class` abstractions)
- infrastructure implements application abstract classes
- api depends on application (injects use case abstractions)
- `initialization.module.ts` is the composition root

### Dependency Flow
```
api → application ← infrastructure
```
- `abstract class` for abstractions (NOT `interface` — erased at runtime, unusable as DI tokens)
- Services return `Observable<T>` (RxJS) — reactive stack, NOT Promise-based
- DI: `{ provide: AbstractClass, useExisting: ConcreteImpl }`
- Constructor injection only. Path aliases: `@api/*`, `@infrastructure/*`, `@application/*`, `@libs/*`

## 2. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Controller | `[Entity]Controller` | `NotesController` |
| Service | `[Entity]Service` | `NotesService` |
| Module | `[Layer/Feature]Module` | `ApplicationModule` |
| DTO Input | `[Entity]Input` / `[Action][Entity]Dto` | `CreateNoteDto` |
| DTO Output | `[Entity]Output` / `[Entity]ResponseDto` | `NoteOutput` |
| Provider (infra) | `[Entity][Type]Provider` | `NotesHttpProvider` |
| Filter / Interceptor / Guard | `[Name]ExceptionFilter` / `[Name]Interceptor` / `[Name]Guard` | `AllExceptionsFilter` |

### Casing
- Classes/Enums: PascalCase | Interfaces: `I` + PascalCase | Methods/props: camelCase
- Constants: SCREAMING_SNAKE_CASE | Files/dirs: kebab-case

### Path Aliases
`@api/*` → `src/api/*` | `@infrastructure/*` → `src/infrastructure/*` | `@application/*` → `src/application/*` | `@libs/*` → `libs/*`

## 3. Code Style

### Prohibited
- `any` type — use explicit types or generics
- `console.log/error/warn` — only custom LoggerService
- Commented-out code; `@ts-ignore`/`@ts-nocheck` without justification
- `var`; nested callbacks > 2 levels; cyclomatic complexity >= 10

### Required
- `strict: true` + `noImplicitAny` + `strictNullChecks` in `tsconfig.json`
- ESLint (`@typescript-eslint/strict`) + Prettier + Husky pre-commit
- Explicit parameter/return types; `async/await`; `readonly`; `?.` and `??`
- Barrel files (`index.ts`) for module exports

### Sonar Standards
- Cyclomatic complexity must stay **below 10** per function or method
- Cognitive complexity must stay **below 15** per function or method
- Avoid nesting deeper than **3 levels**
- No commented-out code or placeholder code blocks kept for later
- Avoid source-code comments for routine logic; prefer extraction, naming, and typed abstractions
- If a method grows beyond Sonar thresholds, split orchestration into smaller private methods or providers

## 4. NestJS-Specific Patterns

### Validation
- `class-validator` in ALL DTOs; global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`)
- `class-transformer` for transformation (`@Type()`, `@Transform()`, `@Exclude()`)

### Exception Handling
- Global exception filter in `main.ts`; `BusinessException` for business errors
- Filter hides internals; use NestJS built-in classes (`NotFoundException`, etc.)

### Swagger (Required)
- ALL controllers: `@ApiTags()` + `@ApiOperation()` + `@ApiResponse()`
- ALL DTOs: `@ApiProperty()` on every property

## 5. Service and Provider Patterns

- **Application services**: single-responsibility, depend on abstract classes, inject LoggerService, throw `BusinessException`
- **Infrastructure providers**: implement abstract classes, use `HttpService` (`@nestjs/axios`), handle error mapping, config via `ConfigService`

## 6. Logging and Configuration

### Logging
- Custom `LoggerService` via DI — never `console.*`
- JSON format (Azure Monitor compatible): timestamp, correlation ID, origin, severity
- Levels: `error` | `warn` | `log` | `debug` (dev only) | `verbose` (dev only)

### Configuration
- `@nestjs/config` globally; Azure Key Vault for secrets; `ConfigService` injection only
- **Prohibited**: hardcoded URLs/ports/timeouts, `process.env` outside config files, secrets in `.env.example`

## 7. SOLID and Mandatory Patterns

- **SOLID** (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)
- **DRY**, **KISS**, **YAGNI**
- Service-Interface pattern; constructor injection (`private readonly`); `BusinessException` with typed codes
- Input DTOs: `class-validator`; output DTOs: `@ApiProperty()`
- External calls encapsulated in providers — never called directly from services

## 8. CHANGELOG

- Every release updates `CHANGELOG.md` (Keep a Changelog: Added, Fixed, Changed, Removed)
- Reference related tickets or user stories
