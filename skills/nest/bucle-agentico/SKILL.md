---
name: nest-bucle-agentico
description: "Use when an approved PRP exists and complex implementation should proceed phase by phase with just-in-time context mapping"
---

---
name: bucle-agentico
description: "Complex features via BLUEPRINT phases with sub-agent coordination"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Bucle Agéntico

## Purpose

Implement complex features that span multiple modules or integrations using a phased BLUEPRINT approach with sub-agent coordination.

## Execution Flow — 5 Phases

### Phase 1: ANALYZE

1. Read the approved PRP/DRP document
2. Identify all affected layers and modules
3. Map backend microservice dependencies
4. Identify cross-cutting concerns (auth, logging, error handling)

### Phase 2: PLAN

1. Break the feature into atomic implementation units
2. Define execution order respecting layer dependencies
3. Identify test scenarios for each unit
4. Create implementation checklist

### Phase 3: IMPLEMENT (per unit)

For each unit, follow the layer order:
1. `application` — Abstractions, DTOs, Services
2. `infrastructure` — External service clients, providers
3. `api` — Controllers with Swagger decorators

### Phase 4: TEST

1. Generate Jest unit tests for each service
2. Verify 90% minimum coverage
3. Run all tests and fix failures

### Phase 5: DOCUMENT

1. Update OpenAPI spec (`contrato-de-api.yml`)
2. Update CHANGELOG.md
3. Update architecture docs if needed

## Rules

- Each phase MUST complete before the next begins
- The auto-chain runs after Phase 3: security-scan → verify-logic → generate-tests → documentacion
- NEVER skip the ANALYZE phase
- NEVER implement without an approved PRP
