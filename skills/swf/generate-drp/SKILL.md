# Skill: Generate Disaster Recovery Plan (DRP)

## Purpose
Generate a complete DRP document for a new feature, bug fix, or refactoring task,
ensuring all architectural, testing, security, and deployment aspects are covered
for the iOS/Swift project.

## When to Use
- Before starting any new feature development
- Before making significant architectural changes
- Before Realm database migrations
- Before adding new external service integrations (MSAL, Firebase, etc.)
- Before SPM module restructuring

## Inputs Required
1. **Feature description** — What needs to be built or changed
2. **Business context** — Why this is needed
3. **Scope** — What's included and excluded

## Output
A filled `drp-[feature-name].md` in `.cloud/planning/`.

## Process
1. Read the feature request/description
2. Read `.cloud/architecture/current.md` to understand current state
3. Read relevant ADRs in `.cloud/architecture/decisions/`
4. Read `.cloud/policies/security-policy.md` for security checklist
5. Read `.cloud/policies/testing-policy.md` for test plan structure
6. Analyze current project for risks:
   - SPM dependency conflicts
   - Realm schema migration risks
   - Keychain/encryption data loss scenarios
   - Firebase configuration drift
   - MSAL token invalidation risks
   - Coordinator navigation state corruption
7. Create DRP with recovery procedures for each identified risk
8. Define rollback steps for each change
9. Save to `.cloud/planning/drp-[feature-name].md`

## DRP Template Structure
```markdown
# DRP: [Feature Name]

## Overview
[Brief description of the feature and its impact]

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|

## Affected Modules
[List of SPM modules affected]

## Recovery Procedures
### Scenario 1: [Risk Name]
1. Detection: [How to detect]
2. Response: [Immediate actions]
3. Recovery: [Steps to recover]
4. Verification: [How to confirm recovery]

## Rollback Plan
[Step-by-step rollback instructions]

## Testing Plan
[Tests required before deployment]

## Security Checklist
[Security items to verify]
```

## Auto-Shielding
- **ABORT** if no `.cloud/architecture/current.md` exists — architecture must be documented first
- **ABORT** if the feature touches Realm schemas without a migration plan
- **WARN** if more than 5 SPM modules are affected

## Rules
1. Every DRP must identify affected SPM modules
2. Every DRP must include a testing plan covering unit, integration, and UI tests
3. Every DRP must include a security checklist aligned with security-policy.md
4. If Realm schema changes are needed, a separate migration plan must be included
5. New ADRs must be proposed if the feature introduces architectural decisions
6. DRP must reference relevant existing ADRs
7. Recovery procedures must include Keychain and encrypted data recovery when applicable
