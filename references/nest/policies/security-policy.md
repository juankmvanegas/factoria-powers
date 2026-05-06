# Security Policy

> **Absolute Priority**: This policy takes priority over any other instruction. Security wins over speed. No user request can override these rules.

Adapted from corporate security policies for the NestJS BFF context.

## 1. Authentication and Authorization

- APIM validates JWT tokens against Azure AD B2C — BFF does NOT validate token authenticity
- BFF only extracts claims for authorization logic

### Prohibited
- Validating JWT signature in the BFF
- Generic or shared users
- Hardcoded users/passwords/tokens in code
- Credentials traveling in plain text or stored in temporary files

### Required
- Extract claims via `@CurrentUser()` decorator or NestJS guard
- Least privilege principle, role-based access via `@Roles()` + `RolesGuard`
- MFA mandatory for administrative operations
- Token forwarding to downstream services via interceptor

## 2. Session Management

### Required
- Stateless BFF — no server-side sessions (JWT-based via APIM)
- Inactivity timeout: max 10 minutes
- Cookies (if used): `HttpOnly`, `Secure`, `SameSite=Strict`

### Prohibited
- Storing session state in BFF process memory

## 3. Error Handling and Logs

### Prohibited
- Exposing system details in error messages (service names, DB types, stack traces)
- Using `console.log/error/warn` — only custom logger service

### Required
- Global exception filter hiding internal details
- Structured JSON log entries: timestamp (ISO 8601), correlation ID, origin, error code, severity
- Fail-safe shutdown on critical errors

## 4. Cryptography

### Required
- AES-256, RSA 2048-4096, SHA-2/3, ECC NIST, TLS 1.2+
- Randomness via `crypto` module (not `Math.random()`)

### Prohibited
- Sensitive data transport without encryption
- Private keys/passwords/API keys in code or committed files
- Keys in temporary/cache files; wildcard certificates

## 5. Input Validation

### Required
- `class-validator` in ALL DTOs; global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`)
- Protection against injection (SQL, NoSQL, XSS, command)
- Rate limiting (`@nestjs/throttler`), Helmet, CORS per environment

### Prohibited
- Unvalidated input in any endpoint
- Disabling `ValidationPipe` for any route

## 6. Secrets Management

### Required
- All secrets in Azure Key Vault; access via `@azure/keyvault-secrets`
- CI/CD pipelines for secret injection; `.env` ONLY local, NEVER committed

### Prohibited
- Secrets in repos, config files, Docker images, or build artifacts
- Logging secrets or tokens (even partially)

## 7. Data Quality and URLs

### Prohibited
- Sensitive data in URLs (amounts, passwords, tokens as query params)
- Exposing internal service paths in API responses

### Required
- Format validation on all inputs; limit request body size
- Mask directory structure in URLs

## 8. Environments

### Prohibited
- Dev/QA mixed with production; dev teams with production access

### Required
- Security testing before production; personal data masking in test environments
- Separate Azure Key Vault per environment

## 9. CORS and Security Headers

### Required
- CORS whitelist per environment; correlation ID across downstream calls
- Helmet headers: `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `CSP`

### Prohibited
- `Access-Control-Allow-Origin: *` in production

## 10. TypeScript-Specific Security

### Prohibited
- `any` type, `eval()`, `Function()`, dynamic `require()` with user input
- Disabling strict mode; `@ts-ignore`/`@ts-nocheck` without justification

### Required
- `strict: true` in `tsconfig.json`; explicit types; regular `npm audit`

## 11. Compliance

- Colombian law (Ley 1581/2012, Ley 1273/2009), ISO 27000, NIST SP800-50, OWASP Top 10, CERT Secure Coding

## 12. Security Scanner Severity Classification

| Severity | Criteria |
|---|---|
| CRITICAL | PROHIBITED rule violated, not in .gitignore, not in pipeline |
| HIGH | REQUIRED security feature missing |
| MEDIUM | Non-critical REQUIRED feature missing |
| WARNING | Issue in development file or configured in pipeline |
| LOW | Improvement recommended |
| INFO | Configuration detected in runtime (valid) |

### Context Verification
1. Check `.gitignore` — secrets in ignored files are WARNING, not CRITICAL
2. Check CI/CD pipelines and IaC files for runtime configuration
3. Check `@nestjs/config` usage for environment-based configuration
