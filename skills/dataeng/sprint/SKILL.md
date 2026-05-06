---
name: dataeng-sprint
description: "Quick tasks without planning overhead — bug fixes, minor adjustments"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute quick, low-risk tasks without the need to create a full PRP. Ideal for bug fixes, minor adjustments, small refactors, and configuration changes.

## When to Use Sprint

- Bug fixes with known root cause
- Configuration adjustments
- Small refactors (rename, move, extract method)
- Typo or documentation fixes
- Validation adjustments
- Cosmetic changes to API responses

## When NOT to Use Sprint

- New features → use `/add-feature` or `/prp` + `/bucle-agentico`
- Changes affecting multiple layers → use `/prp`
- Architecture changes → use `/prp` with ADR
- Migrations → use migration workflow

## Execution Flow

### Step 1: Understand the Problem

1. Read the user's description
2. Locate the affected code
3. Confirm the root cause (for bugs) or scope (for adjustments)

### Step 2: Execute

1. Make the change
2. If the prompt includes third-party documentation (OpenAPI/endpoints), use it to generate or update adapters in `Infrastructure/Services/{Provider}/`
3. If the prompt includes a connection string, configure it in user secrets or `appsettings.Testing.json` (NEVER in source code) to run integration tests
4. Verify build: `dotnet build`
5. If production code was modified → `/generate-tests` is automatically invoked for the affected service
6. Run tests: `dotnet test`

### Step 3: Document (Automatic Chain)

After tests pass:
1. `/documentacion` activates automatically and updates CHANGELOG.md
2. If a recurring pattern was discovered, suggest creating a Learning

The chain is: code changed → `/generate-tests` (if production code) → `/documentacion` auto.

## Auto-Shielding

If any test fails or the build breaks:
1. Read the full error
2. Identify the affected layer (Core, Application, Infrastructure, Initialization)
3. Fix in the corresponding layer
4. Verify build: `dotnet build`
5. Re-run tests: `dotnet test`
6. Document the error and solution (auto-shielding via `/documentacion`)
7. Maximum 3 attempts. If not resolved, STOP and report to the user.

## Rules

- ALWAYS follow the project's code standards (naming, patterns, etc.)
- ALWAYS follow security policies (no secrets, validate input, etc.)
- ALWAYS generate or update tests if production code is modified
- ALWAYS update documentation if the change affects visible behavior
- ALWAYS verify that it builds and tests pass before reporting completion
- If during execution the change turns out to be more complex than expected, STOP and suggest the user create a PRP
- Do NOT create ADRs — if the change requires an ADR, it is too large for Sprint
