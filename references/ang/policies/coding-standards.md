# Coding Standards — Angular

## Architecture

### 3-Layer Clean Architecture + Atomic Design

| Layer | Number | Depends on | Content |
|-------|--------|------------|---------|
| Application | 3 | NOTHING | Use Cases (abstract), Adapters (abstract), DTOs, Events, Services (impl), Helpers |
| Infrastructure | 2 | Only Application | HTTP adapters, MSAL, Storage, Guards, Interceptors, Error Handlers |
| Presentation | 1 | Only Application abstractions | Views, Pages, Atomic Design Components, Routing, Modules, Styles |
| Libs | - | NOTHING | Config, AppSettings, MF manifest |

### Dependency Rules

- Application has ZERO concrete dependencies
- Infrastructure ONLY implements Application abstractions
- Presentation ONLY consumes abstract Use Cases — NEVER concrete services or Infrastructure adapters
- Presentation reusable UI follows Atomic Design: atoms → molecules → organisms → templates/pages
- Atomic Design is a Presentation organization rule; it does not change or weaken Clean Architecture dependencies
- Libs is independent — configuration only

### Angular Version Strategy

- New Angular projects and intentional upgrades use the latest stable supported Angular version by default
- Existing Angular projects may remain on another supported major version when the constraint is documented in an ADR
- Unsupported/EOL Angular versions require an upgrade plan before adding new feature scope
- TypeScript, `@angular-eslint`, Angular CLI, Router, HttpClient, testing utilities, and build plugins must be aligned with the selected Angular major

### DI Registration

```typescript
// application.module.ts — Mapping abstractions to implementations
{ provide: EntityUseCases, useClass: EntityService }

// infraestructure.module.ts — Concrete providers
providers: [
  ...apiBffProviders,
  ...storageProviders,
  ...msalProviders,
  { provide: HTTP_INTERCEPTORS, useClass: GeneralHttpErrorInterceptor, multi: true },
  { provide: ErrorHandler, useClass: GeneralErrorHandler }
]

// presentation.module.ts — Imports layer modules
imports: [ApplicationModule, InfraestructureModule, RouterModule.forRoot(routes)]
```

## Naming Conventions

### TypeScript

| Type | Convention | Example |
|------|------------|---------|
| Use Case (abstract) | `[Entity]UseCases` | `NotesUseCases` |
| Service (impl) | `[Entity]Service` | `NotesService` |
| Adapter (abstract) | `[Entity]Adapter` | `NotesAdapter` |
| Adapter HTTP (impl) | `ApiBff[Entity]Service` | `ApiBffNotesService` |
| Adapter Storage (impl) | `LocalStorage[Entity]Service` | `LocalStorageNotesService` |
| DTO Input | `[Entity]Input` | `NoteInput` |
| DTO Output | `[Entity]Output` | `NoteOutput` |
| Event | `[Action][Entity]Event` | `RefreshNotesFromApiEvent` |
| Guard | `[Name]Guard` | `RoleGuard` |
| Interceptor | `[Name]Interceptor` | `GeneralHttpErrorInterceptor` |
| Pipe | `[Name]Pipe` | `AddDetailsInParenthesisPipe` |
| Enum | `[Entity]Enum` / `[Entity]Status` | `NoteStatusEnum` |

### Files

| Type | Pattern | Example |
|------|---------|---------|
| View container | `{entity}-view.container.ts` | `notes-view.container.ts` |
| View module | `{entity}-view.module.ts` | `notes-view.module.ts` |
| View router | `{entity}-view.router.ts` | `notes-view.router.ts` |
| Page | `{entity}.page.ts` | `notes.page.ts` |
| Component | `{descriptive-name}.ts` | `notes-table.ts` |
| Service (app) | `{entity}.ts` | `notes.ts` |
| Use case (abstract) | `{entity}.ts` | `notes.ts` (in abstractions/use-cases/) |
| Adapter (abstract) | `{entity}.ts` | `notes.ts` (in abstractions/infraestructure/) |
| Adapter impl | `api-bff-{entity}.service.ts` | `api-bff-notes.service.ts` |
| Providers | `{provider}.providers.ts` | `api-bff.providers.ts` |
| DTO | `{entity}.input.ts` / `{entity}.output.ts` | `note.input.ts` |
| Spec | `{entity}.spec.ts` | `notes.spec.ts` |
| Enum | `{entity}.enum.ts` | `note-status.enum.ts` |

