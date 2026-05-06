---
name: ang-review-pr
description: "Use when reviewing a pull request — checks code quality, policy compliance, ADR adherence, and test coverage"
---

---
name: review-pr
description: "PR review against all Factoria Angular policies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Review PR

## Purpose

Review code against all Factoria-Ang policies.

## Review Categories

1. **Architecture**: Does it respect 3 layers? Correct dependencies?
2. **Naming**: Does it follow conventions? Files named correctly?
3. **TypeScript**: Strict mode? Explicit types? No `any`?
4. **DI**: Abstract classes? providedIn root? Correct registrations?
5. **Templates**: Inline? No templateUrl?
6. **CSS**: ITCSS? Correct prefixes (.o-, .c-, .u-)?
7. **Security**: No bypassSecurityTrust? No secrets? MSAL correct?
8. **Testing**: Tests present? AAA pattern? Edge cases?

## Severities

- **BLOCKER**: Violates security or architecture policy
- **CRITICAL**: Does not meet mandatory standard
- **WARNING**: Recommended improvement
- **INFO**: Suggestion

## Output

```markdown
# PR Review: {title}

## Summary
- Blockers: N
- Critical: N
- Warnings: N

## Findings
| # | File | Line | Severity | Category | Description |
```

## Source of Truth

This skill validates against corporate policies:
- **`.cloud/policies/coding-standards.md`** — Categories 1-6 (architecture, naming, TypeScript, DI, templates, CSS)
- **`.cloud/policies/security-policy.md`** — Category 7 (XSS, secrets, MSAL, CSP)
- **`.cloud/policies/testing-policy.md`** — Category 8 (tests, coverage, patterns)

In case of any doubt or conflict between this skill and the policies, **policies win**.
