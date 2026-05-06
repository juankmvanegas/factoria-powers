---
name: net-qa-scenarios
description: "Generate functional and risk-based QA scenarios from requirements or code"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Scenarios

## Purpose

Generate scenario catalogs for a feature, release, or migrated module.

## Output
- `.cloud/qa/scenarios/{feature-or-module}.scenarios.md`

## Execution Flow

1. Read the requirement, code, PRP, or contract.
2. Identify:
   - happy path scenarios
   - validation failures
   - edge cases
   - auth and permission cases
   - integration dependency failures
   - regression-sensitive paths
3. Group scenarios by risk and priority.
4. Save the scenario document with unique scenario identifiers.

## Rules
- Always include negative scenarios.
- For migrations, include legacy parity scenarios.
- For externally integrated flows, include dependency outage scenarios.
