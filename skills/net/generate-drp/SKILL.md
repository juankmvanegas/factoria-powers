---
name: net-generate-drp
description: "Use when documenting a development request plan before starting a new feature, architectural change, or database migration"
---

# Skill: Generate Development Request Plan (DRP)

## Purpose
Generate a complete DRP document for a new feature, bug fix, or refactoring task,
ensuring all architectural, testing, security, and deployment aspects are covered.

## When to Use
- Before starting any new feature development
- Before making significant architectural changes
- Before database migrations
- Before adding new external service integrations

## Inputs Required
1. **Feature description** - What needs to be built or changed
2. **Business context** - Why this is needed
3. **Scope** - What's included and excluded

## Output
A filled `drp-[feature-name].md` following the template in `.cloud/planning/drp-current.md`.

## Rules
1. Every DRP must identify affected layers
2. Every DRP must include a testing plan
3. Every DRP must include a security checklist
4. If database changes are needed, a separate `migration-plan.md` must be generated
5. Migration plans require explicit approval before execution
6. New ADRs must be proposed if the feature introduces architectural decisions
7. DRP must reference relevant existing ADRs

## Process
1. Read the feature request/description
2. Read `.cloud/architecture/current.md` to understand current state
3. Read relevant ADRs in `.cloud/architecture/decisions/`
4. Read `.cloud/policies/security-policy.md` for security checklist
5. Read `.cloud/policies/testing-policy.md` for test plan structure
6. Fill in the DRP template with specific details
7. Identify if new ADRs are needed
8. Flag any migration requirements
