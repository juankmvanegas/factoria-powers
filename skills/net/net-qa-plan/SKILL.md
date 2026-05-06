---
name: net-qa-plan
description: "Create the QA test plan for a feature, migration, or release"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Plan

## Purpose

Convert the QA strategy into an actionable test plan with suites, order, environments, risks, and owners.

## Output
- `.cloud/qa/plans/test-plan.md`

## Execution Flow

1. Read the current QA strategy and requirement context.
2. Enumerate suites:
   - functional
   - regression
   - integration
   - performance
   - SAST
   - DAST
3. Define execution order and dependency rules.
4. Document environments, data needs, and entry/exit criteria.
5. Update the plan file.

## Rules
- Critical suites must be explicit, not implied.
- The plan must state what blocks release.
- If the plan changes after execution starts, update the rationale.
