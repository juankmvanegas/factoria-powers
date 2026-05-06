---
name: nest-review-pr
description: "Use when reviewing a pull request — checks code quality, policy compliance, ADR adherence, and test coverage"
---

---
name: review-pr
description: "Review code against all policies, ADRs, and BFF standards"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Review PR

## Purpose

Review code changes against all Factoria policies, ADRs, and NestJS BFF standards.

## Multi-Pass Strategy

For PRs with more than 5 changed files, use a two-pass approach to prevent attention dilution:

### Pass 1: Per-File Local Analysis
Review each changed file individually for local violations:
- Per-file policy compliance (naming, patterns, security)
- Per-file architecture rules (correct layer, correct imports)
- Per-file code quality (no `any`, no `console.log`, class-validator, Swagger decorators)

### Pass 2: Cross-File Integration Analysis
After all files are reviewed individually, do a separate cross-cutting pass:
- Cross-layer dependency violations (imports across boundaries)
- Provider registration completeness (new services registered in modules?)
- Contract consistency (DTOs match between layers, OpenAPI matches controllers)
- Test coverage for all changed services

For PRs with 5 or fewer files, both passes can be combined in a single review.

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

### Step 6: Report with Validation-Retry Structure

Generate review report with structured validation results per check.

**For each violation found, use this format (enables automated retry):**

```markdown
### VIOLATION: [check-id]
- **severity**: CRITICAL | HIGH | MEDIUM | LOW
- **file**: path/to/file.ts:lineNumber
- **rule**: [policy or ADR name that was violated]
- **expected**: [what the code should do/be]
- **actual**: [what the code currently does/is]
- **fix**: [specific action to resolve — NOT "fix this"]
```

**Example:**
```markdown
### VIOLATION: arch-cross-layer
- **severity**: CRITICAL
- **file**: src/api/controllers/notes.controller.ts:42
- **rule**: ADR-001 Clean Architecture 3 Layers
- **expected**: Controller imports only from @application/*
- **actual**: Controller imports ScBmsNotesService from @infrastructure/services/
- **fix**: Replace direct infrastructure import with abstract class from application/abstractions/
```

When the agent receives these violations and retries, it knows EXACTLY which field failed,
what was expected, and what to fix — no generic "try again" messages.

## Rules

- BLOCK delivery on CRITICAL or HIGH violations
- Always check ALL policies, not just the obvious ones
- Flag business logic in BFF as CRITICAL
- NEVER report a generic "violation found" — always include expected vs actual
- Group violations by severity: CRITICAL first, then HIGH, MEDIUM, LOW
