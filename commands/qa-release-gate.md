# /qa-release-gate

Consolidates all QA evidence into a release recommendation.

## What it does
Reads functional, regression, performance, SAST, and DAST reports and produces a final GO / GO WITH RISKS / NO-GO decision.

## Instructions
1. Read the latest reports in `.cloud/qa/reports/`
2. Validate that all mandatory suites were executed
3. Summarize open defects, risks, and accepted exceptions
4. Save `.cloud/qa/reports/{date}/release-gate.md`

## Usage
```text
/qa-release-gate [release or candidate]
```
