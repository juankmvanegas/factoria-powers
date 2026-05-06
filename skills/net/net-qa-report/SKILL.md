---
name: net-qa-report
description: "Generate a QA report and release recommendation from execution data"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Report

## Purpose

Create a human-readable QA summary after one suite or a full validation cycle.

## Output
- `.cloud/qa/reports/{date}/{suite}/report.md`

## Rules
- Summaries must include risk, not just counts.
- Recommendation must be explicit: GO / GO WITH RISKS / NO-GO.
- Open critical defects or critical findings force NO-GO unless an approved exception exists.
