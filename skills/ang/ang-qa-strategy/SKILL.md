---
name: ang-qa-strategy
description: "Create or update the Angular QA strategy for a feature, route, or release"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Strategy

## Purpose

Create a risk-based QA strategy for Angular work, including visual and integration concerns.

## Inputs
- Azure DevOps work item id when available
- Feature, route, requirement, or release context

## Output
- `.cloud/qa/context/work-item-context.md`
- `.cloud/qa/strategy/qa-strategy.md`

## Rules
- Ensure the complete `.cloud/qa/` workspace exists before writing strategy artifacts.
- If `.cloud/qa/` or any mandatory QA file is missing, create it first.
- If the user did not provide an Azure DevOps work item id, ask for it before continuing with QA planning.
- Read the Azure DevOps work item when it exists and persist its functional summary, acceptance criteria, and QA notes in `.cloud/qa/context/work-item-context.md`.
- Use the Azure DevOps work item as the default functional source of truth when it exists.
- Always include visual risk when the UI changes.
- Explicitly state when performance or security suites are required.
- If downstream QA files are missing, create draft placeholders so the QA chain can continue without breaking structure.
