# ADR-011: Lazy Loading per View

## Status
Accepted

## Context
We need to optimize bundle size and initial load time.

## Decision
Lazy loading of each view module through the Angular Router.

```typescript
// presentation.router.ts
const routes: Routes = [
  {
    path: 'notes',
    loadChildren: () => import('./views/notes-view/notes-view.module')
      .then(m => m.NotesViewModule)
  }
];
```

### Pattern per View
- Each view is an independent module
- It loads only when the user navigates to that route
- Module Federation extends this to remote applications

## Consequences
- Positive: Small initial bundle, on-demand loading
- Negative: Latency on first navigation to each view
