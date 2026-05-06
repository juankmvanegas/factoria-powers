---
name: new-project
description: "Initialize Factoria-Ang in a project — from scratch or on an existing Angular project"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Prepare an Angular 16 project to work with Factoria-Ang. Supports two scenarios:

- **Scenario A**: Empty folder → complete Clean Architecture 3-layer scaffold
- **Scenario B**: Existing Angular project → analysis, validation, and onboarding

## Execution Flow

### Step 0: Automatic Detection

Scan the project directory:

1. Look for `angular.json`, `package.json`, `tsconfig.json`, `src/main.ts` files
2. If they **DO NOT exist** → **Scenario A** (from scratch)
3. If they **exist** → **Scenario B** (existing project)

Inform the user which scenario was detected before continuing.

---

## Scenario A: Project from Scratch

### Phase A1: Structured Interview

Ask the user the following questions, one at a time:

1. **Domain**: What is the business domain?
2. **Project name**: What is the project called?
3. **Main entities**: What are the core domain entities? (minimum 2-3)
4. **Application type**:
   - SPA (Single Page Application)
   - Micro-Frontend (Module Federation host)
   - Micro-Frontend (remote module)
5. **Authentication**: Does it need authentication? AAD, B2C, or both?
6. **APIs to consume**: What backend APIs will it consume? (BFF endpoints)
7. **Integrations**: Are there remote micro-frontends to integrate?
8. **Constraints**: Are there technical or business constraints?

### Phase A2: BUSINESS_LOGIC.md Generation

With the answers, generate `BUSINESS_LOGIC.md` at the project root:

- Domain summary
- Entities and their relationships
- Main views and their purposes
- Main user flows
- APIs to consume
- Identified constraints

### Phase A3: Solution Scaffold

Execute:
```bash
ng new {project-name} --style=scss --routing=true --skip-tests=false
```

Then restructure to Clean Architecture 3 layers:

```
{ProjectName}/
├── src/
│   ├── presentation/
│   │   ├── common/
│   │   │   ├── dynamic-components/
│   │   │   ├── static-components/
│   │   │   ├── pipes/
│   │   │   └── assets/
│   │   ├── core-modules/
│   │   │   ├── started-with-launcher/
│   │   │   └── started-with-routes/
│   │   ├── styles/
│   │   │   ├── _settings/
│   │   │   ├── _tools/
│   │   │   ├── _generic/
│   │   │   ├── _elements/
│   │   │   ├── _objects/
│   │   │   ├── _components/
│   │   │   └── _trumps/
│   │   ├── static-pages/
│   │   ├── views/
│   │   ├── presentation.bootstrap.ts
│   │   ├── presentation.container.ts
│   │   ├── presentation.module.ts
│   │   └── presentation.router.ts
│   ├── infrastructure/
│   │   ├── common/helpers/
│   │   ├── services/
│   │   │   ├── api-bff/
│   │   │   ├── msal/
│   │   │   ├── local-storage/
│   │   │   └── session-storage/
│   │   └── infraestructure.module.ts
│   ├── application/
│   │   ├── abstractions/
│   │   │   ├── use-cases/
│   │   │   └── infraestructure/
│   │   │       ├── bff/adapters/
│   │   │       ├── msal/adapters/
│   │   │       ├── local-storage/adapters/
│   │   │       └── session-storage/adapters/
│   │   ├── dtos/
│   │   ├── events/
│   │   ├── services/
│   │   ├── common/helpers/
│   │   └── application.module.ts
│   ├── libs/
│   │   └── config/
│   │       ├── app-settings.service.ts
│   │       ├── app-settings.service.dev.ts
│   │       ├── app-settings.service.non-dev.ts
│   │       ├── app-settings.module.ts
│   │       └── microfrontends.json
│   ├── main.ts
│   └── bootstrap.ts
├── angular.json
├── tsconfig.json
├── karma.conf.js
├── webpack.config.js
├── webpack.prod.config.js
├── package.json
├── BUSINESS_LOGIC.md
├── CHANGELOG.md
└── .cloud/
    └── architecture/
        └── decisions/
            └── ADR-001-clean-architecture.md
```

### Phase A3b: Configure Backend URL (if provided in the prompt)

If the Task prompt includes an existing backend's base URL:

1. Configure `AppSettingsService` with the provided URL:
   - `app-settings.service.dev.ts` → received URL (e.g., `https://localhost:5001/api`)
   - `app-settings.service.non-dev.ts` → same URL or production placeholder
2. Verify that HTTP adapters (`ApiBff*Service`) inject `AppSettingsService` and use `apiBaseUrl`

If NO URL was provided:
- Configure with placeholder: `https://localhost:5001/api // TODO: update with real URL`

### Phase A4: Configuration

- **tsconfig.json**: full strict mode + path aliases
- **angular.json**: file replacements, build configs, Module Federation
- **karma.conf.js**: ChromeHeadless, Jasmine, coverage reporters
- **webpack.config.js**: Module Federation if applicable
- **package.json**: all Golden Path dependencies

### Phase A5: Base Files

- Static pages: 404, server error, offline
- Error handler + HTTP interceptor
- MSAL service + guards (if auth enabled)
- AppSettings service (abstract + implementations)
- Logger helper

### Phase A6: CHANGELOG and Initial ADR

- `CHANGELOG.md` with initial entry
- `ADR-001-clean-architecture.md` documenting the decision

### Phase A7: Confirmation

Show summary of everything created and confirm the project is ready.

---

## Scenario B: Existing Angular Project

### Phase B1: Project Analysis

Scan and map:

1. **Structure**: `angular.json`, folders, modules
2. **Layers**: Does it have presentation, infrastructure, application?
3. **Conventions**: Does it follow Factoria naming?
4. **Dependencies**: package.json
5. **Components**: Look for views, pages, components
6. **Services**: Look for use cases, adapters, services
7. **Auth**: Does it have MSAL? Guards?
8. **Testing**: Does it have specs? Karma config?
9. **CSS**: ITCSS? Other?
10. **Routing**: Lazy loading? Module Federation?

### Phase B2: Validation Against Factoria Standards

Generate compatibility report verifying:
- [ ] Correct 3-layer architecture
- [ ] Inter-layer dependencies respected
- [ ] Application without concrete dependencies
- [ ] TypeScript strict mode
- [ ] Naming conventions followed
- [ ] Path aliases configured
- [ ] Inline templates
- [ ] ITCSS present
- [ ] Tests present
- [ ] MSAL configured (if applicable)

### Phase B3: BUSINESS_LOGIC.md Generation

Based on the analysis, generate `BUSINESS_LOGIC.md` with inferred domain.

### Phase B4: Factoria Onboarding

If they don't exist, create support files:
- `.cloud/architecture/current.md`
- `.cloud/architecture/decisions/`
- `CHANGELOG.md`
- `README.md` with: purpose, structure, how to run, main views

**DO NOT modify existing code** in this phase.

### Phase B5: Recommendations

If there are non-compliances, ask the user if they want corrections.

### Phase B6: Confirmation

```
FACTORIA-ANG READY
═══════════════════

Project: {name}
Domain: {domain}
Layers: {layers found}
Views: {N views}
Services: {N services}
Tests: {status}

The project is ready to receive instructions.
```

## Rules

- NEVER generate code without confirming with the user first
- ALWAYS use Angular 16 + TypeScript strict
- ALWAYS respect the 3-layer architecture
- In Scenario B, NEVER modify existing code without approval
- Namespaces/imports must follow path aliases
