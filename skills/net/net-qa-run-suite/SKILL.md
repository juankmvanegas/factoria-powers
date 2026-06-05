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

1. Verify that the upstream QA artifacts exist:
   - `qa-strategy.md`
   - `test-plan.md`
   - relevant scenario file
   - relevant case file
   - `traceability-matrix.md`
2. If any mandatory upstream artifact is missing, stop execution and create or update it first.
3. Identify the suite and required environment.
4. Execute the relevant commands or document the blocker.
   - For performance suites, prefer the k6 MCP server before shell fallback tooling if configured.
5. Capture:
   - start/end time
   - executed scope
   - pass/fail counts
   - blocker conditions
6. Save or update the report.

## Rules
- Never hide blocked or skipped execution.
- A blocked suite still requires a report.
- Evidence paths must be explicit.
- Do not treat raw execution as valid QA if the curated QA artifacts are missing.
