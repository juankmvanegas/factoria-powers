# ADR-012: File Replacement for Environments

## Status
Accepted

## Context
We need different configurations per environment without exposing secrets.

## Decision
Use the Angular CLI file replacements mechanism.

```json
// angular.json
"configurations": {
  "development": {
    "fileReplacements": [{
      "replace": "src/libs/config/app-settings.service.non-dev.ts",
      "with": "src/libs/config/app-settings.service.dev.ts"
    }]
  }
}
```

### Structure
- `app-settings.service.ts` — Abstract contract
- `app-settings.service.dev.ts` — Development configuration
- `app-settings.service.non-dev.ts` — Production configuration (default)

### Rule
- `app-settings.service.dev.ts` in `.gitignore` if it contains local secrets
- Production uses environment variables from the CI/CD pipeline

## Consequences
- Positive: Clean separation, no secrets in code
- Negative: Duplicate files per environment
