---
name: next-security-scan
description: "Use when code has been written or modified and security policy compliance needs to be verified"
---

---
name: security-scan
description: "Automatic security scan against corporate policies (Next.js)"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan (Next.js — Auto-Activated)

## Purpose

Automatically validate that code complies with security-policy.md and corporate policies. Activates without user intervention as part of the development flow. Tailored for Next.js 14 security concerns including Server/Client Component boundaries, environment variable exposure, authentication middleware, and route handler security.

## Activates automatically when

- `package.json` or `package-lock.json` is modified (dependency changes)
- `next.config.js` or `next.config.mjs` is modified
- `middleware.ts` is created or modified
- Pages, API routes, or components are created or modified
- Environment files (`.env*`) are created or modified
- Authentication configuration is modified
- `/add-feature`, `/migration-execute`, or `/sprint` is executed touching infrastructure code

## Does NOT activate when

- Changes only in domain entities or value objects (pure business logic)
- Changes only in DTOs without logic
- Changes only in test files
- Changes only in documentation

## Automatic Flow

```
Change detected (dependencies, config, routes, components)
    |
1. Dependency vulnerability scan
    |
2. Secrets and environment variable scan
    |
3. Insecure pattern scan
    |
4. All clean?
   |-- YES -> Continue chain (-> calidad -> /documentacion)
   |-- NO -> Classify severity -> Report to user
              |-- CRITICAL/HIGH -> BLOCK delivery until resolution
              |-- MEDIUM/LOW -> Warn, do not block
```

## Scans

### 1. Dependency Vulnerabilities

```bash
npm audit --audit-level=high
```

**Evaluation:**
- **Critical/High** vulnerabilities -> BLOCK — report package, advisory, and safe version
- **Medium/Low** vulnerabilities -> WARN — suggest update

### 2. Environment Variables and Secrets

Search for prohibited patterns in versioned files (not in `.gitignore`):

```
Pattern                                    Severity
---------------------------------------------------
NEXT_PUBLIC_.*SECRET                       CRITICAL
NEXT_PUBLIC_.*KEY.*=.*[A-Za-z0-9]{20,}    CRITICAL
password\s*[:=]\s*["'][^"']+              CRITICAL
-----BEGIN.*PRIVATE KEY-----               CRITICAL
Bearer\s+[A-Za-z0-9\-._~+/]+=*          HIGH
NEXT_PUBLIC_.*TOKEN                        HIGH
```

**NEXT_PUBLIC_ prefix rule**: Variables with `NEXT_PUBLIC_` are exposed to the browser. NEVER use this prefix for:
- API secrets or keys
- Database credentials
- Authentication tokens
- Internal service URLs

**Context before reporting** (per security-policy.md):
1. Is the file in `.gitignore`? -> WARNING, not CRITICAL
2. Is it a `.env.example` with placeholder values? -> Ignore
3. Is it `NEXT_PUBLIC_` with a non-sensitive value (app name, public URL)? -> INFO

### 3. Insecure Code Patterns

| Pattern | Problem | Severity |
|---------|---------|----------|
| `dangerouslySetInnerHTML` without DOMPurify | XSS vector | CRITICAL |
| `eval()` or `new Function()` | Code injection | CRITICAL |
| `fetch()` with hardcoded credentials | Secret exposure | CRITICAL |
| Missing `middleware.ts` with `(protected)/` routes | Auth bypass | HIGH |
| `getServerSession()` not used in protected API routes | Auth bypass | HIGH |
| Missing security headers in `next.config.js` | Header injection | HIGH |
| `cors` configured with `origin: '*'` | Open CORS | HIGH |
| `console.log` with sensitive data (token, password) | Data leak in logs | MEDIUM |
| `.env.local` not in `.gitignore` | Credential exposure risk | MEDIUM |
| Missing `.env.example` file | Developer onboarding gap | LOW |

### 4. Security Architecture Validation

| Verification | Expected |
|-------------|----------|
| Security headers | `next.config.js` has `headers()` with CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Auth middleware | `middleware.ts` exists and protects `/(protected)/` routes |
| Server-side auth | `getServerSession()` used in API routes, not client-side token checks |
| Environment isolation | `.env.local` in `.gitignore`, `.env.example` exists with placeholders |
| CSRF protection | Auth forms include CSRF tokens (NextAuth handles this automatically) |
| Route handler security | API routes validate input, return proper error responses, no secrets in error messages |

## Report

### Output format

```
Security Scan — {Project}
=========================

Dependencies:  OK No vulnerabilities / WARNING 2 medium / FAIL 1 critical
Env Variables: OK Clean / FAIL 3 findings
Code:          OK No insecure patterns / WARNING 2 warnings
Headers:       OK Configured / FAIL Missing CSP

--------------------------
CRITICAL: {description} -> {file}:{line}
  Fix: {suggestion}

HIGH: {description} -> {file}:{line}
  Fix: {suggestion}
--------------------------

Result: PASS / FAIL (blocking if CRITICAL or HIGH)
```

### Behavior by severity

| Severity | Action |
|----------|--------|
| CRITICAL | BLOCK — Fix before continuing chain |
| HIGH | BLOCK — Fix before continuing chain |
| MEDIUM | WARN — Continue chain with warning |
| LOW | WARN — Continue chain |
| INFO | Log only |

## Auto-correction

The skill can **auto-correct** simple issues without asking:

- Add `.env.local` to `.gitignore` if missing
- Create `.env.example` from `.env.local` with placeholder values
- Remove `console.log` statements containing sensitive variable names
- Add basic security headers to `next.config.js` if none exist

For CRITICAL and HIGH requiring architectural decisions -> always escalate to user.

## Chain Integration

This skill runs **first** in the automatic chain:

```
Code -> [security-scan] -> verify-logic -> [calidad] -> /documentacion
```

If the scan fails with CRITICAL/HIGH, the chain stops until resolution.

## Rules

- ALWAYS check context before reporting (`.gitignore`, placeholders, public values)
- NEVER report false positives from `.env.example` placeholder values
- ALWAYS suggest the specific fix, not just the problem
- NEVER auto-correct CRITICAL/HIGH issues — escalate to user
- ALWAYS run `npm audit` if there were `package.json` changes
- ALWAYS verify `NEXT_PUBLIC_` variables do not contain secrets
- Reference: `.cloud/policies/security-policy.md` as source of truth
