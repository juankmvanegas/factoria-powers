---
name: security-scan
description: "Auto security validation on every code change — validates against security policy"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan

## Activates When

On EVERY code change — this skill ALWAYS runs as the first step in the auto-chain.

## Checks

### CRITICAL (blocks delivery)

- [ ] No secrets, API keys, or tokens in source code
- [ ] No connection strings in code or config files (only Key Vault)
- [ ] No `console.log` statements (only custom logger)
- [ ] No `any` types in TypeScript
- [ ] Custom exception filter registered globally in `main.ts`
- [ ] ValidationPipe registered globally in `main.ts`
- [ ] No business logic in BFF (aggregation/transformation only)

### HIGH (blocks delivery)

- [ ] class-validator decorators present in all DTOs
- [ ] Authorization header handling present (extract claims, don't validate)
- [ ] Error responses don't expose system details
- [ ] No raw `throw new Error()` — only custom exceptions from `libs/errors/`
- [ ] HttpService calls use proper error handling

### MEDIUM

- [ ] CORS configured per environment (not wildcard in production)
- [ ] Security headers configured (Helmet or equivalent)
- [ ] Rate limiting configured

### LOW

- [ ] No commented-out code
- [ ] No unused imports
- [ ] Proper access modifiers on class members

## Severity Classification

| Level | Action |
|-------|--------|
| CRITICAL | BLOCK — Must fix before any delivery |
| HIGH | BLOCK — Must fix before any delivery |
| MEDIUM | WARN — Should fix, document if deferred |
| LOW | INFO — Fix when convenient |

## Rules

- ALWAYS runs first in the auto-chain
- ALWAYS runs, even for "small" changes
- If CRITICAL or HIGH found: stop chain, report, require fix
- Check `.gitignore` for false positives (secrets in ignored files = WARNING, not CRITICAL)
