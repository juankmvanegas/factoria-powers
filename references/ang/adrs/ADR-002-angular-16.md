# ADR-002: Angular 16 as Framework

## Status
Accepted

## Context
The company needs a stable frontend framework with enterprise support and a mature ecosystem.

## Decision
Angular 16.2.12 as the sole frontend framework. TypeScript 5.1.x with strict mode enabled.

## Reasons
- Opinionated framework (reduces decisions)
- Native DI (fundamental for Clean Architecture)
- Enterprise support from Google
- Mature ecosystem (routing, forms, HTTP, testing)
- Existing validated enterprise template

## Consequences
- Positive: Consistency, native DI, native lazy loading
- Negative: Larger bundle size than alternatives, learning curve
