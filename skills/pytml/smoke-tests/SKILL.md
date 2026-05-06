---
name: pytml-smoke-tests
description: "Post-migration smoke tests — verify that the service actually works end-to-end"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

After unit tests pass, verify that the service ACTUALLY WORKS. Not just that it compiles. Not just that unit tests pass. That it actually starts up, responds, and behaves correctly.

Smoke tests are the last line of defense before considering a module as "migrated". They detect the classic problem: "compiles perfectly, tests pass, but the service crashes on startup".

---

## Execution Flow

### Phase 1: Build Verification

Verify clean compilation:

1. Run `dotnet build` on the project/solution
2. Verify there are NO:
   - Compilation errors
   - Warnings treated as errors
   - Broken references between projects
   - Unresolved NuGet packages
3. If the build fails → STOP → Do not continue with smoke tests → Report

Expected result: Clean build with no errors.

### Phase 2: Startup Test

Verify that the service can start without crashing:

1. **Program.cs / Startup**
   - Read the entry file (Program.cs)
   - Verify the host configuration is correct
   - Verify all `builder.Services.Add*` have their implementations
   - Verify the middleware pipeline is in correct order

2. **Dependency Registration (DI)**
   - List ALL interfaces registered in DI
   - Verify EACH interface has a registered implementation
   - Verify there are no conflicting duplicate registrations
   - Verify scopes (Singleton/Scoped/Transient) are correct:
     - Singleton must not depend on Scoped
     - DbContext must be Scoped
     - HttpClient factories must be registered correctly

3. **Configuration**
   - Verify appsettings.json exists and is valid JSON
   - Verify appsettings.Development.json exists
   - Verify all sections referenced in `IOptions<T>` have configuration
   - Verify connection strings exist (may be Key Vault references)

Expected result: The service should be able to start without DI or configuration exceptions.

### Phase 3: Endpoint Verification

Based on the service type, verify endpoints are correctly registered:

#### For REST services (API):
1. Verify ALL controllers inherit from `ControllerBase` or equivalent
2. Verify each controller has route attributes (`[Route]`, `[ApiController]`)
3. Verify each action method has an HTTP attribute (`[HttpGet]`, `[HttpPost]`, etc.)
4. Verify methods return correct types (`ActionResult<T>`, `IActionResult`)
5. Verify Swagger/OpenAPI is configured (if applicable)
6. List ALL available endpoints with their routes

#### For gRPC services:
1. Verify .proto files exist and are valid
2. Verify service implementations inherit from the generated base class
3. Verify services are registered in `MapGrpcService<T>()`
4. Verify proto messages match DTOs

#### For Messaging services (Event Bus):
1. Verify consumers/subscribers are registered
2. Verify each subscription has its handler
3. Verify message types match between publisher and subscriber
4. Verify queue/topic configuration

#### For CronJobs / Background Services:
1. Verify jobs are registered as `IHostedService` or equivalent
2. Verify schedules are configured
3. Verify jobs have error handling (try/catch with logging)
4. Verify jobs are idempotent (or at least document it)

### Phase 4: Dependency Verification (DI Deep Check)

Deep analysis of injected dependencies:

1. **Full DI graph resolution**
   - For each registered service, verify ALL its dependencies are also registered
   - Detect missing dependencies (interface registered but implementation not found)
   - Detect dependency cycles

2. **AutoMapper verification**
   - Verify profiles exist for all used mappings
   - Verify source and destination types are compatible
   - Detect unmapped properties that should be mapped

3. **FluentValidation verification**
   - Verify validators are registered in DI
   - Verify each input DTO has its validator
   - Verify validation rules cover required fields

4. **Middleware verification**
   - Verify exception middleware is registered
   - Verify authentication middleware is in correct order
   - Verify CORS is configured (if it's a public API)

### Phase 5: Configuration Verification

Exhaustive configuration check:

1. **appsettings.json**
   - All required sections exist
   - Default values are reasonable
   - No hardcoded secrets (connection strings with real passwords)

2. **Environment variables**
   - List environment variables referenced in code
   - Verify they have default values or documentation

3. **Azure Key Vault**
   - If Key Vault is used, verify references have correct format
   - Verify Key Vault initialization code is present

4. **Feature Flags**
   - If feature flags are used, verify they are configured
   - Verify code handles both states (on/off)

### Phase 6: Report

Generate complete report in `.cloud/planning/smoke-tests/[module]-smoke.md`:

```markdown
# Smoke Tests — [Module]
**Date**: {date}
**Overall Result**: ✅ PASS / ❌ FAIL

## Summary
| Check | Result | Detail |
|-------|--------|--------|
| Build | ✅/❌ | [detail] |
| Startup | ✅/❌ | [detail] |
| Endpoints | ✅/❌ | [N endpoints verified] |
| DI | ✅/❌ | [N services verified] |
| Configuration | ✅/❌ | [detail] |

## Endpoints Found
| Method | Route | Controller | Status |
|--------|-------|------------|--------|
| GET | /api/v1/items | ItemsController | ✅ |
| POST | /api/v1/items | ItemsController | ✅ |
...

## DI Dependencies
| Interface | Implementation | Scope | Status |
|-----------|---------------|-------|--------|
| IItemService | ItemService | Scoped | ✅ |
| IRepository<Item> | ItemRepository | Scoped | ✅ |
...

## Problems Found
1. [Problem description]
   - Severity: CRITICAL / WARNING
   - Recommended action: [what to do]

## Verdict
[PASS: Ready for deployment / FAIL: Requires corrections before continuing]
```

---

## Strict Rules

1. **ALWAYS** run after unit tests pass in migration context
2. **Smoke tests do NOT replace integration tests** — they detect "compiles but doesn't work" problems
3. **If ANY smoke test fails → BLOCK deployment** and report
4. **Mandatory chain**: verify-logic → unit tests → smoke tests → documentation
5. **Do not modify code** during smoke tests — only read and analyze
6. **Report ALL problems**, not just the first one found
7. **Be specific** in reports — "IItemService registration missing" is useful, "there's a DI problem" is not
8. **Smoke tests are fast** — do not run the actual service, only intelligent static analysis
9. **Each module has its own report** — do not mix smoke tests from different modules
10. **Notify audit-trail** when smoke tests complete (pass or fail)

---

## Integration with Other Skills

- **verify-logic**: Smoke tests run AFTER verify-logic
- **validate-contracts**: Endpoints found in smoke tests feed contract validation
- **rollback-plan**: If smoke tests fail, the rollback plan is activated
- **audit-trail**: Smoke test results are automatically recorded
- **health-check**: Smoke tests cover a subset of what health-check verifies
- **dashboard**: Smoke test status is reflected in the migration dashboard

---

## Usage Example

```
User: /smoke-tests
Claude: Running smoke tests for [detected module]...

Phase 1 — Build: ✅ Clean compile (0 errors, 0 warnings)
Phase 2 — Startup: ✅ Valid Program.cs, 23 DI services registered
Phase 3 — Endpoints: ✅ 8 REST endpoints verified
Phase 4 — DI: ⚠️ 22/23 services resolve — INotificationService has no registered implementation
Phase 5 — Configuration: ✅ appsettings complete, Key Vault configured

Result: ⚠️ PASS WITH WARNINGS
- 1 DI service without implementation (INotificationService)
- Report saved to .cloud/planning/smoke-tests/module-x-smoke.md
```
