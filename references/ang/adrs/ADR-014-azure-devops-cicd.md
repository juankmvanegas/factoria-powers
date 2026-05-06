# ADR-014: Azure DevOps Pipelines for CI/CD

## Status
Accepted

## Context
The company uses Azure DevOps as a development platform and needs automated pipelines.

## Decision
Azure DevOps Pipelines with YAML for CI/CD of Angular applications.

### CI Pipeline

```yaml
stages:
  - stage: Validate
    jobs:
      - job: Lint
        steps:
          - script: npm ci
          - script: ng lint

      - job: Build
        steps:
          - script: npm ci
          - script: ng build --configuration production

      - job: Test
        steps:
          - script: npm ci
          - script: ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

### Execution Order
1. **Lint** — No warnings or errors
2. **Build** — Successful production compilation
3. **Test** — All tests pass

### Approval Gates
- PR requires at least 1 approval
- CI pipeline must pass before merge
- Deploy to production requires manual approval

## Consequences
- Positive: Full automation, quality gates, traceability
- Negative: Initial configuration, execution times