### Folders

- Always kebab-case: `notes-view`, `api-bff`, `local-storage`
- Views by domain: `{entity}-view/`
- No `.component` suffix in component file names
- Reusable UI components follow Atomic Design folders under `presentation/common/static-components/`: `atoms/`, `molecules/`, `organisms/`, `templates/`

### Classes

| Type | Suffix | Example |
|------|--------|---------|
| Module | `Module` | `NotesViewModule` |
| Container | `Container` | `NotesViewContainer` |
| Page | `Page` | `NotesPage` |
| Component | `Component` | `NotesTableComponent` |

## Mandatory Patterns

### TypeScript

- `strict: true` mandatory
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- Angular strict: `strictInjectionParameters`, `strictTemplates`, `strictInputAccessModifiers`

### Components

- Inline templates (template literal) — NO `templateUrl`
- `providedIn: 'root'` for services and abstractions
- Observable-based for all async operations (RxJS)
- Lazy loading per view in routing

### Cross-Component Communication

- Custom DOM Events for communication between decoupled components
- `@Input()` / `@Output()` for parent-child communication
- Services for shared state within a view

### View Patterns

```
{entity}-view/
  ├── {entity}-view.container.ts     ← <router-outlet/>
  ├── {entity}-view.module.ts        ← declarations + imports
  ├── {entity}-view.router.ts        ← Routes
  ├── pages/
  │   ├── {entity}.page.ts           ← Main page
  │   └── {entity}-detail.page.ts    ← Detail page
  └── components/
      ├── {entity}-table.ts          ← Table component
      └── {entity}-form.ts           ← Form component
```

## Error Handling

### HTTP Interceptor

```typescript
// GeneralHttpErrorInterceptor
- Status 400/409 → GeneralServerErrorEvent (business error)
- Status 401 → UnauthorizedServerErrorEvent
- Status 500 → GeneralServerErrorEvent (server error)
- Status 404 → Handle gracefully
```

### Global Error Handler

```typescript
// GeneralErrorHandler implements ErrorHandler
- Log with markers: [ERROR: ...], [START_ERROR_DETAILS]...[END_ERROR_DETAILS]
- NEVER expose technical details to the user
```

## CSS: ITCSS

| Layer | Prefix | Example |
|-------|--------|---------|
| Objects | `.o-` | `.o-layout-form`, `.o-layout-page` |
| Components | `.c-` | `.c-ui-button`, `.c-header` |
| Trumps/Utilities | `.u-` | `.u-is-centered-text` |
| Modifiers | `--` (BEM) | `.c-button--primary` |

Partial files: `_` prefix (e.g., `_colors.scss`).

## Per-Environment Configuration

- `app-settings.service.ts` — Abstract contract
- `app-settings.service.dev.ts` — Dev implementation
- `app-settings.service.non-dev.ts` — Prod implementation
- File replacement in `angular.json` for automatic swap

## CHANGELOG

**Keep a Changelog** format:
```markdown
## [Unreleased]
### Added
### Changed
### Fixed
### Removed
```

## Sonar Standards

- Cyclomatic complexity must stay **below 10** per function or method
- Cognitive complexity must stay **below 15** per function or method
- Avoid nesting deeper than **3 levels**
- Do not leave dead code, unused members, duplicated branches, or unreachable paths
- Do not leave commented-out code
- Avoid source-code comments for routine logic; prefer extraction, naming, and composition

## Path Aliases

```json
{
  "@presentation/*": "src/presentation/*",
  "@infraestructure/*": "src/infrastructure/*",
  "@application/*": "src/application/*",
  "@libs/*": "src/libs/*"
}
```
