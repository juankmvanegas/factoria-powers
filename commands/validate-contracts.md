# /validate-contracts

Validates that API contracts between legacy and new implementation are compatible.

## What it does
Compares routes, DTOs, response formats, and status codes between the legacy API and the new implementation.

## Instructions
1. Read the legacy API contracts (from discovery docs or OpenAPI spec)
2. Read the new implementation's controllers and DTOs
3. Compare: routes, HTTP methods, request/response shapes, status codes
4. Report any breaking changes or incompatibilities
5. Suggest fixes for any mismatches found

## Usage
```
/validate-contracts [module or endpoint]
```
