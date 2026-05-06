---
name: dataeng-lakeflow-pipelines
description: "Design and implement Azure Databricks Lakeflow or Jobs-based pipelines with Bronze/Silver/Gold layers, expectations, idempotency, schema handling, incremental processing, and recovery semantics."
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Lakeflow Pipelines

Use this skill for ingestion, transformation, streaming, CDC, Auto Loader, Lakeflow Declarative Pipelines, Databricks Jobs, Bronze/Silver/Gold assets, expectations, or quality gates.

## Required Context

1. Read `coding-standards`.
2. Read `testing-policy`.
3. Read `data-observability-policy`.
4. Identify source systems, target datasets, incremental keys, and downstream consumers.

## Execution Rules

- Separate ingestion from business transformation.
- Bronze stores raw or minimally processed inputs.
- Silver stores validated and conformed data.
- Gold stores curated consumer-ready datasets.
- Pipelines must be idempotent and replay-aware.
- Streaming workloads require checkpoint, trigger, watermark, deduplication, and failure recovery decisions.
- CDC and `MERGE` logic require deterministic keys and clear delete/update semantics.
- Expectations or equivalent data quality checks are mandatory for production pipeline promotion.

## Deliverables

- Pipeline/job resources.
- Reusable transformations under `src/core`.
- Source-to-target mapping.
- Quality expectations and tests.
- Data dictionary, lineage notes, and operational runbook updates.
