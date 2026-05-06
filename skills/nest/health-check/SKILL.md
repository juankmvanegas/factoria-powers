---
name: health-check
description: "Full project diagnostic against Factoria NestJS BFF standards"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Purpose

Run a comprehensive diagnostic of the NestJS BFF project against all Factoria standards.

## Checks

### Architecture
- [ ] 3-layer structure exists (api, infrastructure, application)
- [ ] No cross-layer dependency violations
- [ ] Controllers only inject application services
- [ ] libs/ structure correct (config, tracer, errors)

### Code Quality
- [ ] ESLint passes (`npm run lint`)
- [ ] No `any` types
- [ ] No `console.log` — only custom logger
- [ ] No commented-out code
- [ ] Constructor injection everywhere

### Testing
- [ ] Jest tests exist for all services
- [ ] Coverage >= 90% (`npm run test:cov`)
- [ ] AAA pattern followed

### Security
- [ ] No secrets in code or config
- [ ] Authorization header handling implemented
- [ ] Custom exception filter registered globally
- [ ] ValidationPipe registered globally
- [ ] class-validator in all DTOs

### Documentation
- [ ] Swagger decorators on all controllers
- [ ] contrato-de-api.yml up to date
- [ ] CHANGELOG.md current

### Dependencies
- [ ] Only approved packages in package.json
- [ ] No vulnerabilities (`npm audit`)

## Output

Report with pass/fail for each check, overall health score, and remediation steps for failures.

## Rules

- Read-only diagnostic — NEVER auto-fix
- Report ALL issues found
- Suggest specific remediation for each failure
