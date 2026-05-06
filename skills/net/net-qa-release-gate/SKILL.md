---
name: net-qa-release-gate
description: "Consolidate functional and specialized QA reports into a release recommendation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Release Gate

## Purpose

Consolidate functional, regression, performance, SAST, and DAST evidence into a final QA decision.

## Output
- `.cloud/qa/reports/{date}/release-gate.md`

## Gate Inputs
- Functional report
- Regression/smoke evidence
- Performance report if required
- SAST report if required
- DAST report if required
- Open defect summary

## Verdicts
- GO
- GO WITH RISKS
- NO-GO

## Rules
- A missing mandatory suite prevents GO.
- Open critical defects or exploitable critical findings force NO-GO.
- Risks accepted by exception must be listed explicitly.
