# ADR-009: Dependency Injection with React Context and Providers

## Status

Accepted

## Date

2026-04-05

## Context

In Angular and .NET, dependency injection (DI) is a native framework mechanism. In React/Next.js there is no native DI container. However, the 3-layer architecture (ADR-001) requires that Application defines abstractions and Infrastructure provides concrete implementations, enabling substitution for testing and decoupling. An idiomatic DI pattern for React is needed.

## Decision

Use **React Context + Provider pattern** as the dependency injection mechanism:

- **Contracts as abstract classes:** In Application, define abstract classes that act as DI tokens (equivalent to Angular's injection tokens).
  ```typescript
  // application/ports/notes-use-cases.ts
  export abstract class NotesUseCases {
    abstract getAll(): Promise<NoteDto[]>;
    abstract create(data: CreateNoteDto): Promise<NoteDto>;
  }
  ```

- **Implementations in Infrastructure:** Concrete classes that extend the abstractions.
  ```typescript
  // infrastructure/services/notes-use-cases.impl.ts
  export class NotesUseCasesImpl extends NotesUseCases { ... }
  ```

- **Providers in Infrastructure:** React Context providers that register the implementations.
  ```typescript
  // infrastructure/providers/notes-provider.tsx
  const NotesContext = createContext<NotesUseCases | null>(null);
  export function NotesProvider({ children }) { ... }
  ```

- **Custom hooks for consumption:** Each service has a hook that reads the Context.
  ```typescript
  // infrastructure/hooks/use-notes-use-cases.ts
  export function useNotesUseCases(): NotesUseCases { ... }
  ```

- **RootProvider:** A root provider in `app/layout.tsx` that composes all providers.

- **Server Components:** Do not use Context (not compatible). They instantiate services directly or receive data as props.

## Alternatives Considered

- **InversifyJS:** Full DI container for TypeScript. Discarded because it requires experimental decorators, metadata reflection, and does not integrate well with React's Server Components model.
- **tsyringe:** Similar to InversifyJS. Same issues with decorators and Server Components.
- **Props drilling:** Passing dependencies as props through the tree. Does not scale and generates excessive coupling between intermediate components.
- **Module-level singletons:** Instantiating services as singletons in modules. Simple but impossible to substitute in tests without jest.mock() in each test.

## Consequences

### Positive

- 100% idiomatic React pattern: Context and Providers are native mechanisms.
- Allows substituting implementations for testing without jest.mock(): just wrap in a Provider with a mock.
- Consistent with the DI principle of the .NET and Angular factories, adapted to React.
- Custom hooks encapsulate Context access and throw a descriptive error if the Provider is missing.

### Negative

- React Context re-renders all consumers when the value changes. Mitigation: services are stable (do not change between renders).
- It is not a real DI container: there is no automatic transitive dependency resolution.
- Server Components cannot use Context; they require direct service instantiation.

### Neutral

- The RootProvider can grow if there are many services. It can be split into sub-providers by domain.
- DI hooks (`useNotesUseCases()`) are the only way to access services in Client Components.
- For tests, a `TestProvider` is provided in `test-utils` that registers mocks for all services.
