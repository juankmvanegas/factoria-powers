---
name: validate-integration
description: "Verify that backend and frontend communicate correctly"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Integration

## Purpose

Verify end-to-end that the frontend can communicate with the backend. Goes beyond `/sync-contracts` — verifies the actual integration. Works by reading the OpenAPI spec and the project files of the involved factories directly (and via the Task tool when a factory lives in a separate repo) — no external server is involved.

## Verifications

### 1. Contracts (delegates to /sync-contracts)
- OpenAPI matches code on both sides (backend factory + frontend factory)

### 2. Compatible Types
- Backend DTOs serialize correctly to JSON
- Frontend DTOs deserialize correctly from JSON
- Property names match (camelCase in JSON)
- Data types are compatible (DateTime → string ISO, int → number)

### 3. Compatible Auth
- Backend expects Bearer token → Frontend sends Bearer token (e.g. via MSAL)
- Roles that backend validates → Frontend verifies with its route/role guard
- Auth scopes match what the backend expects

### 4. Compatible Error Handling
- Backend returns ErrorResponse → Frontend handles with interceptor
- Status codes: backend sends 400/401/404/500 → frontend interprets them
- Error messages do not expose internal details

### 5. URLs and Routes
- Frontend base URL points to the correct backend
- Frontend routes match OpenAPI paths
- Gateway / APIM headers configured correctly (if applicable)

### 6. Compatible Pagination
- Backend returns format `{ data, totalCount, page, pageSize }`
- Frontend expects and consumes that same format

## Output

```
INTEGRATION VALIDATION — {date}
════════════════════════════════

CONTRACTS         ✅ Synchronized (N/N endpoints)
TYPES             ✅ Compatible (N/N schemas)
AUTH              ✅ Frontend token → Bearer → backend authorization
ERROR HANDLING    ✅ ErrorResponse compatible
URLs              ⚠️ Frontend points to localhost (update for prod)
PAGINATION        ✅ Compatible format

STATUS: READY FOR INTEGRATION
```

## Rules

- ALWAYS run after completing features in Full Stack
- If there is a type incompatibility → BLOCKER
- If there is an auth incompatibility → BLOCKER
