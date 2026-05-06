# ADR-010: Zustand and Custom Events for State

## Status

Accepted

## Date

2026-04-05

## Context

Next.js applications with App Router have two execution contexts: server and client. Server Components handle data directly via fetch without needing client state. However, Client Components may need to share state among themselves (filters, UI state, preferences). Additionally, a cross-component communication mechanism is required for global events such as error notifications or authentication changes.

## Decision

Adopt **Zustand 4.x** for shared client state and **Custom Events** for cross-component communication:

### Zustand (shared state)
- Use **only** for state that must be shared across multiple Client Components.
- One store per functional domain: `useFiltersStore`, `useUIStore`, `usePreferencesStore`.
- Stores are simple and flat: they contain no business logic, only data and setters.
- **Prohibited** to use Zustand for server state (data coming from the backend). Server state is handled with Server Components + fetch or React Query if client-side caching is needed.

### Custom Events (global communication)
- Use `dispatchEvent(new CustomEvent('app:error', { detail }))` to emit global events.
- Use `addEventListener('app:error', handler)` to listen for events.
- Use cases: error notifications, session changes, toast messages, data refresh.
- Listeners are registered in high-level components (layouts) and cleaned up in useEffect cleanup.

### Prohibitions
- **No Redux:** Excessive boilerplate for the level of frontend state complexity.
- **No MobX:** Observable-based reactive model that conflicts with the React model.
- **No Jotai/Recoil:** Atomic but add complexity without clear benefit over Zustand.
- **No React Query/SWR for global state:** These are for server state/caching, not UI state.

## Alternatives Considered

- **Redux Toolkit:** Industry standard but excessive for Next.js applications where server state is handled with Server Components. Too much boilerplate.
- **React Context for global state:** Re-renders all consumers on every state change. Zustand is more efficient with selectors.
- **Custom Event Bus (EventEmitter class):** More structured but unnecessary. DOM's CustomEvent is standard and works without dependencies.
- **Signals (Preact, SolidJS):** Not native to React. Signal packages for React are experimental.

## Consequences

### Positive

- Zustand is minimalist (< 1KB), no boilerplate, with selectors for granular re-renders.
- Custom Events are a browser standard: zero dependencies, zero configuration.
- The separation of server state (Server Components) vs client state (Zustand) is clear and efficient.
- Zustand stores are easily testable: they are pure functions.

### Negative

- Custom Events do not have strong typing by default. A typed wrapper is required.
- Zustand does not have DevTools as complete as Redux DevTools (a middleware exists but is limited).
- The team must be disciplined not to put server state in Zustand.

### Neutral

- Zustand supports middleware (persist for localStorage, devtools, immer for immutable updates).
- Stores are defined outside components and imported as hooks.
- Custom Events only work in Client Components (Server Components do not have access to the DOM).
