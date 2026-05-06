---
name: next-smoke-tests
description: "Use when verifying that critical paths of the application still work after a deployment or significant change"
---

---
name: smoke-tests
description: "Post-migration smoke tests — verify that the service actually works end-to-end"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests (Next.js)

## Purpose

Run post-migration or post-deployment smoke tests to verify that the Next.js application actually works end-to-end. Validates build, dev server, page rendering, authentication flow, API routes, and absence of console errors.

## Execution Flow — 6 Steps

### Step 1: Build Verification

```bash
# Verificar que el proyecto compila sin errores
npm run build
```

If build fails → STOP. Report errors. Do not proceed with smoke tests on a broken build.

### Step 2: Dev Server Startup

```bash
# Iniciar servidor de desarrollo en background
npm run dev &
DEV_PID=$!

# Esperar a que el servidor este listo (maximo 30 segundos)
npx wait-on http://localhost:3000 --timeout 30000
```

If server does not start → STOP. Kill process. Report startup errors.

### Step 3: Page Rendering Tests

Verify that key pages render without errors:
- `/` — home page returns 200
- `/login` or `/auth/signin` — auth page returns 200
- Protected routes — redirect to login when unauthenticated (302/307)
- `/api/health` — health endpoint returns 200 (if exists)

Use `curl` or Playwright for automated checks:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```

### Step 4: API Route Verification

For each API route in `app/api/`:
- Send a basic request (GET for read endpoints, POST with minimal body for write)
- Verify response status is not 500
- Verify response content-type is `application/json` (for JSON APIs)
- Verify error responses have proper structure

### Step 5: Authentication Flow

If auth is configured (NextAuth, middleware.ts):
- Verify `/api/auth/providers` returns configured providers
- Verify protected pages redirect unauthenticated users
- Verify middleware.ts intercepts requests to `/(protected)/` routes
- Verify CSRF token is present in auth forms

### Step 6: Report

```
Smoke Tests — {Project Name}
═════════════════════════════

Build:          ✅ PASS (12.3s)
Dev Server:     ✅ Started on :3000
Pages:          ✅ 8/8 pages render correctly
API Routes:     ✅ 5/5 routes respond (no 500s)
Authentication: ✅ Middleware active, redirects working
Console Errors: ✅ None detected

Result: ALL SMOKE TESTS PASSED
```

Kill dev server after tests:
```bash
kill $DEV_PID 2>/dev/null
```

## Rules

- ALWAYS run `npm run build` first — never skip the build check
- ALWAYS kill the dev server after tests complete
- NEVER leave background processes running
- NEVER test against production URLs — only localhost
- ALWAYS report exact error messages for failures, not generic summaries
- If Playwright is available, prefer it over curl for page rendering tests
- If more than 2 smoke tests fail, flag as BLOCKER for the migration step
