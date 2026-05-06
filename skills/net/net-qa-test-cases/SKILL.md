---
name: net-qa-test-cases
description: "Generate detailed QA test cases with traceability and execution type"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Test Cases

## Purpose

Turn scenarios into concrete test cases that can be executed manually or automated.

## Output
- `.cloud/qa/cases/{feature-or-module}.cases.md`
- `.cloud/qa/automation/traceability-matrix.md`

## Execution Flow

1. Read the related scenario file.
2. For each scenario, create one or more test cases with:
   - id
   - preconditions
   - data
   - steps
   - expected result
   - execution type
   - severity and priority
3. Update the traceability matrix.

## Rules
- Each test case must have one primary objective.
- Execution type must be explicit.
- Critical requirements must map to at least one executable test case.
