# ADR-002: Next.js 14 with App Router

## Status

Accepted

## Date

2026-04-05

## Context

Next.js offers two routing systems: Pages Router (legacy, based on `pages/`) and App Router (modern, based on `app/`). The team needs to define which one to use as the standard for all Next.js factory projects. Support for Server Components, streaming, nested layouts, and route groups is required.

## Decision

Use **Next.js 14 with App Router** as the only routing system. The use of Pages Router (`pages/` directory) is **prohibited**.

Justification:

- **Server Components by default:** Reduces JavaScript sent to the client.
- **Nested layouts:** Allow sharing UI between routes without re-rendering.
- **Streaming and Suspense:** Improve Time to First Byte with progressive rendering.
- **Route Groups:** Organize routes without affecting the URL (`(public)/`, `(protected)/`).
- **Parallel Routes and Intercepting Routes:** Enable advanced UI patterns (modals, dashboards).
- **Route Handlers:** Replace Pages Router API Routes with native Web API Request/Response support.

App Router is the official direction of Next.js and receives all performance and functionality improvements.

## Alternatives Considered

- **Pages Router:** More mature and documented, but considered legacy. Does not support native Server Components, nested layouts, or streaming. Vercel has confirmed that the development focus is on App Router.
- **Remix:** Alternative framework with good SSR support and loader/action pattern. Discarded due to lower enterprise adoption and smaller ecosystem.
- **Astro:** Excellent for static sites, but not suitable for applications with complex interactivity and authentication.

## Consequences

### Positive

- Access to all modern Next.js 14 features (Server Components, streaming, route groups).
- Better performance by default thanks to Server Components.
- Alignment with the official Vercel/Next.js roadmap.
- Nested layouts eliminate UI duplication between pages.

### Negative

- Some third-party packages are not yet 100% compatible with App Router.
- Community documentation (blogs, tutorials) still mixes Pages and App Router examples.
- New concepts like `loading.tsx`, `error.tsx`, and `template.tsx` require training.

### Neutral

- API Routes migrate to Route Handlers (`app/api/*/route.ts`) with different but equivalent syntax.
- The team must adopt App Router-specific file naming conventions (`page.tsx`, `layout.tsx`, `not-found.tsx`).
