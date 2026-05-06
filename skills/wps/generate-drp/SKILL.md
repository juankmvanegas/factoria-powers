---
name: wps-generate-drp
description: "Generate a Disaster Recovery Plan for a WordPress feature or refactoring task"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate DRP

## Purpose
Generate a complete DRP document for a new feature, bug fix, or refactoring task, ensuring all block architecture, testing, security, and deployment aspects are covered.

## Execution Flow — 4 Strict Steps

### Step 1: Understand Scope
1. Identify which blocks are affected
2. Identify which components (atoms/molecules) are affected
3. Check for theme.json or functions.php changes
4. Identify CPT or REST API changes

### Step 2: Load Context
1. Read `CLAUDE.md` for architecture rules
2. Read relevant ADRs in `.cloud/architecture/decisions/`
3. Read `.cloud/policies/security-policy.md` for security checklist
4. Read `.cloud/policies/testing-policy.md` for test plan structure

### Step 3: Generate DRP
Create document with these sections:
```markdown
# DRP — {Feature Name}

## Scope
{What is being changed and why}

## Affected Assets
| Asset | Type | Risk |
{blocks, components, theme files}

## Build Recovery
{How to rebuild if build breaks}

## Rollback Plan
{Steps to revert changes}

## Test Plan
{What tests to run and expected results}

## Security Checklist
{Security items to verify}

## Deployment Steps
{Ordered deployment procedure}
```

### Step 4: Validate
1. Verify all affected blocks are listed
2. Verify rollback steps are actionable
3. Verify test plan covers changed code

## Rules
- **NEVER** create a DRP without a rollback plan
- **ALWAYS** include a testing plan
- **ALWAYS** include a security checklist
