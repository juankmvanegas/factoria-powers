---
name: nest-generate-drp
description: "Use when documenting a development request plan before starting a new feature, architectural change, or database migration"
---

---
name: generate-drp
description: "Generate Development Request Plan for NestJS BFF features"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Generate Development Request Plan (DRP)

## Purpose
Generate a complete DRP document for a new feature, bug fix, or refactoring task
in the NestJS BFF layer, ensuring all architectural, testing, security, and
deployment aspects are covered across the 3-layer Clean Architecture.

## When to Use
- Before starting any new feature development in the BFF
- Before making significant architectural changes to the NestJS application
- Before adding new backend microservice integrations
- Before modifying API aggregation or orchestration logic

## Inputs Required
1. **Feature description** - What needs to be built or changed in the BFF
2. **Business context** - Why this is needed
3. **Scope** - What's included and excluded
4. **Backend microservices involved** - Which microservices the BFF will integrate with

## Output
A filled `drp-[feature-name].md` following the template in `.cloud/planning/drp-current.md`.

## Execution Flow

### Step 1 â€” Read Context
1. Read the feature request/description
2. Read `.cloud/architecture/current.md` to understand current BFF state
3. Read relevant ADRs in `.cloud/architecture/decisions/`
4. Read `.cloud/policies/security-policy.md` for security checklist
5. Read `.cloud/policies/testing-policy.md` for test plan structure

### Step 2 â€” Identify Affected Layers
Map the feature across the 3 BFF layers:
- **api** â€” Controllers, DTOs (request/response), Pipes, Guards, Interceptors
- **infrastructure** â€” Infrastructure services (HTTP clients to backend microservices), adapters, external integrations
- **application** â€” Application services (orchestration/aggregation logic), interfaces, use cases

### Step 3 â€” Plan Infrastructure Service Integrations
For each backend microservice the BFF needs to call:
- Identify the microservice's API endpoints (OpenAPI spec or documentation)
- Plan the infrastructure service interface and HTTP implementation
- Plan request/response DTOs for the microservice communication
- Plan error handling and retry strategies (using Axios interceptors or custom retry logic)

### Step 4 â€” Plan Testing
- Unit tests for application services (Jest + @nestjs/testing)
- Unit tests for infrastructure services (mocked HTTP calls)
- Mock data in `test/datasets/mocks/`
- Test files in `test/unit-testing/services/`
- Minimum 90% coverage target

### Step 5 â€” Generate DRP Document
Fill in the DRP template with all details from steps 1-4.

## Rules
1. Every DRP must identify affected layers (api, infrastructure, application)
2. Every DRP must include a testing plan with Jest
3. Every DRP must include a security checklist
4. New ADRs must be proposed if the feature introduces architectural decisions
5. DRP must reference relevant existing ADRs
6. Infrastructure service integrations must be planned with proper interfaces
7. All microservice base URLs must come from configuration (ConfigService), NEVER hardcoded
8. All secrets must come from environment variables or vault, NEVER in code

## Process
1. Read the feature request/description
2. Read `.cloud/architecture/current.md` to understand current state
3. Read relevant ADRs in `.cloud/architecture/decisions/`
4. Read `.cloud/policies/security-policy.md` for security checklist
5. Read `.cloud/policies/testing-policy.md` for test plan structure
6. Fill in the DRP template with specific details
7. Identify if new ADRs are needed
8. Flag any infrastructure service integration requirements
