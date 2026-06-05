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

1. Ensure `.cloud/qa/context/work-item-context.md` exists when the work is tied to Azure DevOps. If it is missing, capture the work item context first.
2. Ensure `.cloud/qa/strategy/qa-strategy.md` exists. If it does not, create or update it first.
3. Ensure `.cloud/qa/plans/test-plan.md` exists in the correct location.
4. Read the current QA strategy and requirement context.
5. Enumerate suites:
   - functional
   - regression
   - integration
   - performance
   - SAST
   - DAST
6. Define execution order and dependency rules.
7. Document environments, data needs, and entry/exit criteria.
8. Update the plan file.

## Rules
- The plan must trace back to the Azure DevOps work item context when one exists.
- Critical suites must be explicit, not implied.
- The plan must state what blocks release.
- If the plan changes after execution starts, update the rationale.
- Do not continue to downstream QA steps until the plan file exists and is updated.
