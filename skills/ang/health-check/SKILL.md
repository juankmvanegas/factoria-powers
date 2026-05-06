---
name: ang-health-check
description: "Use when auditing the overall health of the codebase — technical debt, test coverage gaps, architecture drift"
---

---
name: health-check
description: "Full Angular project diagnostic against Factoria standards (0-100)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Health Check

## Purpose

Evaluate the Angular project's health against Factoria-Ang standards. Score from 0 to 100.

## Categories (100 points)

### Architecture (20 points)
- [ ] Correct 3 layers (5)
- [ ] Inter-layer dependencies respected (5)
- [ ] Application without concrete dependencies (5)
- [ ] Lazy loading configured (5)

### Standards (20 points)
- [ ] Naming conventions followed (5)
- [ ] Inline templates (5)
- [ ] Path aliases configured (5)
- [ ] TypeScript strict mode (5)

### Security (25 points)
- [ ] No secrets in code (10)
- [ ] MSAL configured correctly (5)
- [ ] No bypassSecurityTrust without justification (5)
- [ ] Error handling without technical details (5)

### Testing (20 points)
- [ ] Specs present for services (10)
- [ ] Tests pass (5)
- [ ] Edge cases covered (5)

### Documentation (10 points)
- [ ] CHANGELOG updated (3)
- [ ] BUSINESS_LOGIC.md exists (3)
- [ ] ADRs documented (4)

### Packages (5 points)
- [ ] Only authorized dependencies (3)
- [ ] package-lock.json committed (2)

## Scale

| Score | Status |
|-------|--------|
| 90-100 | Excellent — Factoria compliant |
| 70-89 | Acceptable — Improvements recommended |
| < 70 | Requires remediation |

## Output

Generates `.cloud/planning/health-check/health.md`
