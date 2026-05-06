# ADR-002: NestJS 11.x LTS as Target Framework

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF requires a robust Node.js framework with dependency injection, modularity, and first-class TypeScript support. It must align with enterprise patterns familiar from the .NET ecosystem (DI, middleware pipelines, decorators) while leveraging the Node.js ecosystem.

## Decision
Adopt the following technology stack for all BFF projects:

- **NestJS 11.x LTS** as the target framework (upgraded from 10.x per blueprint v2.1.3)
- **@nestjs/platform-express** adapter (Express under the hood) for HTTP handling
- **TypeScript 5.8+** with strict mode enabled
- **Node.js 20 LTS** as the target runtime, ES2022 compilation target
- Key packages: `@nestjs/core`, `@nestjs/common`, `@nestjs/config`, `@nestjs/microservices`, `@nestjs/swagger`
- Major and minor versions pinned in package.json. Framework upgrades require a new ADR.

## Consequences
- NestJS provides enterprise patterns (DI, modules, decorators) familiar to the .NET team
- TypeScript strict mode prevents entire categories of compile-time errors
- Express adapter ensures compatibility with existing middleware (lower performance than Fastify, but compatibility is prioritized)
- Dependency on experimental TypeScript decorators may require adjustments in future TS versions
