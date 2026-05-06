---
name: python-health-check
description: "Use when auditing the overall health of the codebase — technical debt, test coverage gaps, architecture drift"
---

---
name: health-check
description: "Full project diagnostic with 0-100 score across architecture, testing, quality, security, and docs"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Purpose

Run a comprehensive diagnostic on the Python/FastAPI project and produce a health score from 0 to 100. Evaluates architecture compliance, test coverage, code quality, security posture, documentation completeness, and dependency freshness.

## When to Use

- At the start of a new session to understand project state
- Before a release to verify project health
- Periodically to track quality trends
- After major changes to verify no degradation
- context: fork (read-only)

## Execution Flow — 7 Strict Steps

1. **Architecture compliance (25 points)** — Evaluate:
   - Layer separation (domain has no framework imports) — 10 pts
   - Import-linter contracts all pass — 5 pts
   - Port/adapter pattern properly implemented — 5 pts
   - No circular dependencies — 5 pts
   - Run: `lint-imports` and analyze results

2. **Test coverage (25 points)** — Evaluate:
   - Unit test coverage >= 80% — 10 pts
   - Integration test coverage >= 60% — 5 pts
   - Architecture tests present and passing — 5 pts
   - All tests green — 5 pts
   - Run: `pytest --cov=src/ --cov-report=term-missing -q`

3. **Code quality (20 points)** — Evaluate:
   - Ruff: zero violations — 8 pts
   - Mypy: zero errors — 7 pts
   - No functions > 50 lines — 5 pts
   - Run: `ruff check src/`, `mypy src/`

4. **Security (15 points)** — Evaluate:
   - No hardcoded secrets — 5 pts
   - No known CVEs in dependencies — 5 pts
   - Input validation on all endpoints — 3 pts
   - Proper error handling (no leaked stack traces) — 2 pts
   - Run: `pip-audit` (if available)

5. **Documentation (10 points)** — Evaluate:
   - CLAUDE.md present and current — 3 pts
   - Architecture docs present — 3 pts
   - API documentation (OpenAPI auto-generated) — 2 pts
   - CHANGELOG.md maintained — 2 pts

6. **Dependency freshness (5 points)** — Evaluate:
   - No dependencies > 2 major versions behind — 3 pts
   - No deprecated packages — 2 pts

7. **Generate health report** — Output:
   - Overall score: {N}/100
   - Score breakdown by category
   - Top 5 issues to fix (prioritized by point impact)
   - Trend comparison (if previous health check exists)
   - Pass/fail verdict (>= 70 = pass)

## Auto-Shielding

- NEVER modify any code during health check
- NEVER skip a category even if tools are not available (report as "unable to evaluate")
- ALWAYS run actual tools (ruff, mypy, pytest) — do not estimate scores
- ALWAYS save the report to `.cloud/planning/health-check-{date}.md`

## Rules

- Health check is strictly READ-ONLY and diagnostic
- Scores MUST be based on actual tool output, not estimates
- A score below 70 is a FAIL — list remediation steps
- Previous health check reports are kept for trend tracking
- If a tool is not installed, deduct 0 points but note it as "not evaluated"
- The report MUST be reproducible — same code state = same score
