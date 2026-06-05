---
name: ang-qa-plan
description: "Create the Angular QA plan for a feature, migration, or release"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Plan

## Purpose

Translate the QA strategy into suites, execution order, environments, and exit criteria.

## Output
- `.cloud/qa/plans/test-plan.md`

## Rules
- Ensure `.cloud/qa/context/work-item-context.md` exists when the work is tied to Azure DevOps. If it is missing, capture the work item context first.
- Ensure `.cloud/qa/strategy/qa-strategy.md` exists before planning.
- The plan must trace back to the Azure DevOps work item context when one exists.
- Ensure the output is written inside `.cloud/qa/plans/`, never outside the QA workspace.
- Do not continue to downstream QA steps until the plan file exists and is updated.
