# /qa-automation-plan

Plans what QA coverage should be automated first.

## What it does
Prioritizes scenarios and cases for automation and records the chosen layer, tooling, and rationale in `.cloud/qa/automation/automation-plan.md`.

## Instructions
1. Read scenarios, test cases, and current test coverage
2. Classify each case as unit/API/integration/smoke/manual
3. Prioritize high-value stable flows
4. Update `.cloud/qa/automation/automation-plan.md`

## Usage
```text
/qa-automation-plan [feature, module, release]
```
