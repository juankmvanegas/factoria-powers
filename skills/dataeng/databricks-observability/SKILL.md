---
name: dataeng-databricks-observability
description: "Use Databricks system tables, audit logs, lineage, data quality monitoring, jobs, compute, query history, warehouse events, and billable usage to design production observability."
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Databricks Observability

Use this skill when adding monitoring, runbooks, cost tracking, audit evidence, quality monitoring, lineage, alerts, or production diagnostics.

## Required Context

1. Read `data-observability-policy`.
2. Read `security-policy`.
3. Identify affected jobs, pipelines, datasets, warehouses, dashboards, and owners.

## Execution Rules

- Prefer Databricks system tables for jobs, lineage, audit logs, data quality monitoring, compute, billable usage, query history, warehouses, and data classification.
- Production pipelines need run status, duration, failure reason, retry behavior, freshness, quality, and owner signals.
- Cost-sensitive workloads need compute or billable usage visibility.
- Security-sensitive changes need audit evidence.
- Do not log secrets, PII, raw rejected records, or restricted payloads.

## Deliverables

- Monitoring queries, dashboards, alerts, or documentation.
- Runbook updates with restart/replay guidance.
- Quality-failure remediation notes.
- Evidence of lineage and affected downstream consumers.
