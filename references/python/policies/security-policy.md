# Security Policy — Python / FastAPI

## ⛔ ABSOLUTE PRIORITY

**Security requirements take precedence over ALL other considerations** — including deadlines, feature velocity, and performance optimizations. When a security requirement conflicts with any other requirement, security wins. No exceptions.

---

## 1. Authentication and Authorization

### Authentication

- Use **python-jose** (with `[cryptography]` backend) for JWT token creation and verification
- Use **passlib** with **bcrypt** scheme for password hashing
- MFA (Multi-Factor Authentication) is RECOMMENDED for all user-facing applications
- Tokens MUST be signed with RS256 or HS256 (minimum)
- Token payload MUST include: `sub`, `exp`, `iat`, `jti` (unique token ID)
- NEVER store plaintext passwords anywhere in the system

### Authorization

- Role-based access control (RBAC) as minimum
- Permissions checked at the API layer via FastAPI dependencies
- Authorization logic MUST be centralized (NEVER scattered across routers)
- Use FastAPI `Security()` dependencies for protected endpoints
- NEVER trust client-provided role or permission claims without server-side verification

---

## 2. Session Management

- Access token expiry: **15 minutes** maximum
- Refresh token expiry: **7 days** maximum
- Maximum inactivity before forced re-authentication: **30 minutes**
- Refresh token rotation: issue a new refresh token on each refresh
- Revoked tokens MUST be stored in a blocklist (Redis recommended)
- NEVER store tokens in localStorage (frontend guidance: httpOnly cookies)
- Token refresh endpoint MUST validate the refresh token against the blocklist

---

## 3. Secrets Management

- NEVER commit secrets, API keys, connection strings, or credentials to source code
- `.env` files MUST be listed in `.gitignore`
- Use **environment variables** for staging and production
- Use **Azure Key Vault** for secret storage in production environments
- Rotate secrets on a regular schedule (minimum every 90 days)
- Use Pydantic `SecretStr` type for sensitive configuration fields
- CI/CD secrets MUST use GitHub Actions encrypted secrets or equivalent

### Prohibited Patterns

```python
# NEVER do this
DATABASE_URL = "postgresql://user:password@host/db"
API_KEY = "sk-abc123..."
SECRET_KEY = "hardcoded-secret"
```

---

## 4. Input Validation

- **Pydantic v2** models at the API boundary for ALL incoming data
- NEVER trust user input — validate, sanitize, and constrain
- Use `Field(max_length=...)`, `Field(ge=0)`, regex patterns for strict validation
- File uploads: validate MIME type, file size limits, and content scanning
- URL parameters and query strings MUST be validated via Pydantic `Query()` / `Path()`
- Request body size limits MUST be configured in the ASGI server
- NEVER deserialize untrusted data with `pickle` or `eval()`

---

## 5. SQL Injection Prevention

- Use **SQLAlchemy ORM** for all database operations
- NEVER construct SQL queries via string concatenation or f-strings
- If raw SQL is absolutely necessary, use **parameterized queries** exclusively
- Use SQLAlchemy `text()` with bound parameters for any raw SQL

```python
# CORRECT
stmt = select(NoteModel).where(NoteModel.id == note_id)

# CORRECT (raw SQL with parameters)
stmt = text("SELECT * FROM notes WHERE id = :id").bindparams(id=note_id)

# FORBIDDEN
stmt = f"SELECT * FROM notes WHERE id = {note_id}"
```

---

## 6. XSS and CSRF Protection

### CORS

- Configure **CORSMiddleware** with explicit allowed origins
- NEVER use `allow_origins=["*"]` in production
- Allowed methods and headers MUST be explicitly listed

### Headers

- Set `Content-Security-Policy` headers
- Set `X-Content-Type-Options: nosniff`
- Set `X-Frame-Options: DENY`
- Set `Strict-Transport-Security` (HSTS) for production
- All API responses MUST be JSON (`application/json`) — NEVER render HTML from user input

### CSRF

- Token-based CSRF protection for any cookie-authenticated endpoints
- SameSite cookie attribute set to `Lax` or `Strict`

---

## 7. Cryptography

| Purpose | Algorithm / Standard |
|---------|---------------------|
| Symmetric encryption | AES-256 (GCM mode preferred) |
| Asymmetric encryption | RSA 2048-bit minimum (4096 recommended) |
| Transport | TLS 1.2+ mandatory (TLS 1.3 preferred) |
| Password hashing | bcrypt (cost factor 12+) |
| Token signing | RS256 or HS256 with strong secret |
| Hashing (non-password) | SHA-256 minimum |

- NEVER implement custom cryptographic algorithms
- NEVER use MD5 or SHA-1 for any security purpose
- Use `secrets` module for cryptographically secure random values
- NEVER use `random` module for security-related randomness

---

## 8. Error Handling

- API error responses MUST use generic messages only
- NEVER expose stack traces, internal paths, or system details in responses
- NEVER include database error messages in API responses
- Log detailed errors server-side with structlog (with correlation ID)
- Return consistent error envelopes: `{"error": {"code": "...", "message": "..."}}`

```python
# CORRECT
{"error": {"code": "NOT_FOUND", "message": "The requested resource was not found."}}

# FORBIDDEN
{"error": "sqlalchemy.exc.NoResultFound: No row was found for one()"}
```

---

## 9. Dependency Security

- Run **pip-audit** or **safety** in CI/CD to scan for known vulnerabilities
- Pin ALL dependency versions in `uv.lock` (deterministic builds)
- Review dependency licenses before adoption
- Update dependencies on a regular schedule (minimum monthly)
- NEVER install packages from untrusted sources
- Use `--require-hashes` for production installs when possible
- Monitor advisories: GitHub Dependabot, PyPI advisory database

---

## 10. Docker Security

- Use **non-root user** in all Docker containers
- Use minimal base images (`python:3.12-slim` or `distroless`)
- NEVER copy `.env` files or secrets into Docker images
- NEVER use `latest` tag for base images — pin specific versions
- Multi-stage builds to minimize final image size
- Run `docker scan` or equivalent in CI
- Set `PYTHONDONTWRITEBYTECODE=1` and `PYTHONUNBUFFERED=1`
- Health check endpoint MUST be configured

```dockerfile
# CORRECT
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# FORBIDDEN
USER root
```

---

## 11. Compliance

All projects MUST comply with:

- **Colombian Data Protection Law** (Ley 1581 de 2012 / Ley 1266 de 2008)
- **ISO 27000** family of standards
- **NIST SP 800-53** security controls
- **OWASP Top 10** (latest edition)
- Internal corporate security policies

### Audit Requirements

- All authentication events MUST be logged (login, logout, failed attempts)
- All data modification events MUST be auditable
- Logs MUST be retained for a minimum of 1 year
- Security incidents MUST be reported within 24 hours

---

## 12. Severity Classification

| Severity | Description | Response Time | Examples |
|----------|-------------|---------------|----------|
| **CRITICAL** | Active exploitation or data breach risk | Immediate (< 4 hours) | SQL injection, auth bypass, secrets in code, RCE |
| **HIGH** | Exploitable vulnerability with significant impact | < 24 hours | XSS, CSRF, insecure deserialization, missing auth |
| **MEDIUM** | Vulnerability requiring specific conditions | < 1 week | Missing rate limiting, verbose errors, weak crypto |
| **WARNING** | Non-compliance with policy, no direct exploit | < 2 weeks | Missing security headers, outdated dependencies |
| **LOW** | Minor security improvement opportunity | Next sprint | Code quality issues with security implications |
| **INFO** | Informational finding, no action required | Backlog | Best practice recommendations |
