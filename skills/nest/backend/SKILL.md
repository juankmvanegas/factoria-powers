---
name: backend
description: "NestJS BFF specialist — auto-activated on NestJS code changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Backend (NestJS BFF)

## Activates When

Working with NestJS code: controllers, services, modules, providers, DTOs, guards, interceptors, pipes, filters.

## Responsibilities

1. Enforce 3-layer architecture (api, infrastructure, application)
2. Enforce BFF rule: NO business logic — only aggregation, transformation, orchestration
3. Enforce naming conventions from coding-standards policy
4. Ensure class-validator decorators in all DTOs
5. Ensure Swagger decorators on all controllers
6. Ensure constructor injection everywhere
7. Ensure custom exceptions from `libs/errors/` are used
8. Ensure custom logger from `libs/tracer/` is used (no console.log)
9. Verify module registrations are correct
10. Verify provider-based DI for infrastructure services

## Rules

- Auto-activated — no user invocation needed
- Enforces conventions silently during code generation
- Reports violations immediately when detected
