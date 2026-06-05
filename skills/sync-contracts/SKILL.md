---
name: sync-contracts
description: "Synchronize OpenAPI with actual backend and frontend code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sync Contracts

## Purpose

Verify that the code from the involved factories complies with the OpenAPI contract. Detect divergences and report them. This is content-only: read the spec and the project files directly (and via the Task tool when a factory's code lives in a separate repo). Never call any external server to perform the sync.

## Flow

### Phase 1: Read OpenAPI

Read `.cloud/contracts/openapi.yaml` — the source of truth.

### Phase 2: Verify Backend

For each endpoint in the spec, against the backend factory's code (e.g. `net`, `pyt`, `nest`):

1. Find the corresponding Controller / router in the backend project
2. Verify that the method exists with the correct route
3. Verify that the request DTO matches the schema
4. Verify that the response DTO matches the schema
5. Verify response status codes
6. Verify auth requirements

> If the backend lives in a separate repo, read its files directly or dispatch a Task to inspect them — do not modify the backend.

### Phase 3: Verify Frontend

For each endpoint in the spec, against the frontend factory's code (`ang`):

1. Find the corresponding Adapter in the frontend project
2. Verify that the method exists
3. Verify that the URL and HTTP method match
4. Verify that the Input DTO matches the request schema
5. Verify that the Output DTO matches the response schema

### Phase 4: Report

```
SYNC CONTRACTS — {date}
═══════════════════════

OpenAPI Version: {version}
Endpoints: {N}

BACKEND (backend factory — e.g. net/pyt/nest)
  ✅ GET /notes          → NotesController.GetAll()
  ✅ POST /notes         → NotesController.Create()
  ❌ PUT /notes/{id}     → NOT FOUND
  ⚠️ DELETE /notes/{id}  → Exists but returns 200 instead of 204

FRONTEND (frontend factory — ang)
  ✅ GET /notes          → NotesAdapter.getAllNotes()
  ✅ POST /notes         → NotesAdapter.createNote()
  ❌ PUT /notes/{id}     → NOT FOUND
  ✅ DELETE /notes/{id}  → NotesAdapter.deleteNote()

DIVERGENCES:
| # | Endpoint | Side | Problem | Action |
|---|----------|------|---------|--------|
| 1 | PUT /notes/{id} | Backend | Not implemented | BLOCKER |
| 2 | PUT /notes/{id} | Frontend | Not implemented | BLOCKER |
| 3 | DELETE /notes/{id} | Backend | Incorrect status code | WARNING |
```

### Phase 5: Resolution

- **BLOCKER**: Stop and fix before continuing
- **WARNING**: Report, fix if user approves
- After corrections, re-run `/sync-contracts`

## Rules

- ALWAYS compare against the OpenAPI — never against the other side's code
- The OpenAPI is the source of truth, NOT the backend nor the frontend
- If the code is correct but the spec is wrong → update the spec (with approval)
