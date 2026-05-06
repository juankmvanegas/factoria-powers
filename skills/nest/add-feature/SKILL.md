---
name: nest-add-feature
description: "Use when the user wants to add a new feature, endpoint, component, or module to the current project"
---

---
name: add-feature
description: "Add a new feature following the 3-layer execution order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Add a new feature to the NestJS BFF following the strict layer execution order from the blueprint `ing-nes-bff-clean`.

## Execution Flow — 5 Strict Steps

### Step 1: application (Abstractions + DTOs + Services)

1. Create use case interface in `src/application/abstractions/use-cases/[feature].interface.ts`
2. Create infrastructure abstraction in `src/application/abstractions/infrastructure/[feature]/`
3. Create DTOs with `class-validator` decorators in `src/application/dtos/[feature]/`
4. Create service implementing use case interface in `src/application/services/[feature].service.ts`
5. Register service in `application.module.ts`

### Step 2: infrastructure (External Service Clients)

1. Create service client in `src/infrastructure/services/[backend-service]/[service].service.ts`
2. Create providers file `[service].providers.ts` for DI registration
3. Implement infrastructure abstraction from Step 1
4. Register in `infrastructure.module.ts`

### Step 3: api (Controllers)

1. Create controller in `src/api/controllers/[feature].controller.ts`
2. Add Swagger decorators: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`
3. Use URI versioning
4. Inject application service (NEVER infrastructure directly)
5. Register in `api.module.ts`

### Step 4: Tests

1. Create test in `test/unit-testing/services/[feature].test.ts`
2. Create mocks in `test/datasets/mocks/`
3. Follow AAA pattern, target 90% coverage
4. Use `@nestjs/testing` and `@golevelup/ts-jest`

### Step 5: Documentation

1. Update `src/api/contrato-de-api.yml` (OpenAPI spec)
2. Update `CHANGELOG.md`

## Auto-Shielding

After completion: security-scan → generate-tests → documentacion (auto-chain)

## Rules

- NEVER skip a step or change the order
- NEVER put business logic in the BFF — only aggregation, transformation, orchestration
- ALWAYS create abstractions before implementations
- ALWAYS use `class-validator` decorators in DTOs
- ALWAYS add Swagger decorators to controllers
- ALWAYS use constructor injection
