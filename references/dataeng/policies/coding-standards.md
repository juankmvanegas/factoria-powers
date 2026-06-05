# Coding Standards

These standards are mandatory for Factoria-DataEng and are based on the Azure Databricks Agent Skill references for configuration, integrations, coding patterns, Unity Catalog, Lakeflow, Databricks Asset Bundles, system tables, Spark, Delta, and SQL.

## 1. Repository and Bundle Structure

- `databricks.yml` is the root deployment entrypoint.
- Databricks Asset Bundles define jobs, pipelines, permissions, variables, targets, and environment-specific resources.
- Bundle resources live under `resources/` and should be split by concern: `jobs/`, `pipelines/`, `permissions/`, `schemas/`, and `dashboards/` when applicable.
- Workspace paths, catalog names, schema names, cluster IDs, warehouse IDs, and secret scopes must be variables or target-specific config, not hardcoded in code.
- Local-only files such as `.databricks/`, `.bundle/`, notebooks checkpoints, generated logs, and local `.env` files must not be committed.
- Legacy repositories organized by business domain are valid when they clearly separate orchestration, ingestion/standardization, publication, shared configuration, and utilities.
- In legacy repositories, `co_ppal_*`, `co_dl_*`, and `co_dwh_*` are semantic prefixes and must not be renamed casually.
- `Reprocesos/`, `OneTime/`, `Pruebas/`, `configuracion/`, `clases/`, and `Plantillas/` are first-class structural concepts when present.

## 2. Architecture Standards

- `application` owns pipeline entrypoints, orchestration contracts, and publication workflows.
- `core` owns Spark transformations, schema contracts, and domain rules.
- `infrastructure` owns connectors, Unity Catalog references, storage abstractions, service credentials, external locations, and observability adapters.
- `initialization` owns bootstrap scripts and platform setup manifests.
- Transformations must be deterministic, idempotent, and testable.
- Bronze, Silver, and Gold assets must have clear ownership, lineage, schema expectations, and downstream compatibility rules.
- In legacy repositories, the equivalent architecture must be mapped before any refactor:
  `co_ppal_*` as orchestration,
  `co_dl_*` as lake movement and conformance,
  `co_dwh_*` as warehouse publication,
  `configuracion/` and `clases/` as shared platform abstractions.

## 3. Spark and Delta Standards

- Prefer DataFrame or Spark SQL transformations that are explicit and reviewable.
- Do not use unbounded `collect()`, driver-side loops over large datasets, or hidden repartitioning without justification.
- Partitioning, clustering, Z-ordering, deletion vectors, constraints, and optimization choices must be documented when introduced.
- Delta `MERGE`, Change Data Feed, streaming checkpoints, and schema evolution must have explicit compatibility and replay semantics.
- Temporary views are allowed only as local implementation details; governed outputs must be Unity Catalog tables, views, materialized views, streaming tables, or volumes.
- If a legacy flow publishes to Synapse instead of directly exposing Delta outputs, the Synapse publication contract must be treated as a governed output.
- Mounted zones such as `transporte`, `cruda`, `formateada`, `refinada`, `parametros`, and `configuracion` are controlled vocabulary and should remain stable unless a migration plan changes them.

## 4. Integration Standards

- External sources must be integrated through infrastructure adapters or Lakeflow Connect resources.
- JDBC, Kafka, SQL Server, PostgreSQL, MySQL, Salesforce, SharePoint, ServiceNow, Workday, HubSpot, and other connectors require documented authentication, incremental strategy, retry behavior, and schema drift handling.
- Use Unity Catalog connections, service credentials, storage credentials, and external locations where available.
- Streaming integrations must define checkpoint location, trigger semantics, watermarking, idempotency, and failure recovery.
- Legacy `dbutils.secrets` access is acceptable only as a controlled compatibility mechanism and should be isolated in shared config/utilities code.
- Synapse read/write helpers, `MERGE` semantics, and staging locations must be centralized and reused, not reimplemented inconsistently across notebooks.

## 5. Naming and Documentation

- Code is written in Spanish when it expresses business logic.
- Folder names, file suffixes, dataset layers, and technical identifiers use stable English names.
- Dataset names must reveal layer and business meaning without embedding environment names.
- Every production dataset change must update the data dictionary, lineage notes, and consumer impact.
- Every production job or pipeline change must update the runbook or operational notes.
- In legacy repositories, domain folders should continue reflecting business nouns already known by the team unless an approved consolidation plan exists.

## 6. Testing

- Use pytest for Python helpers and Spark transformation tests.
- Use local Spark sessions or approved Spark test helpers for transformation behavior.
- Schema, quality rules, idempotency, null semantics, late-arriving data, and incremental behavior require coverage when they affect business outputs.
- Legacy notebooks with dense transformation logic should extract reusable sections into shared modules before they grow further, even if the notebook entrypoint remains in place.
