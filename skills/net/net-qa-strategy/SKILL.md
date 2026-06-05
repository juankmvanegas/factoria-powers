---
name: net-qa-strategy
description: "Create or update the QA strategy for a feature, module, or release"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Strategy

## Purpose

Create a risk-based QA strategy before implementation or before a major validation cycle.

## Inputs
- Azure DevOps work item id when available
- Feature, requirement, PRP, release goal, or migration module
- Relevant contracts and architecture context

## Output
- `.cloud/qa/context/work-item-context.md`
- `.cloud/qa/strategy/qa-strategy.md`
- `.cloud/qa/README.md`
- `.cloud/qa/plans/test-plan.md` if missing
- `.cloud/qa/automation/traceability-matrix.md` if missing

## Execution Flow

1. Ensure the complete `.cloud/qa/` workspace exists. If directories or seed files are missing, create them first.
2. If the user did not provide an Azure DevOps work item id, ask for it before continuing with QA planning.
3. Read the Azure DevOps work item when it exists (via your Azure DevOps integration if available) and persist its functional summary, acceptance criteria, and QA notes in `.cloud/qa/context/work-item-context.md`.
4. Read the requirement and identify business-critical flows.
5. Identify risk areas:
   - business impact
   - security sensitivity
   - integration complexity
   - migration parity risk
   - performance sensitivity
6. Decide which suite types are mandatory.
7. Define entry criteria, exit criteria, and required evidence.
8. Write or update the strategy document using the template in `.cloud/qa/templates/`.
9. If `test-plan.md` or `traceability-matrix.md` do not exist, create them with draft placeholders so the downstream QA chain has a valid starting point.

## Rules
- Use the Azure DevOps work item as the default functional source of truth when it exists.
- Always document what is out of scope.
- Always justify when a specialized suite is not required.
- Prefer risk-based prioritization over exhaustive low-value coverage.
- Never leave the QA workspace partially scaffolded. If QA starts, `.cloud/qa/` must end the step in a valid usable state.

## Source of Truth

- `.cloud/policies/qa-policy.md`
- `.cloud/policies/performance-policy.md`
- `.cloud/policies/security-testing-policy.md`
