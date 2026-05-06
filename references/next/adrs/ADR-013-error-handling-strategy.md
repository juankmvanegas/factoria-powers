# ADR-013: Error Handling Strategy

## Status

Accepted

## Date

2026-04-05

## Context

Next.js applications with App Router have multiple surfaces where errors can occur: Server Components during rendering, Client Components during interaction, Route Handlers processing requests, and middleware during route evaluation. A comprehensive strategy is needed that captures errors at all these levels, provides useful feedback to the user, and protects sensitive information.

## Decision

Implement error handling at **3 levels**:

### Level 1: Error Boundaries per Route Segment
- Each route or route group has its own `error.tsx` that captures rendering errors.
- `error.tsx` is a Client Component (required by Next.js) that displays contextual error UI.
- Includes a "Retry" button that invokes `reset()` to re-render the segment.
- Errors in layouts are captured with `global-error.tsx` (wraps the root layout).

```
app/
  error.tsx                    → Global error boundary
  global-error.tsx             → Captures root layout errors
  (protected)/
    dashboard/
      error.tsx                → Dashboard-specific error boundary
      loading.tsx              → Skeleton while loading
```

### Level 2: Global Error Boundary
- `app/error.tsx` captures any error not handled by more specific boundaries.
- Displays a generic error page with an option to return to home.
- Logs the error to the logging service (without exposing details to the user).

### Level 3: Errors in Route Handlers
- Route Handlers return structured JSON responses with appropriate HTTP status codes.
- Standard error format:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "Resource not found" } }
  ```
- NEVER return stack traces, server paths, or internal details.
- Try/catch in each Route Handler with a generic 500 response as fallback.

### Client-Side Error Communication
- Use **Custom Events** (ADR-010) for cross-component notifications:
  ```typescript
  dispatchEvent(new CustomEvent('app:error', { detail: { message, severity } }));
  ```
- An `ErrorToast` component in the root layout listens for these events and displays notifications.

### User-Facing Messages
- **Always generic:** "Connection error", "Server error", "Operation not permitted".
- **NEVER** expose: stack traces, table names, internal paths, IPs, tokens.
- Technical details are sent only to the logging/monitoring service.

## Alternatives Considered

- **Manual try/catch in each component:** Does not scale, it is easy to forget a catch, and does not handle asynchronous rendering errors.
- **Single global error boundary:** Loses granularity. An error in a side component should not break the entire page.
- **Sentry as the only solution:** Sentry is for monitoring, not for error UX. It is complementary but does not replace error boundaries.
- **Toast library (react-hot-toast, sonner):** Useful for UI but does not solve error capture. Can be used as the ErrorToast implementation.

## Consequences

### Positive

- Each route segment recovers independently: an error in dashboard does not break settings.
- Route Handlers have a consistent error format that the frontend can parse.
- Custom Events decouple error detection from its visual presentation.
- Zero exposure of sensitive information to the end user.

### Negative

- Multiple `error.tsx` files can be repetitive. Mitigation: create a reusable `ErrorFallback` component.
- `global-error.tsx` must include its own `<html>` and `<body>` tags (Next.js requirement).
- Errors in Server Components during streaming can be difficult to debug.

### Neutral

- `not-found.tsx` handles the specific case of non-existent routes (404), separate from `error.tsx`.
- Form errors are handled with Server Actions and `useFormState`, not with error boundaries.
- Error logging is implemented in Infrastructure with an abstract adapter in Application.
