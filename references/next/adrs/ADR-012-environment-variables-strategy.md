# ADR-012: Environment Variables Strategy

## Status

Accepted

## Date

2026-04-05

## Context

Next.js applications need to manage configuration that varies between environments (development, staging, production): API URLs, authentication keys, feature flags, external service configuration. Next.js has its own environment variable system with specific conventions for separating what is accessible from the server vs the client. A standardized, secure, and typed strategy is needed.

## Decision

Use the **native Next.js environment variable system** with the following rules:

### Environment files
- `.env.local` — Local secrets. **Git-ignored.** Each developer maintains their own.
- `.env.development` — Default values for development. Versioned in git.
- `.env.production` — Default values for production. Versioned in git (without secrets).
- `.env.example` — Template with all required variables (without actual values). Versioned.

### Prefix convention
- **No prefix:** Variable only accessible on the server (Route Handlers, Server Components, middleware). For secrets and internal configuration.
- **`NEXT_PUBLIC_`:** Variable accessible on both server and client. Only for non-sensitive values.

### Typed access
Create `libs/config/env.ts` with variable validation:
```typescript
export const env = {
  // Server-only
  DATABASE_URL: process.env.DATABASE_URL!,
  API_SECRET_KEY: process.env.API_SECRET_KEY!,
  // Public
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
} as const;
```

### Security rules
- **NEVER** put API keys, service tokens, or credentials with the `NEXT_PUBLIC_` prefix.
- **NEVER** commit `.env.local`.
- In production, variables are injected via CI/CD (GitHub Secrets) or Azure Key Vault.
- Validate at startup that all required variables are defined.

## Alternatives Considered

- **Manual dotenv:** Load variables with `dotenv.config()`. Unnecessary because Next.js has native support.
- **@t3-oss/env-nextjs:** Env var validation library with Zod. Excellent DX but adds an external dependency. Can be adopted as a future improvement.
- **Config in database or remote service:** Useful for dynamic feature flags but excessive for infrastructure configuration. Complementary, not a substitute.
- **Hardcoded variables per environment:** Config files per environment (config.dev.ts, config.prod.ts). Problematic because it exposes all values in the bundle.

## Consequences

### Positive

- Native Next.js system: zero dependencies, zero additional configuration.
- Clear server/client separation via the `NEXT_PUBLIC_` prefix.
- `.env.example` documents all required variables for quick onboarding.
- Typed access via `libs/config/env.ts` prevents typo errors in variable names.

### Negative

- Variables without `NEXT_PUBLIC_` are not available in Client Components. Can confuse novice developers.
- There is no runtime validation by default: if a variable is missing, the error occurs when it is used, not at startup.
- Variable names with long prefix (`NEXT_PUBLIC_`) are verbose.

### Neutral

- Next.js loads `.env` files in priority order: `.env.local` > `.env.development` > `.env`.
- Environment variables are resolved at build time for the client and at runtime for the server.
- Tests can set variables via `jest.setup.ts` or `.env.test` files.
