---
name: ang-add-feature
description: "Use when the user wants to add a new feature, endpoint, component, or module to the current project"
---

---
name: add-feature
description: "Add a new feature following the Angular execution order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Implement a new feature strictly following the Clean Architecture Angular execution order.

## Prerequisites

- Angular project initialized with Factoria-Ang
- Domain knowledge (BUSINESS_LOGIC.md or user context)

## Execution Order (IMMUTABLE)

### Step 1: Application — Abstractions and DTOs

1. Create DTOs in `application/dtos/{entity}/`
   - `{entity}.input.ts` — Input data
   - `{entity}.output.ts` — Output data
2. Create abstract Use Case in `application/abstractions/use-cases/`
   - Abstract class with methods returning `Observable<T>`
3. Create abstract Adapter in `application/abstractions/infraestructure/bff/adapters/`
   - Abstract class for HTTP communication
4. Create Events if needed in `application/events/{entity}/`

### Step 2: Application — Services

1. Create Service in `application/services/`
   - Implements the abstract Use Case
   - Injects abstract Adapter
   - All business logic here
2. Register in `application.module.ts`:
   ```typescript
   { provide: EntityUseCases, useClass: EntityService }
   ```

### Step 3: Infrastructure — Adapters

1. Create HTTP Adapter in `infrastructure/services/api-bff/`
   - Implements the abstract Adapter
   - Uses HttpClient for API calls
   - Gets base URL from `AppSettingsService.apiBaseUrl` — NEVER hardcode URLs
   - If the prompt includes backend URL, verify that AppSettingsService already has it configured
   - Configures headers via factory provider
2. Create Storage Adapter if needed
3. Register in corresponding providers

### Step 4: Presentation — Views and Components

1. Create View in `presentation/views/{entity}-view/`
   - `{entity}-view.container.ts` — `<router-outlet/>`
   - `{entity}-view.module.ts` — Declarations + imports
   - `{entity}-view.router.ts` — Routes
2. Create Pages in `pages/`
3. Create Components in `components/`
4. Add route to `presentation.router.ts` with lazy loading
5. ITCSS styles if needed

### Step 5: Tests

Invoke `/generate-tests` automatically:
- Service tests (use case implementation)
- HTTP adapter tests
- Component tests with significant logic

### Step 6: Documentation

Invoke `/documentacion` automatically:
- Update CHANGELOG.md
- Update architecture if needed

## Auto-Shielding

If errors occur during implementation:
1. Capture complete error
2. Fix and re-verify
3. If not resolved after 3 attempts, STOP and escalate

## Rules

- ALWAYS follow the order: Application → Infrastructure → Presentation → Tests → Docs
- NEVER create components that consume concrete services directly
- ALWAYS use abstract classes for DI
- ALWAYS inline templates
- ALWAYS lazy loading for new views
