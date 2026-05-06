---
name: net-qa-automation-plan
description: "Plan what QA scenarios should be automated first and how"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Automation Plan

## Purpose

Define the automation backlog and the correct layer for each scenario.

## Output
- `.cloud/qa/automation/automation-plan.md`

## Execution Flow

1. Read scenarios, test cases, and the current test landscape.
2. Classify each case as:
   - unit-level support
   - API automation
   - integration automation
   - smoke/regression
   - manual only
3. Prioritize automation by risk and recurrence.
4. Record tooling assumptions and dependencies.

## Rules
- Automate stable high-value flows first.
- Do not force UI automation for cases better covered at API level.
- Explain manual-only decisions clearly.
