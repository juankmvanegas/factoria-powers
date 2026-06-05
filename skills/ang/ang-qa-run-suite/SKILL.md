---
name: ang-qa-run-suite
description: "Execute a named Angular QA suite and capture evidence"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Run Suite

## Purpose

Execute functional, regression, visual, performance, SAST, or DAST suites and consolidate the result.

## Output
- `.cloud/qa/reports/{date}/{suite}/report.md`
- evidence under `.qa-reports/`

## Rules
- Verify upstream QA artifacts exist before executing a suite.
- If required scenarios, cases, or traceability are missing, create or update them first.
- Curated reports go in `.cloud/qa/reports/`; raw evidence goes in `.qa-reports/`.
- For performance suites, prefer the `k6` MCP server before shell fallback tooling.
