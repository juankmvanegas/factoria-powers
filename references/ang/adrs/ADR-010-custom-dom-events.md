# ADR-010: Custom DOM Events for Communication

## Status
Accepted

## Context
We need communication between decoupled components that do not have a parent-child relationship.

## Decision
Use Custom DOM Events for cross-component communication.

```typescript
// Define event (Application layer)
export class RefreshNotesFromApiEvent extends Event {
  constructor() { super('RefreshNotesFromApiEvent'); }
}

// Dispatch
document.dispatchEvent(new RefreshNotesFromApiEvent());

// Listen
document.addEventListener('RefreshNotesFromApiEvent', () => { ... });
```

### When to use
- Communication between components without a direct relationship
- Global events (login, logout, errors)
- Data refresh from external events

### When NOT to use
- Parent-child communication → `@Input()` / `@Output()`
- Shared state in the same view → Service with Subject

## Consequences
- Positive: Total decoupling, no extra dependencies
- Negative: Less typed than Subject, harder debugging
