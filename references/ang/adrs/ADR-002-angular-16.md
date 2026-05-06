# ADR-002: Angular Version Strategy

## Status
Accepted

## Context
The company needs a stable frontend framework with enterprise support, a mature ecosystem, and a version strategy that supports both modernization and existing project constraints.

## Decision
Angular is the sole frontend framework, but Factoria-Ang supports multiple Angular major versions when they are still officially supported or when a migration constraint is documented.

For new projects and intentional upgrades, use the latest stable supported Angular version by default. Existing projects may remain on their current supported Angular major when compatibility, migration scope, or enterprise constraints justify it through an ADR. Unsupported/EOL Angular versions require an explicit upgrade plan before feature work continues.

TypeScript must stay in strict mode and must match the compatibility matrix of the selected Angular major.

## Reasons
- Opinionated framework (reduces decisions)
- Native DI (fundamental for Clean Architecture)
- Enterprise support from Google
- Mature ecosystem (routing, forms, HTTP, testing)
- Existing validated enterprise template
- Enables gradual modernization without blocking maintenance work
- Keeps new work aligned with the latest stable Angular capabilities

## Consequences
- Positive: Consistency, native DI, native lazy loading, controlled upgrades, compatibility with existing Angular estates
- Negative: Version matrix must be maintained, upgrades require regression testing and dependency alignment
