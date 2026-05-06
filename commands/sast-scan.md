# /sast-scan

Runs formal static application security testing.

## What it does
Reviews code, configuration, and dependencies for security findings and stores a report in `.cloud/qa/reports/{date}/sast/report.md`.

## Instructions
1. Run the approved static analysis process for the project
2. Classify findings by severity
3. Distinguish new findings from accepted risk when possible
4. Save the report and recommendation

## Usage
```text
/sast-scan [scope]
```
