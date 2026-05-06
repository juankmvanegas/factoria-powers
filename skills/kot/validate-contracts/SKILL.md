---
name: kot-validate-contracts
description: "Validate API contracts between implementations"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Validate Contracts — API Validation

## Purpose

Compare endpoints, DTOs, response formats, and status codes between the expected API (OpenAPI spec or documentation) and the current consumption implementation.

## When to Use

- After migrating legacy API clients
- After updating Retrofit services
- Before releases involving API changes
- When the backend updates its contract

## Inputs

1. **API Contract** (at least one):
   - OpenAPI spec (YAML/JSON)
   - Swagger URL
   - API documentation
   - Legacy reference code

2. **Current implementation**:
   - Retrofit service interfaces
   - Request/response DTOs

## Validations

### 1. Endpoints
| Aspect | Validate |
|--------|----------|
| Paths | Do they match exactly? |
| Methods | Are GET, POST, PUT, DELETE correct? |
| Query params | Are all required ones present? |
| Path params | Do names match? |

### 2. Request Body
| Aspect | Validate |
|--------|----------|
| JSON structure | Do fields match? |
| Field names | Case sensitive match? |
| Field types | Int, String, Boolean, etc.? |
| Required fields | All present in DTO? |
| Optional fields | Nullable in Kotlin? |

### 3. Response Body
| Aspect | Validate |
|--------|----------|
| Success response | Does DTO map correctly? |
| Error response | Is error handling correct? |
| Pagination | Does structure match? |

### 4. Headers
| Aspect | Validate |
|--------|----------|
| Auth | Bearer token configured? |
| Content-Type | application/json? |
| Custom headers | Included in interceptor? |

## Output

```markdown
# Contract Validation — [API Name]

## Summary
- Endpoints validated: X
- Matches: Y
- Mismatches: Z

## ✅ Matches
- [x] GET /users → UsersApi.getUsers()
- [x] POST /login → AuthApi.login()

## ❌ Mismatches

### Breaking Changes
| Endpoint | Problem | Severity |
|----------|---------|----------|
| GET /users/{id} | Field `email` missing in DTO | 🔴 BLOCK |

### Non-Breaking
| Endpoint | Problem | Severity |
|----------|---------|----------|
| GET /products | Extra field `discount` ignored | 🟡 WARN |

## Recommendations
1. Add field `email` to UserDto
2. Consider adding `discount` to ProductDto
```

## Severities

- **BLOCK** — Breaking change, cannot be deployed
- **WARN** — Works but data may be lost
- **INFO** — Minor difference, cosmetic
