# ADR-001: Clean Architecture 3 Layers Angular with Atomic Design

## Status
Accepted

## Context
We need a frontend architecture that guarantees separation of concerns, testability, long-term maintainability, and consistent reusable UI composition.

## Decision
Adopt Clean Architecture with 3 layers and Atomic Design inside the Presentation layer:
- **Application**: Abstractions (use cases, adapters), DTOs, events, services, helpers. Zero concrete dependencies.
- **Infrastructure**: Concrete implementations (HTTP adapters, MSAL, storage, guards, interceptors).
- **Presentation**: UI (views, pages, routing, ITCSS styles) with reusable components organized by Atomic Design: atoms, molecules, organisms, templates, and pages.
- **Libs**: Cross-cutting configuration (AppSettings, MF manifest).

## Rules
- Application does NOT depend on anything concrete
- Infrastructure ONLY implements Application abstractions
- Presentation ONLY consumes abstract Use Cases
- Presentation reusable UI follows Atomic Design: atoms → molecules → organisms → templates/pages
- Atomic Design classification never bypasses Clean Architecture dependencies
- Each layer has its own Angular DI module

## Consequences
- Positive: Testability, infrastructure replaceability, clear separation, reusable UI vocabulary
- Negative: More files/folders, initial learning curve, need to classify UI components consistently
