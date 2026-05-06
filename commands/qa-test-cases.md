# /qa-test-cases

Creates detailed QA test cases and updates the traceability matrix.

## What it does
Converts scenarios into executable test cases with data, steps, expected results, and execution type.

## Instructions
1. Read the related scenario file in `.cloud/qa/scenarios/`
2. Generate one or more test cases per scenario
3. Mark each case as manual, automated, or hybrid
4. Update:
   - `.cloud/qa/cases/{feature-or-module}.cases.md`
   - `.cloud/qa/automation/traceability-matrix.md`

## Usage
```text
/qa-test-cases [feature or module]
```
