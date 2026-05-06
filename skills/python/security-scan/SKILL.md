---
name: python-security-scan
description: "Use when code has been written or modified and security policy compliance needs to be verified"
---

---
name: security-scan
description: "Auto-skill for security scanning against corporate policies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan (Auto-Activated)

## Activation Trigger

This skill activates automatically as part of the automatic chain whenever code changes are made.

## Purpose

Scan all code changes for security vulnerabilities and enforce corporate security policies before code is committed.

## Scan Categories

### 1. Hardcoded Secrets

Scan for and REJECT:
- API keys (patterns: `api_key`, `apikey`, `api-key` followed by string literals)
- Passwords (patterns: `password`, `passwd`, `pwd` assigned to string literals)
- Tokens (patterns: `token`, `secret`, `bearer` followed by string literals)
- Connection strings (patterns: `://user:pass@`, database URLs with credentials)
- Private keys (patterns: `-----BEGIN.*PRIVATE KEY-----`)
- AWS credentials (patterns: `AKIA`, `aws_secret_access_key`)

**Remediation**: Use environment variables via Pydantic `BaseSettings`. NEVER hardcode credentials.

### 2. SQL Injection Vulnerabilities

Scan for and REJECT:
- Raw SQL with string formatting: `f"SELECT ... {variable}"`
- String concatenation in queries: `"SELECT " + column + " FROM ..."`
- `.format()` in SQL strings
- `%` operator in SQL strings
- `text()` without parameter binding

**Remediation**: Use SQLAlchemy ORM queries or `text()` with named parameters (`:param`).

### 3. Dangerous Function Usage

Scan for and REJECT:
- `eval()` — arbitrary code execution
- `exec()` — arbitrary code execution
- `pickle.loads()` / `pickle.load()` — deserialization attacks
- `yaml.load()` without `Loader=SafeLoader`
- `subprocess.call(shell=True)` — command injection
- `os.system()` — command injection
- `__import__()` — dynamic imports from untrusted input

**Remediation**: Use safe alternatives or validate/sanitize all inputs.

### 4. Missing Input Validation

Scan for and FLAG:
- FastAPI endpoints without Pydantic request models
- Path parameters without type constraints
- Query parameters without validation (min/max, regex patterns)
- File upload endpoints without size/type restrictions
- Missing `Body()`, `Query()`, `Path()` validators where needed

**Remediation**: Use Pydantic models for all request bodies. Use FastAPI parameter validators.

### 5. CORS Misconfiguration

Scan for and REJECT:
- `allow_origins=["*"]` in production configuration
- `allow_credentials=True` combined with wildcard origins
- Missing CORS configuration on public APIs
- Overly permissive `allow_methods` or `allow_headers`

**Remediation**: Whitelist specific origins. Use environment-based CORS configuration.

### 6. Missing Authentication

Scan for and FLAG:
- Public endpoints that should require authentication
- Missing `Depends(get_current_user)` on protected routes
- Endpoints that access user-specific data without identity verification
- Admin endpoints without role-based authorization

**Remediation**: Add authentication dependencies. Implement role-based access control.

### 7. Insecure Cryptographic Operations

Scan for and REJECT:
- MD5 or SHA1 for password hashing
- ECB mode for encryption
- Hardcoded initialization vectors (IV)
- Weak random number generation (`random` module for security purposes)
- Missing salt in password hashing

**Remediation**: Use `bcrypt` or `argon2` for passwords. Use `secrets` module for tokens. Use `cryptography` library for encryption.

## Severity Levels

| Severity | Action | Examples |
|----------|--------|----------|
| **CRITICAL** | Block immediately, require fix | Hardcoded secrets, SQL injection, eval/exec |
| **HIGH** | Block, require fix before commit | Missing auth, CORS wildcard, insecure crypto |
| **MEDIUM** | Warn, recommend fix | Missing input validation, broad permissions |
| **LOW** | Inform, suggest improvement | Missing rate limiting, verbose error messages |

## Source of Truth

`.cloud/policies/security-policy.md`

## Auto-Shielding

When a security violation is detected:
1. REJECT the violating code immediately
2. Explain the vulnerability and its risk
3. Provide the correct, secure implementation
4. NEVER allow the user to override CRITICAL or HIGH severity findings
5. Log all findings in the session audit trail
