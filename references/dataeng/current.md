# Current System Architecture

## Overview

Factoria-DataEng defines a **Data Engineering** baseline for Azure Databricks projects that combine:

- governed lakehouse assets,
- deterministic Spark transformations,
- Unity Catalog permissions and lineage,
- Lakeflow or Databricks Jobs orchestration,
- data quality gates,
- and production observability.

## Conceptual Flow

```text
source systems
     |
     v
bronze ingestion  -> raw Delta assets
     |
     v
silver transforms -> validated, conformed Delta assets
     |
     v
gold publishing   -> curated business-ready datasets
     |
     v
downstream consumers, BI, APIs, or ML workflows
```

## Runtime Layout

```text
.
├── databricks.yml
├── pyproject.toml
├── resources/
│   ├── jobs/
│   ├── pipelines/
│   └── permissions/
├── src/
│   ├── application/
│   ├── core/
│   ├── infrastructure/
│   └── initialization/
├── notebooks/
├── tests/
└── docs/
```

## Responsibility Map

### Databricks Asset Bundle

- owns deployment resources,
- defines jobs, pipelines, permissions, and variables,
- and keeps environment-specific configuration explicit.

### src/application

- owns pipeline entrypoints,
- orchestration contracts,
- and job-facing interfaces.

### src/core

- owns Spark transformations,
- schemas,
- data quality expectations,
- and domain-specific transformation rules.

### src/infrastructure

- owns source connectors,
- Unity Catalog references,
- external locations, volumes, storage, and observability adapters.

### src/initialization

- owns bootstrap helpers and manifests used by the platform setup.

## Operational Concerns

- `databricks.yml` is the bundle entrypoint
- Unity Catalog governs tables, volumes, functions, and permissions
- Lakeflow or Databricks Jobs define orchestration
- Data quality checks block promotion on critical failures
- System tables, job logs, and alerts provide operational evidence

## Delivery Expectations

- datasets must be traceable,
- lineage must be documented,
- transformations must be testable,
- notebooks must remain ordered and scoped,
- and pipeline execution must fail fast when required sources or contracts are missing.
