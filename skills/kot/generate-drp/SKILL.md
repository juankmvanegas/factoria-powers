# Skill: Generate Development Request Plan (DRP)

## Purpose
Generate a complete DRP document for a new feature, bug fix, or refactoring task,
ensuring that all architectural, testing, security, and deployment aspects are covered.

## When to Use
- Before starting any new feature development
- Before making significant architectural changes
- Before database migrations (Room)
- Before adding new integrations with external services
- Before modifying Azure B2C configuration

## Inputs Required
1. **Feature description** — What needs to be built or changed
2. **Business context** — Why it is needed
3. **Scope** — What is included and excluded

## Output
A `drp-[feature-name].md` filled out following the template in `.cloud/planning/drp-current.md`.

## Rules
1. Each DRP must identify affected layers (presentation, application, infrastructure, data)
2. Each DRP must include a testing plan (unit, integration, UI)
3. Each DRP must include a security checklist (ProGuard, SQLCipher, MSAL)
4. If Room changes are needed, a separate `migration-plan.md` must be generated
5. Migration plans require explicit approval before execution
6. New ADRs must be proposed if the feature introduces architectural decisions
7. The DRP must reference relevant existing ADRs

## Process
1. Read the feature request/description
2. Read `.cloud/architecture/current.md` to understand current state
3. Read relevant ADRs in `.cloud/architecture/decisions/`
4. Read `.cloud/policies/security-policy.md` for security checklist
5. Read `.cloud/policies/testing-policy.md` for test plan structure
6. Fill in the DRP template with specific details
7. Identify if new ADRs are needed
8. Flag any migration requirements
