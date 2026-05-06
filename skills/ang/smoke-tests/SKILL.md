---
name: smoke-tests
description: "Post-migration Angular smoke tests — verify the app works"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

Verify that the Angular application actually works after a migration.

## Verifications

### 1. Build
```bash
ng build --configuration production
```
- No errors
- No critical warnings
- Reasonable bundle size

### 2. Lint
```bash
ng lint
```
- No errors

### 3. Tests
```bash
ng test --watch=false --browsers=ChromeHeadless
```
- All pass

### 4. Routing
- Verify that all routes from the plan are defined
- Verify lazy loading is configured
- Verify guards are applied

### 5. DI
- Verify that all providers are registered
- No injection errors on build

### 6. Auth (if applicable)
- MSAL providers configured
- Guards registered
- Login/logout routes defined

## Output

```markdown
# Smoke Tests: {module}

| Test | Status | Detail |
|------|--------|--------|
| Production build | ✅/❌ | |
| Lint | ✅/❌ | |
| Unit tests | ✅/❌ | X/Y pass |
| Routes defined | ✅/❌ | N routes |
| DI configured | ✅/❌ | |
| Auth configured | ✅/❌/N/A | |
```
