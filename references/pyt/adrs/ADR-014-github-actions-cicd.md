# ADR-014: GitHub Actions for CI/CD

## Status
Accepted

## Date
2025-06-01

## Context
Continuous integration and continuous deployment are essential for maintaining code quality and enabling frequent, reliable releases. We need a CI/CD platform that integrates with our GitHub-hosted repositories, supports our full test and quality pipeline, and provides the flexibility to build and deploy Docker images to our cloud infrastructure.

## Decision
We adopt **GitHub Actions** as the CI/CD platform for all Factoria-Pyt projects.

### Pipeline Stages (Strict Order)

```yaml
jobs:
  quality:
    steps:
      # 1. Lint (Ruff)
      - name: Lint
        run: uv run ruff check app/ tests/

      # 2. Type Check (mypy)
      - name: Type Check
        run: uv run mypy app/ --strict

      # 3. Architecture Tests (import-linter)
      - name: Architecture Tests
        run: uv run lint-imports

      # 4. Unit Tests
      - name: Unit Tests
        run: uv run pytest tests/unit/ --cov=app --cov-report=xml

      # 5. Integration Tests
      - name: Integration Tests
        run: uv run pytest tests/integration/ -v

  build:
    needs: quality
    steps:
      # 6. Build Docker Image
      - name: Build Docker Image
        run: docker build -t $IMAGE_NAME:$TAG .

  deploy:
    needs: build
    steps:
      # 7. Deploy (environment-specific)
      - name: Deploy to Environment
        run: ...
```

### Key Design Decisions

- **Fail fast**: If any step fails, subsequent steps are skipped
- **Lint before tests**: Catch formatting and style issues before running expensive test suites
- **Architecture tests before unit tests**: Structural violations are cheapest to detect
- **Separate jobs for quality, build, and deploy**: Clear separation of concerns
- **`uv` for all Python commands**: Consistent with ADR-003
- **Matrix strategy** for testing against multiple Python versions (3.12, 3.13) when applicable
- **Caching**: `uv` cache and Docker layer caching for faster pipelines
- **Branch protection**: `main` requires passing CI and at least one approval
- **Environment secrets**: Managed via GitHub Actions encrypted secrets

### Required GitHub Actions

- `actions/checkout@v4`
- `actions/setup-python@v5`
- `astral-sh/setup-uv@v4`
- `docker/build-push-action@v6`
- Custom actions for deployment to Azure (AKS, App Service, or Container Apps)

## Consequences
### Positive
- Native GitHub integration — no external CI/CD platform needed
- Pipeline-as-code in `.github/workflows/` — versioned with the repository
- Strict stage ordering ensures quality gates are enforced
- Caching significantly reduces pipeline execution time
- Matrix testing catches compatibility issues early

### Negative
- GitHub Actions minutes are metered (cost considerations for large teams)
- Complex workflows can become hard to maintain (mitigated by reusable workflows)
- Self-hosted runners needed for private network access during deployment

### Neutral
- GitHub Actions is the standard CI/CD tool for GitHub-hosted repositories
- The pipeline structure mirrors the .NET and Angular factory pipelines
- Deployment strategy (blue-green, canary) is configured per environment
