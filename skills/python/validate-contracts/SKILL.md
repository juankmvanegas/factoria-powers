---
name: python-validate-contracts
description: "Use when checking that API contracts between frontend and backend (or between microservices) are still honored"
---

---
name: validate-contracts
description: "Validate API contracts by comparing FastAPI auto-generated OpenAPI spec against expected contract"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Validate that the actual API endpoints implemented in FastAPI match the expected API contract (OpenAPI specification). Detects breaking changes, missing endpoints, schema mismatches, and undocumented endpoints.

## When to Use

- Before deploying a new version
- After modifying API endpoints or schemas
- When integrating with frontend or external consumers
- As part of a CI/CD quality gate

## Execution Flow — 5 Strict Steps

1. **Generate current spec** — Extract the live OpenAPI spec from the FastAPI application:
   - Import the app and call `app.openapi()`
   - Or start the app and fetch from `/openapi.json`
   - Save as `.cloud/contracts/current-openapi.json`

2. **Load expected contract** — Read the expected contract from `.cloud/contracts/expected-openapi.json` or `.cloud/contracts/expected-openapi.yaml`. If no expected contract exists, use the current spec as baseline and notify the user.

3. **Compare specs** — Analyze differences:
   - **Missing endpoints** — In expected but not in current (CRITICAL)
   - **Extra endpoints** — In current but not in expected (WARNING)
   - **Schema changes** — Field additions (OK), field removals (CRITICAL), type changes (CRITICAL)
   - **Status code changes** — Different response codes (HIGH)
   - **Parameter changes** — Added required params (CRITICAL), removed params (HIGH)

4. **Classify changes** — For each difference:
   - **Breaking change** — Removes or modifies existing behavior (blocks deployment)
   - **Additive change** — Adds new behavior without removing existing (safe)
   - **Documentation change** — Only affects descriptions (safe)

5. **Generate report** — Output contract validation report:
   - Pass/fail verdict
   - Breaking changes list with details
   - Additive changes list
   - Recommendations for contract update if changes are intentional
   - Updated contract file if approved by user

## Auto-Shielding

- NEVER approve breaking changes without explicit user confirmation
- NEVER auto-update the expected contract without user approval
- ALWAYS generate the current spec from actual code, not from documentation
- ALWAYS check both request and response schemas

## Rules

- Breaking changes MUST block deployment until resolved or explicitly approved
- The expected contract is the source of truth for API consumers
- Schema comparison MUST be deep (nested objects, array items, enums)
- Optional fields becoming required is a BREAKING change
- New optional fields in responses are ADDITIVE (safe)
- Every endpoint MUST have documented request/response schemas
