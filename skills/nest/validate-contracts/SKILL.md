---
name: validate-contracts
description: "Validate API contract compatibility between Swagger spec and code"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Validate that the OpenAPI spec (`contrato-de-api.yml`) matches the actual controllers and DTOs in the codebase.

## Execution Flow

1. Read `src/api/contrato-de-api.yml`
2. Scan all controllers in `src/api/controllers/`
3. For each endpoint in the spec: verify controller method exists with matching route, method, and parameters
4. For each DTO referenced: verify it exists in `src/application/dtos/` with matching fields
5. Check for undocumented endpoints (in code but not in spec)
6. Check for orphaned spec entries (in spec but not in code)
7. Report discrepancies

## Rules

- Read-only — NEVER auto-fix
- Flag discrepancies as BLOCKER
- Report both directions: spec→code and code→spec
