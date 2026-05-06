# /qa-run-suite

Executes a named QA suite and consolidates the result.

## What it does
Runs functional, regression, smoke, performance, SAST, or DAST suites and stores a report in `.cloud/qa/reports/`.

## Instructions
1. Identify the suite and environment
2. Execute the suite or document why it is blocked
3. Capture pass/fail/blocked counts and evidence
4. Save the report in `.cloud/qa/reports/{date}/{suite}/report.md`

## Usage
```text
/qa-run-suite [functional|regression|smoke|performance|sast|dast]
```
