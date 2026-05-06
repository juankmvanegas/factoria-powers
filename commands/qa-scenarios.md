# /qa-scenarios

Generates QA scenarios from requirements, contracts, or code.

## What it does
Creates a scenario catalog in `.cloud/qa/scenarios/` covering happy path, negative paths, edge cases, integrations, and parity checks when migrating.

## Instructions
1. Read the requirement, code, or contract
2. Identify business, validation, auth, integration, and regression-sensitive scenarios
3. Assign identifiers and priorities
4. Save the result in `.cloud/qa/scenarios/{feature-or-module}.scenarios.md`

## Usage
```text
/qa-scenarios [feature or module]
```
