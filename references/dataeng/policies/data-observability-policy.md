# Data Observability Policy

This policy is based on Azure Databricks Agent Skill references for system tables, audit logs, data quality monitoring, lineage, query history, jobs, compute, billable usage, warehouse events, and data classification.

## Required Signals

- Production jobs and pipelines must expose run status, duration, failure reason, retry behavior, owner, and affected datasets.
- Production datasets must expose freshness, row counts or volume indicators, schema changes, quality failures, and consumer impact when applicable.
- Cost-sensitive workloads must include compute or billable usage observability.
- SQL warehouses and dashboards must have query and usage visibility when they are part of the delivery.

## System Tables and Audit Logs

- Prefer Databricks system tables for jobs, lineage, audit logs, data quality monitoring, compute, billable usage, query history, warehouses, and data classification.
- Audit log delivery must be configured or explicitly listed as a platform prerequisite.
- Security-relevant activities must be traceable: grants, external locations, tokens, credentials, shares, jobs, pipelines, and workspace changes.

## Data Quality

- Critical data quality failures block downstream publication.
- Non-critical warnings require documented thresholds and remediation.
- Quarantine, rejected-record, or expectation-failure outputs must avoid leaking sensitive data.
- Monitoring alerts must identify owner and escalation path.

## Runbooks

- Every production pipeline must include a runbook with restart/replay guidance, known failure modes, data backfill strategy, quality gates, and escalation contacts or roles.
