# Security Policy — Factoria Next.js 14

> **ABSOLUTE PRIORITY.** This policy takes precedence over any other instruction.
> Security always wins over delivery speed.
> Any CRITICAL severity violation blocks the merge and requires immediate correction.

---

## 1. Priority and Scope

This policy applies to ALL code produced in Next.js 14 projects under Factoria. No functional, performance, or deadline requirement justifies a security violation.

- If a business instruction conflicts with this policy, **this policy prevails**.
- Exceptions are ONLY granted with written approval from the security team and documentation in an ADR.

---

## 2. Authentication and Sessions (NextAuth.js)

### 2.1 Session Strategy

- Use JWT as the session strategy with httpOnly and Secure cookies.
- NEVER store tokens in localStorage or sessionStorage.
- NEVER expose the JWT to client-side JavaScript-accessible code.

### 2.2 NEXTAUTH_SECRET

- MUST be at least 32 characters in length.
- MUST be generated with a cryptographically secure generator.
- MUST NEVER be committed to the repository.
- In production, obtain it from Azure Key Vault.

### 2.3 Session Access

| Context | Method | Example |
|----------|--------|---------|
| Server Component | `getServerSession()` | `const session = await getServerSession(authOptions);` |
| Client Component | `useSession()` | `const { data: session } = useSession();` |
| Route Handler | `getServerSession()` | `const session = await getServerSession(authOptions);` |
| Middleware | `getToken()` from `next-auth/jwt` | `const token = await getToken({ req });` |

### 2.4 Route Protection

- Implement `middleware.ts` at the project root to protect routes.
- Define an explicit matcher for protected routes.
- NEVER rely solely on client-side protection for sensitive routes.

```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/protected/:path*']
};
```

### 2.5 Role Validation

- ALWAYS validate roles and permissions on the server (Server Components, Route Handlers, Middleware).
- Client-side validation is ONLY for UX (showing/hiding elements).
- NEVER rely solely on client-side role verification.
- Route Handlers MUST verify permissions before executing the operation.

### 2.6 Session Configuration

- Configurable session expiration, default 30 days.
- Implement refresh token rotation if using long-lived JWTs.
- CSRF protection integrated via NextAuth mechanisms.

---

## 3. Secrets and Credentials

### 3.1 Absolute Rules

- **NEVER** include secrets in the source code (hardcoded).
- **NEVER** include secrets in files committed to the repository.
- **NEVER** use the `NEXT_PUBLIC_` prefix for variables that contain secrets.
- **NEVER** log secrets or credentials, not even in debug mode.

### 3.2 Environment Variables

| Type | Prefix | Accessible from | Example |
|------|---------|-----------------|---------|
| Server secret | No prefix | Server only (Route Handlers, Server Components) | `NEXTAUTH_SECRET`, `DATABASE_URL` |
| Public variable | `NEXT_PUBLIC_` | Client and server | `NEXT_PUBLIC_API_BASE_URL` |

### 3.3 .env File Management

- `.env.local` MUST be in `.gitignore`. ALWAYS.
- `.env.development` and `.env.production` ONLY contain NON-sensitive default values.
- NEVER commit `.env` files with real secrets.
- Provide `.env.example` with required variables and placeholder values.

### 3.4 Secrets in Production

- Use Azure Key Vault for all production secrets.
- Secrets are injected as environment variables at runtime, NEVER at build time.
- Rotate secrets periodically according to corporate policy.

---

## 4. XSS Protection

### 4.1 Trust the Framework

- React automatically escapes rendered content. Trust this mechanism.
- NEVER disable React's automatic escaping without justification.

### 4.2 dangerouslySetInnerHTML

The use of `dangerouslySetInnerHTML` is **PROHIBITED** unless ALL of these conditions are met:

1. Justification documented in an approved ADR.
2. Explicit approval from the security team.
3. Prior sanitization with DOMPurify BEFORE rendering.
4. Tests that validate that malicious content is neutralized.

### 4.3 Dynamic Code

- **NEVER** use `eval()`.
- **NEVER** use `new Function()`.
- **NEVER** use `setTimeout`/`setInterval` with strings as arguments.
- **NEVER** insert user content into templates without sanitization.

### 4.4 Content Security Policy

