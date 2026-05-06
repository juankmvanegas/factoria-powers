---
name: nest-new-project
description: "Use when initializing a brand-new project from scratch following the factory template"
---

---
name: new-project
description: "Create new NestJS BFF project from blueprint or from scratch"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Create a new NestJS BFF project following the `ing-nes-bff-clean` blueprint.

## Execution Flow

### Interview Phase

1. Ask: Service name (kebab-case, e.g., `ing-nes-bff-customers`)
2. Ask: Which backend microservices will this BFF connect to?
3. Ask: Existing template or from scratch?

### Scenario A: From Existing Template

1. Scan current directory for existing NestJS project files
2. Verify it follows the blueprint structure
3. Onboard: adapt to Factoria standards

### Scenario B: From Scratch

1. Generate complete project structure:
   ```
   src/api/ (api.module.ts, controllers/, common/helpers/)
   src/infrastructure/ (infrastructure.module.ts, services/, common/helpers/)
   src/application/ (application.module.ts, services/, abstractions/, dtos/, common/)
   src/libs/ (config/, tracer/, errors/)
   src/initialization.module.ts
   src/main.ts
   test/unit-testing/ (services/, common/)
   test/datasets/mocks/
   ```
2. Generate `package.json` with approved stack
3. Generate `tsconfig.json` with path aliases
4. Generate ESLint + Prettier config
5. Generate Jest config
6. Generate `.cloud/` directory structure
7. Generate initial Swagger spec

## Rules

- ALWAYS follow the `ing-nes-bff-clean` blueprint structure
- ALWAYS include all approved dependencies
- NEVER add unapproved packages
- Generate a working project that passes `npm run build`
