# ADR-004: Module Federation for Micro-Frontends

## Status
Accepted

## Context
The company requires composition of independent frontend applications that can be deployed separately.

## Decision
Use `@angular-architects/module-federation` v15 with Webpack 5.

### Configuration
- Entry point: `main.ts` with `initFederation` that loads the manifest
- Manifest: `libs/config/microfrontends.json`
- Build: `ngx-build-plus` to extend webpack
- Remotes: Lazy loading via `loadRemoteModule` in routing

### Pattern
```typescript
// main.ts
initFederation('./libs/config/microfrontends.json')
  .then(_ => import('./bootstrap'))

// routing
loadRemoteModule({ type: 'manifest', remoteName: '...', exposedModule: './Module' })
```

## Consequences
- Positive: Independent deploy, scalability, autonomous teams
- Negative: Build complexity, shared libs versioning
