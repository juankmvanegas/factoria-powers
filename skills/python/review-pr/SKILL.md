---
name: python-review-pr
description: "Use when reviewing a pull request — checks code quality, policy compliance, ADR adherence, and test coverage"
---

---
name: review-pr
description: "Review code changes against all Factoria policies for compliance"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Purpose

Review code changes against all Factoria policies (coding standards, security, testing) and ADR compliance. Produces a structured report with violations, severity levels, and remediation guidance.

## When to Use

- Before merging a pull request
- After completing a feature implementation
- As a quality gate in the development workflow
- When reviewing someone else's code changes

## Execution Flow — 6 Strict Steps

1. **Identify changes** — Run `git diff` (staged or against base branch) to get all changed files. Categorize by layer: domain, application, infrastructure, api, tests, config.

2. **Check coding standards** — Load `.cloud/policies/coding-standards.md`. Verify:
   - Naming conventions (snake_case functions, PascalCase classes)
   - Type hints on all function signatures
   - Docstrings on public functions and classes
   - Maximum function length and complexity
   - Proper use of async/await
   - No `# type: ignore` without justification
   - Run `ruff check` and `mypy` on changed files

3. **Check security policy** — Load `.cloud/policies/security-policy.md`. Verify:
   - No hardcoded secrets, tokens, or passwords
   - No SQL string concatenation (use parameterized queries)
   - Input validation on all API endpoints (Pydantic models)
   - Proper error handling (no stack traces in responses)
   - Authentication/authorization on protected endpoints
   - No `eval()`, `exec()`, or `pickle.loads()` on user input
   - Dependencies have no known CVEs: `pip-audit`

4. **Check testing policy** — Load `.cloud/policies/testing-policy.md`. Verify:
   - New code has corresponding tests
   - Test coverage meets minimum threshold
   - Tests follow naming conventions
   - No tests that depend on external services without mocks
   - Integration tests use proper test fixtures

5. **Check ADR compliance** — Load all ADRs from `.cloud/architecture/decisions/`. Verify:
   - Layer dependencies follow ADR-001 (Clean Architecture)
   - No violations of accepted architectural decisions
   - If a change contradicts an ADR, flag for review

6. **Generate review report** — Output structured report:
   - **CRITICAL** — Must fix before merge (security issues, broken architecture)
   - **HIGH** — Should fix before merge (missing tests, policy violations)
   - **MEDIUM** — Recommended fix (naming, documentation)
   - **LOW** — Suggestions (style, minor improvements)
   - Total violation count per category
   - Pass/fail verdict

## Auto-Shielding

- NEVER approve code with CRITICAL violations
- NEVER skip security policy checks
- ALWAYS run automated tools (ruff, mypy, pip-audit) in addition to manual review
- ALWAYS check architecture compliance regardless of change size

## Rules

- Every review MUST check all three policies (coding, security, testing)
- Security violations are always CRITICAL severity
- Missing tests for new use cases are always HIGH severity
- Architecture violations (wrong layer imports) are always CRITICAL severity
- The review report MUST include file paths and line numbers for each violation
- Positive feedback is encouraged — note well-written code and good patterns
