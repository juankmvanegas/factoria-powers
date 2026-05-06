---
name: validate-compliance
description: Use when code has been written or modified and needs to be checked against Factoria's policies, ADRs, and enforcement rules — serves as a textual version of the runtime hooks for CLIs that don't support .cjs enforcement
---

# Validate Compliance

This skill performs the same checks as the 12 Claude Code enforcement hooks (`.cjs` guards), but as a textual self-check for CLIs without runtime hook support.

## Prerequisite

Factory context must be loaded. If not: invoke skill `factoria:loading-factory-context` first.

## Check 1: Naming Guard

For each file created or modified:

| Factory | Rule |
|---|---|
| net | Services end with `Service`, Repositories end with `Repository`, Controllers end with `Controller`, no `Handler`, `Manager`, `Helper` suffixes |
| ang | Components end with `Component`, Services end with `Service`, Guards end with `Guard` |
| nest | Controllers end with `Controller`, Services end with `Service`, Guards end with `Guard` |
| next | Pages in `app/` or `pages/`, components in `components/` |
| python | Routers end with `router`, services end with `service` or `_service`, repos end with `repository` |

**Block if**: any class/file violates the naming convention.

## Check 2: Secrets Guard

Scan all new/modified files for:
- Connection strings with literal passwords (`Password=`, `pwd=`, `password:`)
- API keys or tokens hardcoded in source files
- Private keys or certificates embedded in code
- `appsettings.json` with non-placeholder secrets

**Block if**: any secret is detected. Fix: move to Key Vault / environment variable / secrets manager per ADR.

## Check 3: Architecture Guard

Verify layer dependencies are not violated:

| Factory | Dependency rule |
|---|---|
| net | Core → nothing; Application → Core only; Infrastructure → Application + Core; API → Application only |
| ang | Core → nothing; Application → Core; Infrastructure → Application; Presentation → Application |
| nest / next / python | Similar clean architecture constraints per factory CLAUDE.md |

**Block if**: a lower layer imports from a higher layer (e.g., Core importing from Application).

## Check 4: Golden Path Packages

Check that `package.json` / `*.csproj` / `pyproject.toml` only add packages in the factory's approved list (references/<factory>/CLAUDE.md — Technology Stack section).

**Block if**: an unapproved package is added without a corresponding new ADR approving it.

## Check 5: Import Aliases

Verify that cross-layer imports use the project's configured aliases, not relative paths that cross layer boundaries.

## Check 6: DI Registration

For every new service/repository/adapter created:
- Verify it is registered in the DI container file
- net: `*DependencyInjection.cs` | ang: `*.module.ts` | nest: `*.module.ts` | next: provider config | python: `dependencies.py`

**Block if**: a new class exists but is not registered.

## Check 7: Commit Convention

Before committing:
- Message format: `<type>(<scope>): <description>` — types: feat, fix, refactor, test, docs, chore
- No merge commits in feature branches
- No commits with broken tests

## Check 8: Branch Naming

Branch names must follow: `<type>/<ticket-or-description>` — e.g., `feat/user-auth`, `fix/login-500`

## Check 9: Architecture Tests

After changes to Infrastructure or API layers in net: verify `NetArchTest` tests still pass (`dotnet test --filter Category=Architecture`).

## Check 10: OpenAPI Drift

If the project has an OpenAPI spec: verify that any new/modified endpoint matches the spec. Drift without ADR approval is not allowed.

## Check 11: Changelog

After any feature or fix: verify `CHANGELOG.md` was updated with the change under `[Unreleased]`.

## Check 12: Post-Change Tests

After any code change: all tests must pass. Run the full test suite for the affected factory.

## Reporting

For each check:
- **PASS**: note it briefly
- **BLOCK**: state the rule, the specific violation, and the fix required

Format:
```
COMPLIANCE REPORT — <factory>
✅ Naming: OK
❌ Secrets: appsettings.Development.json line 12 has literal password. Move to Key Vault per ADR-008.
✅ Architecture: OK
...
```

## Red Flags

| Excuse | Reality |
|---|---|
| "It's just a dev config, not production" | Security policy applies to all environments. |
| "The tests will catch architecture violations" | Architecture tests might not run in your CI. Run manually. |
| "This is a small change" | Small changes accumulate into undetected drift. |
