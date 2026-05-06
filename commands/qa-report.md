# /qa-report

Generates a QA report and explicit delivery recommendation.

## What it does
Summarizes execution results, evidence, risks, and open defects, and emits a recommendation of GO, GO WITH RISKS, or NO-GO.

## Instructions
1. Read the latest suite outputs and defect summary
2. Consolidate counts, risks, and evidence
3. Save the result in `.cloud/qa/reports/{date}/{suite}/report.md`

## Usage
```text
/qa-report [suite or release]
```
