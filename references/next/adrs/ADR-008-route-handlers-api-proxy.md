# ADR-008: Route Handlers as BFF/Proxy

## Status

Accepted

## Date

2026-04-05

## Context

Next.js applications consume external APIs (backend .NET services, REST services, third-party APIs) that require authentication with API keys, tokens, or credentials that must not be exposed to the user's browser. A pattern is needed that keeps secrets on the server and provides a unified interface for the frontend.

## Decision

Use **Next.js Route Handlers** (`app/api/`) as a BFF (Backend for Frontend) / proxy layer:

- **All calls to external APIs** go through Route Handlers. Frontend components NEVER call external APIs directly from the browser.
- **Secrets** (API keys, service tokens, internal backend URLs) are kept exclusively in server-side environment variables (without the `NEXT_PUBLIC_` prefix).
- **Components** (Server or Client) call local `/api/*` routes that the Route Handler resolves against the actual backend.
- **Server Components** can make direct fetch calls to external APIs because they run on the server. Even so, using Application services that abstract the fetch is recommended.

Route Handler structure:
```
app/api/
  notes/
    route.ts           → GET (list), POST (create)
    [id]/
      route.ts         → GET (detail), PUT (update), DELETE (delete)
  auth/
    [...nextauth]/
      route.ts         → NextAuth handlers
```

Each Route Handler:
1. Validates the request (body, params, headers).
2. Attaches server-side authentication headers (Authorization, X-API-Key).
3. Fetches the external backend.
4. Transforms the response if necessary.
5. Returns NextResponse with the appropriate status code.

## Alternatives Considered

- **Direct fetch from Client Components:** Exposes API keys and internal URLs to the browser. Critical security risk. Discarded.
- **Next.js Middleware as proxy:** Middleware does not support body parsing or complex transformation logic. Only suitable for redirection and headers. Discarded for this use case.
- **External API Gateway (Kong, AWS API Gateway):** Adds additional infrastructure. Valid in production but does not replace the need for a BFF for frontend-specific transformations.
- **tRPC:** Excellent end-to-end typing but introduces an additional framework and strong coupling between frontend and API. Discarded to maintain neutrality with existing .NET backends.

## Consequences

### Positive

- Secrets never reach the browser bundle.
- A single entry point for all API calls facilitates logging, caching, and error handling.
- Route Handlers can aggregate data from multiple backends in a single response (BFF aggregation).
- Internal backend URLs are resolved on the server, enabling service discovery.

### Negative

- Additional latency: the request passes through the Next.js server before reaching the actual backend.
- Higher load on the Next.js server when acting as a proxy.
- Partial endpoint duplication: the Route Handler mirrors the backend structure.

### Neutral

- Route Handlers support streaming with `ReadableStream` for large responses.
- Next.js caching (`revalidate`, `cache: 'force-cache'`) applies to both Server Components and Route Handlers.
- CORS is not needed for frontend calls to `/api/*` because they are on the same domain.
