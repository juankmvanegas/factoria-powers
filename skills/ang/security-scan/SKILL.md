---
name: ang-security-scan
description: "Use when code has been written or modified and security policy compliance needs to be verified"
---

---
name: security-scan
description: "Automatic security scan against corporate policies (Angular)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
context: fork
---

# Skill: Security Scan (Angular — Auto-Activated)

## Purpose

Automatically validate that code complies with security-policy.md and corporate policies (OWASP Top 10, ISO 27000, NIST SP800-50, Colombian law 1581). Activates without user intervention as part of the development flow.

## Activates automatically when

- `package.json` is modified (dependency changes)
- **Configuration** files are created or modified (`app-settings*.ts`, `environment*.ts`)
- Infrastructure **services** are created or modified (HTTP adapters, MSAL, storage)
- **Interceptors**, **guards**, or **error handlers** are modified
- Files with `localStorage`/`sessionStorage` usage are created or modified
- `/add-feature`, `/migration-execute`, or `/sprint` is executed touching infrastructure

## Does NOT activate when

- Changes only in visual components (template/CSS without auth logic)
- Changes only in DTOs without logic
- Changes only in tests (`.spec.ts`)
- Changes only in documentation

## Automatic Flow

```
Change detected (dependencies, config, services, guards, interceptors)
    ↓
1. Vulnerable dependency scan
    ↓
2. Secrets in code scan
    ↓
3. Insecure pattern scan (XSS, auth, storage)
    ↓
4. All clean?
   ├── YES → Continue chain (→ /generate-tests → /documentacion)
   └── NO → Classify severity → Report to user
              ├── CRITICAL/HIGH → BLOCK delivery until resolution
              └── MEDIUM/LOW → Warn, do not block
```

## Scans

### 1. Vulnerable Dependencies

```bash
npm audit --json
```

**Evaluation:**
- **Critical/high** vulnerabilities → BLOCK — report package, advisory, and safe version
- **Moderate/low** vulnerabilities → WARN — suggest `npm audit fix`

### 2. Secrets in Code

Search for prohibited patterns in versioned files (not in `.gitignore`):

```
Pattern                              Severity
─────────────────────────────────────────────
apiKey\s*[:=]\s*['"][^'"]+         CRITICAL
secret\s*[:=]\s*['"][^'"]+         CRITICAL
password\s*[:=]\s*['"][^'"]+       CRITICAL
subscriptionKey.*['"][^'"]+        CRITICAL
Bearer\s+[A-Za-z0-9\-._~+/]+=*   HIGH
clientSecret.*['"][^'"]+           CRITICAL
```

**Context before reporting** (per security-policy.md section 12):
1. Is the file in `.gitignore`? → WARNING, not CRITICAL
2. Is it `app-settings.service.dev.ts` (which should be in `.gitignore`)? → Verify it IS ignored
3. Is it a placeholder (`YOUR_`, `TODO:`, `{{secret}}`)? → Ignore

### 3. Insecure Code Patterns

| Pattern | Problem | Severity |
|---------|---------|----------|
| `bypassSecurityTrustHtml` | XSS bypass | CRITICAL |
| `bypassSecurityTrustScript` | XSS bypass | CRITICAL |
| `bypassSecurityTrustUrl` | XSS bypass | CRITICAL |
| `bypassSecurityTrustResourceUrl` | XSS bypass | HIGH |
| `innerHTML` without prior sanitization | Potential XSS | HIGH |
| `localStorage.setItem` with tokens | Token exposure | CRITICAL |
| `sessionStorage.setItem` with tokens | Token exposure | HIGH |
| `eval(` | Code injection | CRITICAL |
| `new Function(` | Code injection | HIGH |
| `document.write` | XSS vector | HIGH |
| `window.location` with user input | Open redirect | MEDIUM |
| `http://` in API URLs (not https) | Unencrypted data in transit | HIGH |

### 4. Angular Security Architecture Validation

| Verification | Expected |
|-------------|----------|
| MSAL tokens | In memory, NEVER in localStorage |
| Guards configured | `BaseGuard` + `RoleGuard` on protected routes |
| Error handling | `GeneralHttpErrorInterceptor` present, no technical details to user |
| APIM keys | Via factory provider, not hardcoded |
| `app-settings.service.dev.ts` | In `.gitignore` |
| `package-lock.json` | Committed (dependency integrity) |
| Module Federation remotes | Only authorized domains in `microfrontends.json` |

### 5. CSP and Headers (passive verification)

Verify that documentation or configuration mentions:
- `script-src 'self'`
- `style-src 'self' 'unsafe-inline'`
- `connect-src` restricted to BFF/MSAL domains
- `frame-ancestors 'self'`

If no evidence of CSP configured → MEDIUM warning.

## Report

### Output format

```
Security Scan — {Project}
═══════════════════════════

Dependencies:  ✅ No vulnerabilities / ⚠️ 2 moderate / ❌ 1 critical
Secrets:       ✅ Clean / ❌ 3 findings
Code:          ✅ No insecure patterns / ⚠️ 2 warnings
Auth:          ✅ MSAL configured correctly

──────────────────────────
CRITICAL: {description} → {file}:{line}
  Fix: {suggestion}

HIGH: {description} → {file}:{line}
  Fix: {suggestion}
──────────────────────────

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

- Remove `http://` and replace with `https://` in API URLs
- Add `app-settings.service.dev.ts` to `.gitignore` if missing
- Remove `console.log` with sensitive data

For CRITICAL and HIGH requiring decisions (like `bypassSecurityTrust*`) → always escalate to user.

## Chain Integration

This skill runs **before** `generate-tests` in the automatic chain:

```
Code → [security-scan] → verify-logic → /generate-tests → /documentacion
```

If the scan fails with CRITICAL/HIGH, the chain stops until resolution.

## Rules

- ALWAYS check context before reporting (`.gitignore`, placeholders, environment)
- NEVER report `bypassSecurityTrust*` if it has an approved ADR and documented sanitization
- ALWAYS suggest the specific fix, not just the problem
- NEVER auto-correct CRITICAL/HIGH issues — escalate to user
- ALWAYS run `npm audit` if there were changes in `package.json`
- Reference: `.cloud/policies/security-policy.md` as source of truth
