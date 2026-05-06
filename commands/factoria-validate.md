# /factoria-validate [factory]

Run a full compliance check of recent code changes against the active factory's policies, ADRs, and enforcement rules.

Equivalent to invoking skill `factoria:validate-compliance`.

## Checks performed

1. Naming conventions (classes, files, methods)
2. Secret detection (hardcoded passwords, API keys)
3. Architecture layer dependencies
4. Golden-path package list
5. Import aliases
6. DI registration completeness
7. Commit convention compliance
8. Branch naming
9. Architecture tests (where applicable)
10. OpenAPI drift
11. Changelog entries
12. Post-change test suite

## Output

A `COMPLIANCE REPORT` with ✅ PASS or ❌ BLOCK per check, plus fix instructions for each violation.
