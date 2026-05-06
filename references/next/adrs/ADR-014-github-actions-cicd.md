# ADR-014: GitHub Actions as CI/CD

## Status

Accepted

## Date

2026-04-05

## Context

The organization's Next.js projects need a continuous integration and deployment pipeline that runs automatic validations on every push and pull request. The pipeline must cover linting, build, unit tests, and E2E tests. The organization uses GitHub as its primary repository and Azure as its hosting platform, with Azure DevOps as an alternative for pipelines.

## Decision

Adopt **GitHub Actions** as the primary CI/CD platform (Azure DevOps as an alternative when the project requires it).

### Pipeline Stages

1. **Lint** — `next lint` with configured ESLint rules. Fails the pipeline if there are errors (warnings allowed with a limit).
2. **Type Check** — `npx tsc --noEmit` to verify types without emitting files.
3. **Build** — `next build` to compile the application. Verifies there are no compilation errors.
4. **Test** — `npm test -- --watchAll=false --ci --coverage` with Jest. Minimum coverage configurable.
5. **E2E** — `npx playwright test` run only in CI (not in pre-commit). Requires `npx playwright install --with-deps`.

### Triggers

- **Push to main/develop:** Runs the full pipeline (lint + type check + build + test + E2E).
- **Pull Request:** Runs the full pipeline. Blocks merge on failure.
- **Release tags (v*.*.*):** Full pipeline + deploy to staging/production.

### Branch Protection

- PR requires a minimum of **1 reviewer approval**.
- PR requires **CI pass** (all stages green).
- Deploy to production requires **manual approval** via GitHub Environments.
- Direct push to `main` is not allowed.

### Secrets and Configuration

- Environment variables injected via **GitHub Secrets** or **Azure Key Vault**.
- `.env.production` files do not contain real secrets.
- CI secrets (AZURE_CREDENTIALS, API_KEYS) are configured in Settings > Secrets.

### Workflow Structure

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint:      # next lint
  typecheck: # tsc --noEmit
  build:     # next build
  test:      # jest --ci
  e2e:       # playwright (CI only)
    needs: [build]
```

## Alternatives Considered

- **Azure DevOps Pipelines exclusively:** Better integration with Azure but worse experience for developers already using GitHub. Maintained as an alternative, not as default.
- **Vercel integrated CI/CD:** Automatic for deployment but does not cover linting, testing, or custom validations. Complementary but not sufficient.
- **Jenkins:** Self-hosted, flexible but high infrastructure maintenance cost. Discarded for frontend projects.
- **CircleCI / Travis CI:** Valid alternatives but GitHub Actions has better native integration with GitHub (PR checks, environments, secrets).

## Consequences

### Positive

- Native integration with GitHub: status checks on PRs, deployment environments, secrets management.
- Free runners for public repositories; minutes included in organization plans.
- GitHub Actions Marketplace with thousands of reusable actions (setup-node, cache, playwright).
- Stage separation allows quickly identifying which step failed.
- Branch protection ensures no code reaches main without passing validations.

### Negative

- GitHub Actions runners have monthly minute limits on paid plans.
- Playwright E2E in CI is slow (2-5 additional minutes) and consumes more runner minutes.
- Debugging failed pipelines requires reviewing logs in the GitHub web interface.

### Neutral

- Workflows are defined in YAML (`.github/workflows/`), versioned alongside the code.
- Caching of `node_modules` and `.next/cache` can be used to speed up builds.
- GitHub Environments (staging, production) allow differentiated approval rules.
- Migration to Azure DevOps is possible by translating the GitHub Actions YAML to Azure Pipelines.
