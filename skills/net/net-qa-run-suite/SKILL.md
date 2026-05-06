---
name: net-qa-run-suite
description: "Execute a named QA suite and consolidate raw results"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Run Suite

## Purpose

Run a QA suite such as functional, regression, smoke, performance, SAST, or DAST and consolidate the result.

## Output
- `.cloud/qa/reports/{date}/{suite}/report.md`
- raw evidence under `.qa-reports/`

## Execution Flow

1. Identify the suite and required environment.
2. Execute the relevant commands or document the blocker.
3. Capture:
   - start/end time
   - executed scope
   - pass/fail counts
   - blocker conditions
4. Save or update the report.

## Rules
- Never hide blocked or skipped execution.
- A blocked suite still requires a report.
- Evidence paths must be explicit.
