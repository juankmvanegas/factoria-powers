# ADR-009: Abstract Classes for DI

## Status
Accepted

## Context
Angular does not support interfaces as DI tokens (interfaces disappear at runtime). We need a mechanism for dependency inversion.

## Decision
Use abstract classes as dependency injection tokens.

```typescript
// Abstract (Application layer)
@Injectable({ providedIn: 'root' })
export abstract class NotesUseCases {
  abstract getAllNotes(): Observable<NoteOutput[]>;
}

// Implementation (Application layer)
@Injectable({ providedIn: 'root' })
export class NotesService implements NotesUseCases {
  getAllNotes(): Observable<NoteOutput[]> { ... }
}

// DI Registration
{ provide: NotesUseCases, useClass: NotesService }
```

### Advantages over interfaces
- Exist at runtime (can be DI tokens)
- `providedIn: 'root'` for tree-shaking
- Strong typing same as interfaces

## Consequences
- Positive: Clean DI, testability, replaceability
- Negative: Slightly more code than interfaces
