# ADR-011: Route Groups for Route Organization

## Status

Accepted

## Date

2026-04-05

## Context

Next.js applications with App Router need to organize routes with different authentication requirements, layouts, and middleware. Some pages are public (landing, login), others require authentication (dashboard, profile), and authentication pages have their own flow (login, register, forgot-password). A structure is needed that allows applying layouts and route protection in a segmented way without affecting public URLs.

## Decision

Use **Next.js Route Groups** to organize routes by access level:

```
app/
  (public)/                    → Pages without authentication
    page.tsx                   → Landing page (/)
    about/page.tsx             → About (/about)
    layout.tsx                 → Public layout (simple navbar, footer)
  (auth)/                      → Authentication flows
    login/page.tsx             → Login (/login)
    register/page.tsx          → Register (/register)
    forgot-password/page.tsx   → Forgot password (/forgot-password)
    layout.tsx                 → Auth layout (centered, no navbar)
  (protected)/                 → Pages requiring an active session
    dashboard/page.tsx         → Dashboard (/dashboard)
    profile/page.tsx           → Profile (/profile)
    settings/page.tsx          → Settings (/settings)
    layout.tsx                 → Protected layout (sidebar, topbar, avatar)
  layout.tsx                   → Root layout (html, body, providers)
  error.tsx                    → Global error boundary
  not-found.tsx                → 404 page
```

Rules:

- **Parentheses do NOT affect the URL:** `(protected)/dashboard` is accessed as `/dashboard`.
- **Each group has its own layout:** Different headers, sidebars, and footers depending on the context.
- **middleware.ts** applies protection based on path matchers:
  - Routes under `(protected)/` require a valid JWT token.
  - Routes under `(auth)/` redirect to dashboard if a session already exists.
  - Routes under `(public)/` are always accessible.
- **New routes** must be created within the corresponding group according to their access level.

## Alternatives Considered

- **Without route groups (flat structure):** All pages at the same level. Forces authentication verification on each individual page. Does not allow differentiated layouts by zone.
- **Protection HOC (withAuth):** Higher-order component that wraps each protected page. Works but is repetitive and does not leverage App Router's layout capabilities.
- **Single middleware without groups:** A single middleware that lists all protected routes. Works but does not visually organize the structure and complicates layout maintenance.
- **Prefixed routes (/admin/*, /app/*):** Affects the public URL. Less clean for the end user.

## Consequences

### Positive

- Clear visual and logical separation between application zones.
- Each group has its own layout without code duplication.
- Middleware can protect all `(protected)/` routes with a single matcher.
- New developers immediately understand which area of the app they are modifying.
- Public URLs remain clean without unnecessary prefixes.

### Negative

- If a file is moved between groups, the layout changes automatically (can be surprising).
- Route groups cannot be created inside other route groups (Next.js limitation).
- The `middleware.ts` file must be kept in sync with the group structure.

### Neutral

- Route groups are an organizational convention; the compiler treats them as normal directories.
- More groups can be added in the future (e.g., `(admin)/` for back-office).
- Each group can have its own `loading.tsx` and `error.tsx` pages for differentiated UX.
