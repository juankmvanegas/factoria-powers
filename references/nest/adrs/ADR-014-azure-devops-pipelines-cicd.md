# ADR-014: Azure DevOps Pipelines for CI/CD

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF requires an automated CI/CD pipeline that ensures code quality, enforces architecture rules, runs tests, and deploys to Azure environments. The organization uses Azure DevOps as the standard platform. The pipeline must be adapted for the Node.js/NestJS stack while maintaining consistency with .NET pipeline conventions.

## Decision
Use Azure DevOps Pipelines with a multi-stage YAML pipeline:

- **Stages**: Lint → Architecture Test → Unit Test → SonarCloud → Build Docker → Deploy.
- **Triggers**: `main`, `develop`, `release/*`. Feature branches run Validate and QualityGate only.
- **Runtime**: Node.js 20.x on `ubuntu-latest` with npm cache.
- **Quality gates**: ESLint (zero errors/warnings), dependency-cruiser (zero violations), Jest (90% coverage), SonarCloud (no new bugs/vulnerabilities, coverage >= 90%).
- **Docker**: multi-stage Dockerfile (`node:20-alpine`). Images tagged with Build ID and `latest`.
- **Branch strategy**: `develop` → Dev (auto), `release/*` → Staging (manual approval), `main` → Production (manual approval).

Rules:
- ALL stages must pass before deployment. No manual deployments.
- SonarCloud quality gate failure blocks PR merge.
- Production deployments require manual approval.

## Consequences
- Automated pipeline ensures only validated code reaches production
- Quality gates (lint + architecture + tests + SonarCloud) catch problems early
- Multi-stage Dockerfile produces small, secure images
- Consistency with .NET pipeline facilitates cross-team operations
- Full pipeline may take 5-10 minutes, slowing PR feedback
- SonarCloud requires organizational license/configuration
