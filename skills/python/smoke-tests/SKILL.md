---
name: python-smoke-tests
description: "Use when verifying that critical paths of the application still work after a deployment or significant change"
---

---
name: smoke-tests
description: "Post-migration smoke tests — start server, hit endpoints, verify responses and DB state"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

Execute end-to-end smoke tests after a migration or deployment. Starts the actual server, makes real HTTP requests to all endpoints, verifies responses, and checks database state. This is the final validation before declaring a migration complete.

## When to Use

- After completing a migration module
- Before cutting over from legacy to new system
- After deployment to a new environment
- As a final confidence check

## Execution Flow — 6 Strict Steps

1. **Prepare environment** — Verify:
   - All dependencies installed (`pip install -e ".[dev]"`)
   - Database is accessible and migrated (Alembic migrations applied)
   - Environment variables are set (use `.env.test` or test config)
   - No port conflicts on the test port

2. **Start the server** — Launch the FastAPI application:
   - Start with `uvicorn {app_module}:app --port {test_port}` in background
   - Wait for health endpoint to respond
   - Set a timeout (30 seconds max for startup)

3. **Hit all endpoints** — For each registered route:
   - Send request with valid test data
   - Verify response status code matches expected
   - Verify response body structure matches schema
   - Verify response time is within acceptable limits (< 2s)
   - Record results per endpoint

4. **Verify database state** — After write operations:
   - Check that records were created/updated correctly
   - Verify foreign key relationships are intact
   - Verify no orphaned records
   - Check that timestamps are populated

5. **Cleanup** — After all tests:
   - Stop the server process
   - Rollback test database to clean state
   - Remove any test artifacts (uploaded files, cache entries)

6. **Generate smoke test report** — Output:
   - Endpoints tested: {N}/{total}
   - Pass/fail per endpoint
   - Response time per endpoint
   - Database verification results
   - Overall verdict: PASS / FAIL
   - Failed endpoints with details for debugging

## Auto-Shielding

- NEVER run smoke tests against a production database
- NEVER leave the test server running after completion
- ALWAYS clean up test data after execution
- ALWAYS use a dedicated test port to avoid conflicts
- If any endpoint fails, continue testing remaining endpoints (do not stop early)

## Rules

- Smoke tests use REAL HTTP requests, not test client mocks
- Every registered endpoint MUST be tested (no skipping)
- Write operations MUST verify the database side effect
- The health endpoint MUST respond within 5 seconds of server start
- Smoke test results are saved to `.cloud/planning/smoke-test-{date}.md`
- A single endpoint failure means the overall smoke test FAILS
