# ADR-004: Server Components by Default

## Status

Accepted

## Date

2026-04-05

## Context

Next.js 14 with App Router introduces React Server Components (RSC), where components are rendered on the server by default. Only components that need browser interactivity must be marked as Client Components with the `'use client'` directive. A clear policy is needed on when to use each type to maximize performance without sacrificing functionality.

## Decision

**All components are Server Components by default.** The `'use client'` directive is only added when the component needs at least one of the following capabilities:

1. **useState or useReducer** — Local component state.
2. **useEffect or useLayoutEffect** — Browser side effects.
3. **Event handlers** — onClick, onChange, onSubmit, etc.
4. **Browser APIs** — window, document, localStorage, navigator.
5. **Custom hooks that use client hooks** — useSession(), useRouter() (client-side).
6. **Third-party libraries that require client** — components that use Context internally.

**Critical rule:** Add `'use client'` at the lowest possible component in the tree. If a page.tsx only has one interactive button, extract that button into a Client Component and keep page.tsx as a Server Component.

Recommended pattern:
```
app/dashboard/page.tsx          → Server Component (data fetching)
  └─ components/DashboardStats  → Server Component (render only)
  └─ components/FilterBar       → Client Component ('use client', has useState)
```

## Alternatives Considered

- **All Client Components (`'use client'` in root layout):** Simple but nullifies all RSC advantages. Equivalent to a traditional SPA. Discarded.
- **Server Components only for pages, Client Components for everything else:** Loses the granularity that RSC offers. Pure presentation components do not need JavaScript on the client.
- **Islands Architecture (Astro-style):** Next.js does not implement this pattern natively. Server Components achieve a similar result with better integration.

## Consequences

### Positive

- Significantly smaller JavaScript bundles: only Client Components are sent to the browser.
- Better performance: Server Components access data directly without fetch waterfalls.
- Improved SEO: server-rendered content is immediately available to crawlers.
- Server Components can use `await fetch()` directly without useEffect or manual loading state.

### Negative

- Functions cannot be passed as props from Server to Client Components (they are not serializable).
- The mental model of "where does my code execute" requires constant attention.
- Confusing errors when importing a client hook in a Server Component without `'use client'`.

### Neutral

- Server Components can import Client Components, but not the other way around (except via children pattern).
- Third-party libraries must declare `'use client'` at their entry point if they require browser APIs.
- `async/await` in components is exclusive to Server Components; Client Components use useEffect or Suspense.
