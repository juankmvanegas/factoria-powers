# /dast-scan

Runs formal dynamic application security testing against an approved non-production environment.

## What it does
Executes dynamic security validation for exposed backend behavior and stores a report in `.cloud/qa/reports/{date}/dast/report.md`.

## Instructions
1. Confirm the target environment is approved and non-production
2. Execute the DAST process
3. Document exploitable findings, evidence, and recommendation
4. Save the report

## Usage
```text
/dast-scan [environment or target]
```
