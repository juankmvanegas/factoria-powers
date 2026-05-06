# ADR-005: NextAuth.js for Authentication

## Status

Accepted

## Date

2026-04-05

## Context

The organization's Next.js applications require secure authentication with support for multiple identity providers (credentials, OAuth, Azure AD). A solution is needed that integrates natively with App Router, supports Server Components, and allows route protection on both the server and middleware. The solution must be abstract at the Application layer to allow future substitution.

## Decision

Use **NextAuth.js 4.x** as the authentication solution with the following specifications:

- **Session strategy:** JWT (stateless). Database sessions are not used unless explicitly required.
- **Route Handler:** Configured at `app/api/auth/[...nextauth]/route.ts`.
- **Middleware:** `middleware.ts` at the project root for route protection via path matching.
- **Abstraction:** `AuthAdapter` interface defined in Application with methods `getSession()`, `signIn()`, `signOut()`, `getToken()`. Concrete implementation `NextAuthAdapter` in Infrastructure.
- **Supported providers:** CredentialsProvider, AzureADProvider, Google, GitHub. Configurable per environment.
- **Session access:**
  - Server Components and Route Handlers: `getServerSession(authOptions)`.
  - Client Components: `useSession()` via `<SessionProvider>`.
  - Middleware: `getToken({ req })` from `next-auth/jwt`.

## Alternatives Considered

- **Auth.js v5 (NextAuth v5 beta):** Future version with better App Router support. Discarded because it was in beta with an unstable API at the time of the decision.
- **Clerk:** Authentication SaaS with excellent DX. Discarded due to external service dependency and costs at scale.
- **Custom JWT implementation:** Full control but high development and maintenance effort. Security risks from custom implementation.
- **Azure AD MSAL directly:** Would couple authentication to a single provider. NextAuth abstracts the provider behind a unified interface.

## Consequences

### Positive

- Native integration with Next.js: Route Handlers, middleware, Server Components.
- Support for multiple providers without changing application logic.
- Stateless JWT reduces server load and simplifies horizontal scaling.
- The AuthAdapter abstraction allows migrating to Auth.js v5 or any other solution without affecting Application or Presentation.

### Negative

- NextAuth 4.x has some limitations with App Router that require documented workarounds.
- OAuth provider configuration requires prior registration on each identity platform.
- Refresh token handling in JWT requires custom implementation of the `jwt` callback.

### Neutral

- Callback routes (`/api/auth/callback/*`) are generated automatically by NextAuth.
- The middleware.ts must remain lightweight; it only checks token existence, does not validate roles.
- Roles and permissions are handled at the Application layer, not directly in NextAuth.
