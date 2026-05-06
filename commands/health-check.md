# /health-check

Runs a comprehensive diagnostic of the project against Factoria standards.

## What it does
Checks architecture compliance, policy adherence, test coverage, dependency health, and documentation completeness.

## Instructions
1. Verify architecture rules (4-layer dependencies)
2. Run `dotnet build` to check compilation
3. Run `dotnet test` to check test status
4. Run `dotnet list package --vulnerable` for dependency security
5. Check that all policies in `.cloud/policies/` are being followed
6. Check documentation completeness (CHANGELOG, ADRs, README)
7. Generate a health report with pass/fail per category

## Usage
```
/health-check
```
