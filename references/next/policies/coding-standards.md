# Coding Standards Policy — Factoria Next.js 14

> This policy is mandatory for all code produced in Next.js 14 projects.
> Any violation must be corrected before merging to the main branch.

---

## 1. Architecture: Clean Architecture 3 Layers

The project follows Clean Architecture with 3 well-defined layers plus a shared utilities folder:

```
src/
  application/       → Pure business logic (Use Cases, abstractions, DTOs)
  infrastructure/    → Concrete implementations (HTTP adapters, storage, external APIs)
  presentation/      → UI (pages, layouts, components, hooks, stores, providers)
  libs/              → Cross-cutting utilities (config, helpers, shared types)
```

### 1.1 Dependency Rules

| Layer | Can depend on | CANNOT depend on |
|------|-------------------|----------------------|
| Application | Nothing concrete. Only defines abstractions (abstract classes, interfaces, DTOs) | Infrastructure, Presentation |
| Infrastructure | Application (implements its abstractions) | Presentation |
| Presentation | Application (consumes abstract Use Cases via DI) | Infrastructure directly |
| Libs | Nothing (cross-cutting, no business logic) | Application, Infrastructure, Presentation |

### 1.2 Golden Rule

**Application has ZERO concrete dependencies.** It does not import fetch, axios, localStorage, or any framework. It only defines contracts that Infrastructure implements and Presentation consumes.

---

## 2. Naming Conventions

### 2.1 Classes, Types, and Artifacts

| Artifact | Pattern | Example |
|-----------|--------|---------|
| Use Case (abstract) | `{Entity}UseCases` | `NotesUseCases` |
| Service (implements use case) | `{Entity}Service` | `NotesService` |
| Adapter (abstract) | `{Entity}Adapter` | `NotesAdapter` |
| Adapter HTTP (implements adapter) | `Api{Entity}Adapter` | `ApiNotesAdapter` |
| Adapter Storage (implements adapter) | `LocalStorage{Entity}Adapter` | `LocalStorageNotesAdapter` |
| Input DTO | `{Entity}Input` | `NoteInput` |
| Output DTO | `{Entity}Output` | `NoteOutput` |
| Page | `page.tsx` | `page.tsx` (Next.js convention) |
| Layout | `layout.tsx` | `layout.tsx` (Next.js convention) |
| Component | `{EntityAction}` (PascalCase) | `NotesTable`, `NoteCard` |
| Hook | `use{Entity}` (camelCase with use prefix) | `useNotes`, `useAuth` |
| Store (Zustand) | `use{Entity}Store` | `useNotesStore` |
| Route Handler | `route.ts` | `route.ts` (Next.js convention) |
| Provider | `{Entity}Provider` | `NotesProvider` |
| Enum | `{Entity}{Concept}Enum` | `NoteStatusEnum` |
| Context | `{Entity}Context` | `NotesContext` |
| Type/Interface | `{Entity}{Concept}` | `NoteFilters`, `NotePagination` |

### 2.2 File Naming (kebab-case)

| Artifact | File pattern | Example |
|-----------|-------------------|---------|
| Component | `{entity-name}.tsx` | `notes-table.tsx`, `note-card.tsx` |
| Concrete adapter | `api-{entity}.adapter.ts` | `api-notes.adapter.ts` |
| Abstract adapter | `{entity}.adapter.ts` | `notes.adapter.ts` |
| DTO | `{entity}.input.ts`, `{entity}.output.ts` | `note.input.ts`, `note.output.ts` |
| Use Case | `{entity}.use-cases.ts` | `notes.use-cases.ts` |
| Service | `{entity}.service.ts` | `notes.service.ts` |
| Hook | `use-{entity}.ts` | `use-notes.ts` |
| Store | `{entity}.store.ts` | `notes.store.ts` |
| Test | `{original-name}.test.ts` or `.test.tsx` | `notes.service.test.ts` |
| Provider | `{entity}.provider.tsx` | `notes.provider.tsx` |
| Enum | `{entity}-{concept}.enum.ts` | `note-status.enum.ts` |

---

## 3. Directory Structure per Layer

### 3.1 Application

```
src/application/
  {feature}/
    use-cases/
      {entity}.use-cases.ts          → Abstract class with use case methods
    adapters/
      {entity}.adapter.ts            → Abstract adapter class
    dtos/
      {entity}.input.ts              → Input DTO
      {entity}.output.ts             → Output DTO
    enums/
      {entity}-{concept}.enum.ts     → Domain enums
```

### 3.2 Infrastructure

```
src/infrastructure/
  {feature}/
    adapters/
      api-{entity}.adapter.ts        → HTTP implementation of the adapter
    mappers/
      {entity}.mapper.ts             → Transformation from API response → DTO
```

### 3.3 Presentation

```
src/presentation/
  {feature}/
    components/
      {component-name}.tsx           → UI components
    hooks/
      use-{entity}.ts                → Custom hooks
    stores/
      {entity}.store.ts              → Zustand stores
    providers/
      {entity}.provider.tsx          → React Context + Provider for DI
```

### 3.4 Libs

```
src/libs/
  config/
    env.ts                           → Type-safe access to environment variables
  helpers/
    {util-name}.ts                   → Pure utility functions
  types/
    {type-name}.ts                   → Shared types
```

---

## 4. Mandatory Patterns

### 4.1 TypeScript Strict Mode

