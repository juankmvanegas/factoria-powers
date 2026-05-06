---
name: dataeng-security-scan
description: "Automatic security scan against corporate policies (.NET)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan (.NET — Auto-Activated)

## Purpose

Automatically validate that code complies with security-policy.md and corporate policies (ISO 27000, NIST SP800-50, Colombian law). Activates without user intervention as part of the development flow.

## Activates automatically when

- `*.csproj` files are modified (dependency changes)
- `appsettings*.json` or configuration files are modified
- **Controllers**, **Services**, **Adapters** are created or modified
- DI files are modified (`*DependencyInjection.cs`, `ServicesConfiguration.cs`)
- **Connection strings**, **endpoints**, or **auth configuration** are created or modified
- `/add-feature`, `/migration-execute`, or `/sprint` is executed touching infrastructure code

## Does NOT activate when

- Changes only in Entities or Enumerations (pure Core)
- Changes only in DTOs without logic
- Changes only in tests
- Changes only in documentation

## Automatic Flow

```
Change detected (dependencies, config, controllers, services)
    ↓
1. Vulnerable dependency scan
    ↓
2. Secrets in code scan
    ↓
3. Insecure pattern scan
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
dotnet list package --vulnerable --include-transitive
```

**Evaluation:**
- **Critical/High** vulnerabilities → BLOCK — report package, CVE, and safe version
- **Medium/Low** vulnerabilities → WARN — suggest update

### 2. Secrets in Code

Search for prohibited patterns in versioned files (not in `.gitignore`):

```
Pattern                              Severity
─────────────────────────────────────────────
password\s*=\s*"[^"]+              CRITICAL
connectionstring.*"[^"]+"          CRITICAL
apikey\s*=\s*"[^"]+                CRITICAL
secret\s*=\s*"[^"]+               CRITICAL
-----BEGIN.*PRIVATE KEY-----       CRITICAL
Bearer\s+[A-Za-z0-9\-._~+/]+=*   HIGH
```

**Context before reporting** (per security-policy.md section 12):
1. Is the file in `.gitignore`? → WARNING, not CRITICAL
2. Is it configuration injected by CI/CD? → INFO, not CRITICAL
3. Is it a placeholder/template (`YOUR_`, `TODO:`, `{secret}`)? → Ignore

### 3. Insecure Code Patterns

| Pattern | Problem | Severity |
|---------|---------|----------|
| SQL string concatenation (`$"SELECT...{variable}"`) | SQL Injection | CRITICAL |
| `[AllowAnonymous]` without justification | Exposed endpoint | HIGH |
| `Console.WriteLine` in production | Info leak | MEDIUM |
| `catch (Exception) { }` (empty catch) | Silenced error | MEDIUM |
| Logger with sensitive data (password, token, secret) | Data leak in logs | HIGH |
| `HttpClient` without configured timeout | DoS vector | LOW |
| `cors.AllowAnyOrigin()` | Open CORS | HIGH |
| Missing `[Authorize]` on controller with sensitive data | Auth bypass | HIGH |
| `TrustServerCertificate=true` in connection string | TLS bypass | HIGH |

### 4. Security Architecture Validation

| Verification | Expected |
|-------------|----------|
| Secrets storage | Azure Key Vault referenced, not hardcoded |
| Error handling | `FilterExceptionAttribute` + `ExceptionMiddleware` present |
| Boundary validation | `FluentValidation` on all input DTOs |
| Auth configured | `[Authorize]` or policies on controllers |
| Logging | `IManageLogs`, never loggers with sensitive data |

## Report

### Output format

```
Security Scan — {Project}
═══════════════════════════

Dependencies:  ✅ No vulnerabilities / ⚠️ 2 medium / ❌ 1 critical
Secrets:       ✅ Clean / ❌ 3 findings
Code:          ✅ No insecure patterns / ⚠️ 2 warnings

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

- Remove `Console.WriteLine` → replace with `IManageLogs`
- Add timeout to `HttpClient` if missing
- Remove `TrustServerCertificate=true`

For CRITICAL and HIGH requiring architectural decisions → always escalate to user.

## Chain Integration

This skill runs **before** `generate-tests` in the automatic chain:

```
Code → [security-scan] → verify-logic → /generate-tests → /documentacion
```

If the scan fails with CRITICAL/HIGH, the chain stops until resolution.

## Rules

- ALWAYS check context before reporting (`.gitignore`, CI/CD, placeholders)
- NEVER report false positives from runtime-injected configuration
- ALWAYS suggest the specific fix, not just the problem
- NEVER auto-correct CRITICAL/HIGH issues — escalate to user
- ALWAYS run `dotnet list package --vulnerable` if there were `.csproj` changes
- Reference: `.cloud/policies/security-policy.md` as source of truth
