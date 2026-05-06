# ADR-001: Clean Architecture 3 Layers for Next.js

## Status

Accepted

## Date

2026-04-05

## Context

Next.js 14 combines server and client rendering in a single framework. Unlike Angular (4 layers) or .NET (4 layers), the Next.js model with Server Components and App Router allows simplifying the architecture to 3 layers without losing separation of concerns. A structure is needed that maintains domain/application independence from frameworks and infrastructure details.

## Decision

Adopt a 3-layer architecture plus a cross-cutting configuration folder:

1. **Application** — Zero concrete dependencies. Contains abstractions (interfaces/abstract classes), DTOs, application services, use cases, and contracts. Does not import React, Next.js, or external libraries.
2. **Infrastructure** — Concrete implementations: fetch adapters for external APIs, NextAuth config, storage (localStorage, cookies), React Context providers that inject Application services.
3. **Presentation** — App Router (pages, layouts, route groups), React components (Server and Client), custom hooks, Tailwind styles, loading/error boundaries.
4. **Libs** — Cross-cutting configuration: typed environment variables, constants, pure utilities.

**Dependency rule:** Application depends on nothing. Infrastructure depends on Application. Presentation depends on Application and Infrastructure. Libs is cross-cutting.

Each layer manages its own provider registry. Infrastructure registers implementations in React Context providers that Presentation consumes.

## Alternatives Considered

- **4 layers (Domain + Application + Infrastructure + Presentation):** Separate Domain from Application. Discarded because in a Next.js frontend pure domain logic is minimal; models and rules are expressed as DTOs and validations in Application.
- **Feature-based without layers:** Organize everything by feature without horizontal separation. Discarded because it hinders service reuse and implementation substitution.
- **Hexagonal with ports and adapters:** Too ceremonious for a frontend project. The Application/Infrastructure separation already achieves the same goal with less complexity.

## Consequences

### Positive

- Application is testable without framework dependencies.
- Switching from fetch to axios or from NextAuth to Clerk only requires modifying Infrastructure.
- The dependency rule prevents circular couplings.
- Consistent with the philosophy of other factories (Net, Ang) adapted to Next.js.

### Negative

- Learning curve for developers who only know the flat Next.js structure.
- More files and folders than a conventional Next.js project.

### Neutral

- The Libs folder acts as a shared utility and does not participate in the strict dependency rule.
- Next.js Server Components can import directly from Application without going through Infrastructure when they do not need adapters.
