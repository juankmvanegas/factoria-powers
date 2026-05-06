# ADR-013: Error Handling Strategy

## Status
Accepted

## Context
We need consistent error handling across the entire application.

## Decision
3-level strategy:

### Level 1: HTTP Interceptor
```typescript
// GeneralHttpErrorInterceptor
- Intercepts ALL HTTP error responses
- 400/409 → dispatches GeneralServerErrorEvent
- 401 → dispatches UnauthorizedServerErrorEvent (trigger logout/redirect)
- 500 → dispatches GeneralServerErrorEvent
- 404 → graceful handling (no crash)
```

### Level 2: Global Error Handler
```typescript
// GeneralErrorHandler implements Angular ErrorHandler
- Captures unhandled runtime errors
- Structured logging with markers
- In production: send to logging service
- NEVER shows technical details to the user
```

### Level 3: Event-Driven Response
```typescript
// In presentation.container.ts
- Listens for GeneralServerErrorEvent → shows generic modal
- Listens for UnauthorizedServerErrorEvent → redirect to login
```

## Consequences
- Positive: Consistency, centralization, clean UX
- Negative: Specific errors require additional handling in services
