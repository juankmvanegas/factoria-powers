# Current Architecture — Factoria-Ang

## Framework
Angular with TypeScript strict mode. New projects prioritize the latest stable supported Angular version; existing projects may use another supported Angular major when documented by ADR.

## Architecture
Clean Architecture 3 Layers with Atomic Design in Presentation:

```
Application (abstractions + business logic)
    ↓
Infrastructure (concrete implementations)
    ↓
Presentation (UI, routing, styles, Atomic Design components)

Libs (cross-cutting configuration)
```

## Active ADRs
- ADR-001: Clean Architecture 3 Layers with Atomic Design
- ADR-002: Angular Version Strategy
- ADR-003: TypeScript Strict Mode
- ADR-004: Module Federation
- ADR-005: MSAL Authentication
- ADR-006: ITCSS
- ADR-007: Karma + Jasmine
- ADR-008: Inline Templates
- ADR-009: Abstract Classes for DI
- ADR-010: Custom DOM Events
- ADR-011: Lazy Loading
- ADR-012: File Replacement
- ADR-013: Error Handling Strategy
- ADR-014: Azure DevOps CI/CD

## Stack
- Angular latest stable supported version preferred; project version allowed by ADR
- TypeScript strict mode compatible with selected Angular major
- MSAL Angular 3.x (AAD + B2C)
- Module Federation 15.x
- Karma + Jasmine + ng-mocks
- ITCSS for styles
- Azure DevOps for CI/CD
