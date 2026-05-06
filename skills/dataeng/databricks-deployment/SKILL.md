---
name: dataeng-databricks-deployment
description: "Deploy Azure Databricks jobs, Lakeflow pipelines, permissions, and workspace resources using Databricks Asset Bundles, CI/CD, run identities, and target-aware configuration."
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Databricks Deployment

Use this skill when creating or modifying `databricks.yml`, bundle targets, resources, jobs, pipelines, permissions, run identities, workspace paths, CI/CD, or release documentation.

## Required Context

1. Read `databricks-deployment-policy`.
2. Read `security-policy`.
3. Inspect `databricks.yml` and `resources/`.
4. Identify target environments and deployment identity.

## Execution Rules

- Databricks Asset Bundles are the default deployment surface.
- Keep jobs, pipelines, permissions, variables, and target-specific values declarative.
- Never hardcode workspace URLs, IDs, catalog names, schema names, cluster IDs, warehouse IDs, secret values, or principal IDs in reusable code.
- Use `run_as` and permissions deliberately.
- CI/CD must use service principals, managed identities, or workload identity federation, not personal access tokens.
- Production jobs and pipelines require owners, schedules, notifications, retries, timeouts, and failure handling.

## Validation

- Validate bundle structure before final delivery when Databricks CLI is available.
- If CLI validation cannot run locally, document the exact validation that remains pending.
- Confirm tests, policy checks, data dictionary updates, lineage notes, and runbooks are included for production changes.
