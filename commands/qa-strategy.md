# /qa-strategy

Creates or updates the QA strategy for a feature, migration module, or release candidate.

## What it does
Builds a risk-based testing strategy covering functional, regression, performance, and security needs, and stores it in `.cloud/qa/strategy/qa-strategy.md`.

## Instructions
1. Read the requirement, PRP, contract, or migration context
2. Read:
   - `.cloud/policies/qa-policy.md`
   - `.cloud/policies/performance-policy.md`
   - `.cloud/policies/security-testing-policy.md`
3. Identify business-critical flows and risks
4. Define mandatory suite types, entry criteria, exit criteria, and evidence needs
5. Update `.cloud/qa/strategy/qa-strategy.md`

## Usage
```text
/qa-strategy [feature, module, release]
```
