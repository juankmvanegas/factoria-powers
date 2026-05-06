---
name: dataeng-validate-contracts
description: "Validate that new service API contracts are compatible with the legacy"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Ensure that the migrated API endpoints return the same structure as the legacy. Clients calling the old API must work with the new one WITHOUT CHANGES. Contract compatibility is sacred in a migration.

This skill is the compatibility guardian. If a field changes name, if a type changes, if a route disappears — this skill detects it before it reaches production.

---

## Execution Flow

### Phase 1: Legacy Contract Extraction

Obtain the legacy API contracts:

1. **Primary source**: Read `.cloud/planning/legacy-discovery/apis.md`
   - For each documented endpoint extract:
     - HTTP method (GET, POST, PUT, DELETE, PATCH)
     - Full route (e.g., `/api/v1/items/{id}`)
     - Route and query string parameters
     - Request body (fields, types, required/optional)
     - Response body (fields, types, nesting)
     - Possible HTTP status codes
     - Required headers (especially Authorization)

2. **Secondary source**: If legacy Swagger/OpenAPI exists, use it as reference
3. **Tertiary source**: If legacy integration tests exist, extract contracts from tests

Create temporary legacy contract structure for comparison.

### Phase 2: New Contract Extraction

Obtain the migrated API contracts:

1. **Controllers**: Read all controllers in the migrated project
   - Extract routes from `[Route]`, `[HttpGet]`, `[HttpPost]`, etc.
   - Extract parameters from `[FromBody]`, `[FromQuery]`, `[FromRoute]`
   - Extract return types from `ActionResult<T>`, `IActionResult`

2. **Input DTOs**: For each endpoint, identify the request DTO
   - List all fields with their types
   - Identify required vs optional fields
   - Identify FluentValidation rules that affect the contract

3. **Output DTOs**: For each endpoint, identify the response DTO
   - List all fields with their types
   - Verify object nesting
   - Verify collections and their inner types

4. **Status Codes**: For each endpoint
   - Read `[ProducesResponseType]` attributes
   - Analyze code to detect `return Ok()`, `return NotFound()`, etc.
   - Document all possible response codes

5. **Authentication/Authorization**
   - Verify `[Authorize]`, `[AllowAnonymous]` attributes
   - Verify authorization policies
   - Verify required roles

### Phase 3: Detailed Comparison

For EACH endpoint, perform field-by-field comparison:

#### 3.1 Route Comparison
- ✅ Identical route
- ⚠️ Different route but with documented redirect
- ❌ Different route without redirect → BREAKING CHANGE

#### 3.2 HTTP Method Comparison
- ✅ Same HTTP method
- ❌ Different method → BREAKING CHANGE (always)

#### 3.3 Request Body Comparison
For each field in the legacy request:
- ✅ Field exists in new with same name and type
- ⚠️ Field exists but is now optional (was required) → evaluate impact
- ❌ Field does not exist in new → BREAKING CHANGE
- ❌ Field changed type → BREAKING CHANGE
- ❌ Field changed name → BREAKING CHANGE
- ✅ New field added as optional → OK (additive, does not break)
- ⚠️ New field added as required → BREAKING CHANGE for existing requests

#### 3.4 Response Body Comparison
For each field in the legacy response:
- ✅ Field exists in new with same name and type
- ⚠️ New field added → OK (additive, clients ignore it)
- ❌ Field removed → BREAKING CHANGE
- ❌ Field changed type → BREAKING CHANGE
- ❌ Field changed name → BREAKING CHANGE
- ❌ Nesting changed (flat field now object, or vice versa) → BREAKING CHANGE
- ❌ Collection type changed (array now object, or vice versa) → BREAKING CHANGE

#### 3.5 Status Code Comparison
- ✅ Same status codes
- ⚠️ New codes added (e.g., 429 Too Many Requests) → generally OK
- ❌ Code removed that clients handle → evaluate impact
- ❌ Success code changed (200 → 201) → BREAKING CHANGE

#### 3.6 Authentication Comparison
- ✅ Same auth requirements
- ❌ Endpoint now requires auth (was public) → BREAKING CHANGE
- ⚠️ Endpoint now public (was authenticated) → evaluate security

### Phase 4: Breaking Changes Report

Generate report in `.cloud/planning/contract-validation/[module]-contracts.md`:

```markdown
# Contract Validation — [Module]
**Date**: {date}
**Overall Result**: ✅ COMPATIBLE / ⚠️ COMPATIBLE WITH WARNINGS / ❌ BREAKING CHANGES

## Summary
| Metric | Value |
|--------|-------|
| Legacy endpoints | N |
| New endpoints | N |
| Exact matches | N |
| Compatible with warnings | N |
| Breaking changes | N |
| New endpoints (no legacy) | N |
| Missing legacy endpoints | N |

## Detail by Endpoint

### [GET /api/v1/items] — ✅ Compatible
- Route: ✅ Identical
- Method: ✅ GET
- Request: ✅ N/A (no body)
- Response: ✅ Identical fields + 1 new field (createdAt)
- Status codes: ✅ 200, 404
- Auth: ✅ [Authorize] in both

### [POST /api/v1/items] — ❌ Breaking Change
- Route: ✅ Identical
- Method: ✅ POST
- Request: ❌ Field 'categoryId' renamed to 'category_id'
- Response: ✅ Compatible
- Status codes: ⚠️ New code 422
- Auth: ✅ Identical

## Breaking Changes Found
| # | Endpoint | Field | Change Type | Detail |
|---|----------|-------|-------------|--------|
| 1 | POST /api/v1/items | request.categoryId | Renamed | categoryId → category_id |

## Warnings
| # | Endpoint | Field | Detail |
|---|----------|-------|--------|
| 1 | GET /api/v1/items | response.createdAt | New field added (additive, does not break) |

## Missing Legacy Endpoints
[Endpoints that exist in legacy but not in new — CRITICAL]

## New Endpoints
[Endpoints that exist in new but not in legacy — OK, they are additions]
```

### Phase 5: Breaking Change Resolution

If breaking changes are found:

1. **Present to user** with full detail
2. **If user APPROVES the breaking change**: Document as "Intentional Breaking Change", create migration guide, register in audit-trail
3. **If user does NOT approve**: Fix the contract to match legacy, re-run validation

---

## Strict Rules

1. **ALWAYS** run during migration after verify-logic
2. **Breaking changes are BLOCKED by default** — require explicit user approval
3. **New fields in responses are OK** — they are additive and do not break existing clients
4. **Removed fields are ALWAYS breaking** — no exceptions
5. **Type changes are ALWAYS breaking**
6. **Route changes need redirect documentation**
7. **Compare with the REAL legacy**, not what it "should be" — the legacy contract is the truth
8. **Do not assume clients are flexible** — treat every change as potentially breaking
9. **Document ALL changes**, even non-breaking ones, for traceability
10. **Notify audit-trail** when a breaking change is approved

---

## Change Types: Quick Reference

### Non-Breaking (OK without approval)
- Add optional field to request
- Add field to response
- Add new endpoint (that did not exist in legacy)
- Add new HTTP status code
- Relax validation (required field → optional)

### Breaking (requires approval)
- Remove response field
- Remove endpoint
- Rename field (request or response)
- Change field type
- Change route without redirect
- Change HTTP method
- Make optional field → required in request
- Change nesting structure
- Add authentication requirement
- Change date, number, or enum format
