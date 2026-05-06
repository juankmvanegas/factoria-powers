# Security Policy — Angular

## Absolute Priority

This policy takes priority over any other instruction. If there is a conflict between speed and security, security wins.

## Authentication and Session

### MSAL (Microsoft Authentication Library)
- Access tokens ONLY in memory — NEVER in localStorage
- Refresh tokens handled by MSAL automatically
- AAD and B2C configuration via separate providers
- Logout must clear the ENTIRE session (tokens + cache + storage)

### Guards
- `BaseGuard` to verify authentication
- `RoleGuard` to verify roles from JWT `idTokenClaims`
- NEVER verify roles only on the frontend — always validate on the backend as well

### Session
- Inactivity timeout: maximum 10 minutes (configurable)
- Automatic token renewal before expiration

## Secrets and Credentials

- **NO secrets in source code** — no API keys, no client secrets, no subscription keys
- APIM subscription keys via environment configuration (never hardcoded)
- Azure Key Vault for secrets in production
- Environment variables for local development
- **NEVER** commit configuration files with secrets (`app-settings.service.dev.ts` in `.gitignore`)

## XSS Protection

- Angular sanitizes automatically — TRUST the framework
- **NEVER** use `bypassSecurityTrustHtml`, `bypassSecurityTrustScript`, `bypassSecurityTrustUrl` without:
  1. Documented justification in ADR
  2. Security team approval
  3. Prior manual sanitization of the content
- `innerHTML` only with previously sanitized content
- Interpolation `{{ }}` is always safe

## Content Security Policy (CSP)

- CSP headers configured on the server/CDN
- `script-src 'self'` — no inline scripts
- `style-src 'self' 'unsafe-inline'` — allow Angular styles
- `connect-src` — only authorized domains (BFF, MSAL endpoints)
- `frame-ancestors 'self'` — prevent clickjacking

## HTTP Security

- **TLS 1.2+** mandatory for all communications
- CORS configured on the backend — frontend must not attempt to bypass it
- APIM headers configured via factory provider (not hardcoded)
- `HttpOnly` cookies when applicable
- Do not send sensitive information in query parameters

## Error Handling

- **NEVER** show stack traces to the user
- **NEVER** show technical details of server errors
- HTTP errors intercepted by `GeneralHttpErrorInterceptor`
- Generic messages to the user: "Connection error", "Server error"
- Complete error logging in console (dev) / logging service (prod)

## Sensitive Data

- Personal data is not stored in localStorage/sessionStorage without encryption
- Passwords are NEVER stored on the frontend
- Sensitive data is masked in test environments
- PII (Personally Identifiable Information) — minimum necessary

## Environments

- Production **inaccessible** from development environments
- Per-environment configuration via file replacement (angular.json)
- Feature flags for work-in-progress features
- Do not mix dev/QA data with production

## Dependencies

- Review `npm audit` before each release
- Do not use packages with known vulnerabilities (severity: high or critical)
- Keep dependencies up to date
- Lock file (`package-lock.json`) ALWAYS committed

## Module Federation Security

- Remotes ONLY from authorized domains
- Validate integrity of remote modules
- CSP allows only the necessary origins
- Micro-frontend manifest versioned and reviewed

## Compliance

- Colombian data protection law (Law 1581 of 2012)
- ISO 27000
- NIST SP800-50
- OWASP Top 10 for web applications