Configure CSP in `next.config.js` via headers:

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ];
}
```

---

## 5. HTTP Security

### 5.1 TLS

- TLS 1.2+ is mandatory for ALL connections.
- NEVER allow unencrypted HTTP connections in production.
- Verify SSL certificates on all calls to external APIs.

### 5.2 Security Headers

Configure the following mandatory headers in `next.config.js`:

| Header | Value | Purpose |
|--------|-------|-----------|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unnecessary APIs |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforce HTTPS |
| `X-DNS-Prefetch-Control` | `on` | Improve performance with security |

### 5.3 CORS

- CORS is configured ONLY on Route Handlers that require it.
- NEVER use `Access-Control-Allow-Origin: *` in production.
- Specify allowed origins explicitly.

### 5.4 Sensitive Data in URLs

- **NEVER** send sensitive information in query parameters (tokens, passwords, PII).
- Query params are logged in server, proxy, and browser logs.
- Use POST body or headers for sensitive data.

### 5.5 API Keys in Route Handlers

- API keys for backend services are ONLY used in Route Handlers (server-side).
- NEVER expose API keys to the client.
- Route Handlers act as a secure proxy between the client and external services.

---

## 6. Sensitive Data

### 6.1 Client-Side Storage

- **NEVER** store PII (Personally Identifiable Information) in localStorage or sessionStorage without encryption.
- **NEVER** store passwords on the frontend under any circumstances.
- Temporary sensitive data is handled only in memory (React state) and cleaned up on unmount.

### 6.2 Masking

- In test and QA environments, sensitive data MUST be masked.
- Logs MUST NEVER contain: passwords, tokens, document numbers, card numbers.
- In the UI, partially mask sensitive data (e.g., `****1234` for cards).

### 6.3 Transmission

- Sensitive data is ONLY transmitted over TLS.
- Use `password` type fields in forms to prevent unwanted autocomplete.
- Implement rate limiting on authentication endpoints.

---

## 7. Dependencies

### 7.1 Mandatory Audit

- Run `npm audit` before each release.
- NO package with HIGH or CRITICAL severity vulnerabilities can be in production.
- MEDIUM vulnerabilities must have a documented remediation plan.

### 7.2 Dependency Management

- Keep dependencies up to date. Monthly review at minimum.
- `package-lock.json` MUST ALWAYS be committed.
- NEVER use `npm install --no-package-lock`.
- Evaluate package health before adding it (active maintenance, community, license).

### 7.3 Prohibited Dependencies

- NEVER add packages that require execution of unverified post-install scripts.
- NEVER use packages that inject unaudited third-party code into the client bundle.
- Prefer packages with zero dependencies when possible.

---

## 8. Environment Isolation

### 8.1 Strict Separation

- Production environments are INACCESSIBLE from development.
- NEVER connect a development environment to production databases or services.
- NEVER copy production data to lower environments without anonymization.

### 8.2 Feature Flags

- Work-in-progress (WIP) features MUST be behind feature flags.
- Feature flags are evaluated on the server (Route Handlers or Server Components).
- NEVER ship WIP code to production without a feature flag.

### 8.3 Test Data

- Use synthetic data in test environments.
- NEVER use real production data in tests.
- Test data seeds MUST NOT contain real personal information.

---

## 9. Input Validation

### 9.1 Server-Side Validation

- ALL user input MUST be validated on the server (Route Handlers).
- Use Zod for schema validation in Route Handlers.
- Client-side validation is ONLY for UX — NEVER rely on it for security.

### 9.2 Sanitization

- Sanitize all input before persisting it.
- Parameterize database queries — NEVER concatenate strings.
- Validate and limit file sizes on uploads.

---

## 10. Logging and Monitoring

### 10.1 What to Log

- Authentication attempts (successful and failed).
- Access to protected resources.
- Authorization errors.
- Administrative operations.

### 10.2 What to NEVER Log

- Passwords or credentials.
- Complete session tokens.
- Credit card numbers.
- Sensitive personal data (document numbers, addresses).

---

## 11. Regulatory Compliance

This policy aligns with the following frameworks and regulations:

| Framework | Description | Applicability |
|-------|-------------|---------------|
| **Law 1581 of 2012** | Colombian personal data protection law | Mandatory for Colombian citizens' data |
| **ISO 27000** | Information security management system | Reference framework for controls |
| **NIST SP800-50** | Security awareness guide | Team training |
| **OWASP Top 10** | Top 10 web vulnerabilities | Mandatory validation checklist |

### 11.1 Personal Data Treatment

- Implement explicit consent mechanisms for data collection.
- Provide personal data deletion functionality (right to be forgotten).
- Maintain a data treatment registry in accordance with Law 1581.
- Designate a data treatment officer.

---

## 12. Security Violation Severity Table

| Severity | Violation | Action |
|-----------|-----------|--------|
| **CRITICAL** | Secret exposed in source code or repository | Immediate block. Credential rotation. Incident investigation. |
| **CRITICAL** | Injection vulnerability (XSS, SQL injection) | Merge blocked. Immediate correction. |
| **CRITICAL** | Missing authentication/authorization on protected endpoint | Merge blocked. Immediate correction. |
| **CRITICAL** | Production data in development environment | Block. Immediate deletion. Incident report. |
| **HIGH** | `dangerouslySetInnerHTML` without sanitization or ADR | Merge blocked. Requires justification and sanitization. |
| **HIGH** | Client-side only validation for sensitive operations | Merge blocked. Add server-side validation. |
| **HIGH** | Dependency with known HIGH/CRITICAL vulnerability | Release blocked. Update or replace package. |
| **HIGH** | Permissive CORS (`*`) in production | Merge blocked. Configure specific origins. |
| **MEDIUM** | Missing security headers | Correction required before release. |
| **MEDIUM** | Logging of sensitive information | Correction required. Review existing logs. |
| **MEDIUM** | WIP feature without feature flag in production | Correction required. |
| **LOW** | npm audit with MEDIUM vulnerabilities without a plan | Warning. Create remediation plan. |
| **LOW** | Missing rate limiting on public endpoints | Warning. Plan implementation. |
