# ADR-001: Clean Architecture 3 Layers Angular

## Status
Accepted

## Context
We need a frontend architecture that guarantees separation of concerns, testability, and long-term maintainability.

## Decision
Adopt Clean Architecture with 3 layers:
- **Application**: Abstractions (use cases, adapters), DTOs, events, services, helpers. Zero concrete dependencies.
- **Infrastructure**: Concrete implementations (HTTP adapters, MSAL, storage, guards, interceptors).
- **Presentation**: UI (views, pages, components, routing, ITCSS styles).
- **Libs**: Cross-cutting configuration (AppSettings, MF manifest).

## Rules
- Application does NOT depend on anything concrete
- Infrastructure ONLY implements Application abstractions
- Presentation ONLY consumes abstract Use Cases
- Each layer has its own Angular DI module

## Consequences
- Positive: Testability, infrastructure replaceability, clear separation
- Negative: More files/folders, initial learning curve
