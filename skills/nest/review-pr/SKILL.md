---
name: review-pr
description: "Review code against all policies, ADRs, and BFF standards"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Purpose

Review code changes against all Factoria policies, ADRs, and NestJS BFF standards.

## Execution Flow

### Step 1: Load Policies

Read all 3 policies: security-policy, testing-policy, coding-standards

### Step 2: Architecture Review

- [ ] Code distributed in 3 layers correctly
- [ ] No cross-layer dependency violations
- [ ] Controllers don't contain business logic
- [ ] BFF only aggregates/transforms — no domain calculations

### Step 3: Security Review

- [ ] No secrets in code
- [ ] No `console.log` — only custom logger
- [ ] Authorization header handling correct
- [ ] Custom exceptions used (no raw errors)
- [ ] class-validator in all DTOs
- [ ] No `any` types

### Step 4: Testing Review

- [ ] Tests exist for all changed services
- [ ] AAA pattern followed
- [ ] Coverage >= 90%
- [ ] Mocks properly organized

### Step 5: Documentation Review

- [ ] Swagger decorators on all controllers
- [ ] OpenAPI spec updated if endpoints changed
- [ ] CHANGELOG updated

### Step 6: Report

Generate review report with PASS/FAIL per check and severity level.

## Rules

- BLOCK delivery on CRITICAL or HIGH violations
- Always check ALL policies, not just the obvious ones
- Flag business logic in BFF as CRITICAL
