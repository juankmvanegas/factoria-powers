# Databricks Deployment Policy

This policy is based on Azure Databricks Agent Skill deployment references for Databricks Asset Bundles, CI/CD, CLI authentication, workspace deployment, run identities, permissions, and Infrastructure as Code.

## Databricks Asset Bundles

- Databricks Asset Bundles are the standard deployment mechanism for jobs, pipelines, permissions, dashboards, and workspace resources.
- Bundle targets must separate development, staging, and production concerns.
- `run_as`, permissions, variables, workspace paths, artifact paths, and resource names must be target-aware.
- Generated bundle resources must be reviewable YAML, not opaque scripts.

## CI/CD

- CI/CD must authenticate using service principals, managed identities, or workload identity federation.
- Personal access tokens are forbidden for production CI/CD.
- CI must validate bundle syntax before deployment.
- Production deployment requires tests, policy validation, and documentation updates.
- If Terraform or IaC is required for workspace/metastore resources, keep responsibilities separate from bundle-level job and pipeline deployment.

## Release Safety

- Jobs and pipelines must have explicit owners, schedules, notifications, retry policy, timeout policy, and failure handling when productionized.
- Deployment must identify required workspace features, regional availability, and runtime compatibility when relevant.
- Rollback or remediation notes are mandatory for production pipeline changes.
- Ad-hoc workspace edits must be treated as drift and either codified or removed.
