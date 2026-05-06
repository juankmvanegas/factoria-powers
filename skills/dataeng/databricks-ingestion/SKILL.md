---
name: dataeng-databricks-ingestion
description: "Implement Azure Databricks ingestion patterns for cloud storage, JDBC, Kafka, Lakeflow Connect, Auto Loader, CDC, streaming, and external systems with secure credentials and schema drift handling."
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Databricks Ingestion

Use this skill when connecting to external data systems, cloud storage, Kafka, SQL databases, SaaS connectors, Lakeflow Connect, Auto Loader, CDC, or streaming sources.

## Required Context

1. Read `security-policy`.
2. Read `coding-standards`.
3. Read `databricks-governance-policy`.
4. Identify source system, authentication model, incremental strategy, expected schema, volume, SLA, and failure behavior.

## Execution Rules

- Use Unity Catalog connections, service credentials, storage credentials, external locations, or volumes where available.
- Do not embed credentials in Spark options, notebooks, bundle variables, or code.
- Define schema drift behavior explicitly.
- Define incremental ingestion strategy: CDC, timestamp, sequence, watermark, file notification, Auto Loader metadata, or full refresh.
- Streaming sources require checkpointing, watermarking, backpressure/failure recovery, and idempotent writes.
- JDBC sources require partitioning strategy, predicate pushdown considerations, and source load protection.

## Deliverables

- Secure connector or ingestion code.
- Configuration contract without secret values.
- Bronze target contract and schema expectations.
- Tests or validation queries for schema and incremental behavior.
- Operational notes for replay, backfill, and source failures.
