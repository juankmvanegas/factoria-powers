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
- Feature, requirement, PRP, release goal, or migration module
- Relevant contracts and architecture context

## Output
- `.cloud/qa/strategy/qa-strategy.md`

## Execution Flow

1. Read the requirement and identify business-critical flows.
2. Identify risk areas:
   - business impact
   - security sensitivity
   - integration complexity
   - migration parity risk
   - performance sensitivity
3. Decide which suite types are mandatory.
4. Define entry criteria, exit criteria, and required evidence.
5. Write or update the strategy document using the template in `.cloud/qa/templates/`.

## Rules
- Always document what is out of scope.
- Always justify when a specialized suite is not required.
- Prefer risk-based prioritization over exhaustive low-value coverage.

## Source of Truth

- `.cloud/policies/qa-policy.md`
- `.cloud/policies/performance-policy.md`
- `.cloud/policies/security-testing-policy.md`