The project MUST use TypeScript in strict mode. Minimum configuration in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 4.2 Server Components by Default

- Every component is a Server Component unless it needs interactivity.
- Use `'use client'` ONLY when the component requires: useState, useEffect, event handlers, browser APIs, third-party hooks that use state.
- NEVER put `'use client'` on a component that only renders data.

### 4.3 Async/Await

- All asynchronous operations MUST use async/await.
- NEVER use `.then()/.catch()` chains — always try/catch with await.
- Server Components can be async directly.

### 4.4 Dependency Injection via React Context

- Each feature exposes a Provider that injects the concrete Use Case implementation.
- Components consume the Use Case via the context hook.
- NEVER import concrete implementations (Services, Adapters) from Presentation.

```typescript
// Correct: consume abstraction via context
const { getNotes } = useNotesContext();

// INCORRECT: import direct implementation
import { NotesService } from '@infrastructure/notes/notes.service';
```

### 4.5 Shared State with Zustand

- Zustand for global client state (cache, UI state, filters).
- One store per feature.
- NEVER use Zustand for data that comes from the server — use Server Components or React Query.

### 4.6 Environment Variables

- Server variables: `process.env.VARIABLE_NAME` (without NEXT_PUBLIC_ prefix).
- Client variables: `process.env.NEXT_PUBLIC_VARIABLE_NAME`.
- NEVER expose secrets with the `NEXT_PUBLIC_` prefix.
- Type-safe access is mandatory via `src/libs/config/env.ts`.

### 4.7 Styling with Tailwind CSS

- Tailwind utility classes as the only styling strategy.
- DO NOT use CSS-in-JS (styled-components, emotion, etc.).
- DO NOT use inline styles (`style={{}}`).
- Complex components may extract classes to constants with `clsx` or `cn()`.

### 4.8 Mandatory Path Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@application/*": ["./src/application/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@presentation/*": ["./src/presentation/*"],
      "@libs/*": ["./src/libs/*"]
    }
  }
}
```

- ALWAYS use path aliases in imports.
- NEVER use relative paths that cross layers (`../../infrastructure/...`).

---

## 5. Error Handling

### 5.1 Error Boundaries per Route Segment

- Each route segment with significant logic MUST have its own `error.tsx`.
- The root `error.tsx` catches unhandled errors.
- NEVER let an unhandled error break the entire application.

### 5.2 Route Handlers

Route Handlers MUST return structured responses:

```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 });

// Controlled error
return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

// Unexpected error
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
```

### 5.3 Errors in Adapters

- Infrastructure adapters MUST catch network/API errors and throw typed domain errors.
- NEVER let a fetch error propagate without transformation.

### 5.4 Inter-Component Notification

- Use custom events or a notification store to communicate errors between components.
- NEVER expose technical system details to the user (stack traces, internal codes, table names).

---

## 6. Environment Configuration

### 6.1 Environment Files

| File | Purpose | In .gitignore |
|---------|-----------|---------------|
| `.env.local` | Developer's local variables | YES |
| `.env.development` | Default values for development | NO |
| `.env.production` | Default values for production | NO |
| `.env.test` | Values for test execution | NO |

### 6.2 Mandatory Type-Safe Access

All environment variables are accessed via `src/libs/config/env.ts`:

```typescript
// src/libs/config/env.ts
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',
  nextAuthUrl: process.env.NEXTAUTH_URL ?? '',
  // ...
} as const;
```

- NEVER access `process.env` directly outside of `env.ts`.
- Variables with the `NEXT_PUBLIC_` prefix are the ONLY ones accessible from the client.

---

## 7. Imports and Exports

### 7.1 Barrel Files

- Each feature folder MUST have an `index.ts` that re-exports its public artifacts.
- Imports between features MUST go through the barrel file.

### 7.2 Import Order

1. Node / Next.js modules (`next/...`, `react`)
2. External dependencies (`zustand`, `clsx`, etc.)
3. Path aliases by layer (`@application/...`, `@infrastructure/...`, `@presentation/...`, `@libs/...`)
4. Relative imports from the same module (`./...`)

---

## 8. Severity Table

| Severity | Violation Type | Required Action |
|-----------|-------------------|------------------|
| **CRITICAL** | Architecture violation (incorrect dependency between layers) | Merge blocked. Immediate correction mandatory. |
| **CRITICAL** | Secret exposure (API keys, passwords in code) | Merge blocked. Credential rotation required. |
| **CRITICAL** | Direct import of Infrastructure from Presentation | Merge blocked. Refactor to injection via Context. |
| **HIGH** | Code without unit tests (services, adapters, route handlers) | Merge blocked. Add tests before merge. |
| **HIGH** | Component with unnecessary `'use client'` | Correction required before merge. |
| **HIGH** | Incorrect layer usage (business logic in Presentation) | Correction required before merge. |
| **MEDIUM** | Naming convention violation | Correction required. May be approved with a correction plan. |
| **MEDIUM** | Missing types (use of `any`, `unknown` without justification) | Correction required. |
| **MEDIUM** | Relative import crossing layers instead of path alias | Correction required. |
| **LOW** | Inconsistent code formatting | Warning. Correction in next iteration. |
| **LOW** | Missing documentation on public functions | Warning. Correction in next iteration. |
| **LOW** | Incorrect import order | Warning. Apply autofix with ESLint. |
