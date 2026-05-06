---
name: next-validate-contracts
description: "Use when checking that API contracts between frontend and backend (or between microservices) are still honored"
---

---
name: validate-contracts
description: "Validate that frontend adapters/DTOs match backend API contracts"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Validate that the Next.js frontend adapters, DTOs, and fetch calls match the backend API contracts. Compares frontend code against the OpenAPI spec or actual backend routes to detect mismatches in URLs, HTTP methods, request/response shapes, and field types.

## Execution Flow — 5 Steps

### Step 1: Locate Contract Sources

Identify available contract references:

1. **OpenAPI spec** — `.cloud/contracts/openapi.yaml` (preferred source of truth)
2. **Backend project path** — if provided by the orchestrator (read-only access)
3. **API route handlers** — `app/api/` routes within the Next.js project itself

Priority: OpenAPI > backend code > local API routes.

### Step 2: Inventory Frontend Adapters

Scan the frontend code for:
- `src/infrastructure/adapters/*.ts` — HTTP adapter implementations
- `src/application/dtos/*.ts` — input/output DTOs
- `fetch()` calls, `axios` calls, or custom HTTP client usage
- URL patterns and HTTP methods used

Extract for each adapter:
- Target URL path (e.g., `/api/notes`, `/api/users/:id`)
- HTTP method (GET, POST, PUT, DELETE, PATCH)
- Request body type (input DTO fields)
- Expected response type (output DTO fields)

### Step 3: Compare Against Contract

For each frontend adapter, compare:

| Check | Frontend | Contract | Match? |
|-------|----------|----------|--------|
| URL path | `/api/notes` | `/api/notes` | ✅ |
| HTTP method | `POST` | `POST` | ✅ |
| Request field `title` | `string` | `string` | ✅ |
| Request field `priority` | `number` | `string` (enum) | ❌ |
| Response field `createdAt` | `string` | `Date` (ISO 8601) | ⚠️ |

### Step 4: Classify Discrepancies

| Severity | Condition |
|----------|-----------|
| **BLOCKER** | URL mismatch — frontend calls an endpoint that does not exist |
| **BLOCKER** | HTTP method mismatch — frontend uses POST, contract defines GET |
| **BLOCKER** | Required field missing — frontend does not send a required field |
| **HIGH** | Type mismatch — frontend sends `number`, contract expects `string` |
| **MEDIUM** | Extra field — frontend sends a field not in the contract |
| **LOW** | Optional field missing — frontend does not send an optional field |

### Step 5: Report

```
Contract Validation — {Project Name}
═════════════════════════════════════

Source: OpenAPI spec (.cloud/contracts/openapi.yaml)
Adapters checked: 12
Endpoints validated: 18

Results:
  ✅ Matching: 15/18
  ❌ BLOCKER: 1 — POST /api/orders uses wrong URL (frontend: /api/order)
  ⚠️ HIGH: 1 — GET /api/users/:id response field "role" type mismatch
  ℹ️ LOW: 1 — Optional field "metadata" not sent by frontend

Action Required:
  Fix 1 BLOCKER and 1 HIGH before deployment.
```

## Rules

- NEVER modify backend code — this skill is read-only for backend projects
- ALWAYS use OpenAPI as source of truth when available
- ALWAYS report BLOCKERs prominently — they prevent deployment
- NEVER ignore type mismatches — even `string` vs `String` matters in TypeScript
- ALWAYS check both request and response shapes, not just URLs
- If no OpenAPI spec exists and no backend path is provided, report as INCOMPLETE validation
