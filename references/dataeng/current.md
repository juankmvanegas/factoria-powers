# Current System Architecture

## Overview

Factoria-DataEng defines a **Data Engineering** baseline for Azure Databricks projects that combine:

- governed lakehouse assets,
- deterministic Spark transformations,
- Unity Catalog permissions and lineage,
- Lakeflow or Databricks Jobs orchestration,
- data quality gates,
- production observability,
- and, when applicable, Synapse publication contracts.

## Conceptual Flow

```text
source systems
     |
     v
transporte/cruda   -> landing and raw persistence
     |
     v
formateada         -> cleaned and standardized data
     |
     v
refinada / gold    -> curated business-ready datasets
     |
     +--> Synapse analytical serving when required
     |
     v
downstream consumers, BI, APIs, or ML workflows
```

## Runtime Layout

Factoria-DataEng accepts two runtime layouts.

### Modern layout

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

### Legacy team layout

```text
.
├── configuracion/
├── clases/
├── Plantillas/
├── Reprocesos/
├── OneTime/
├── Pruebas/
└── <dominio>/
    ├── co_ppal_*.py
    ├── co_dl_*.py
    └── co_dwh_*.py
```

## Responsibility Map

### Databricks Asset Bundle

- owns deployment resources,
- defines jobs, pipelines, permissions, and variables,
- and keeps environment-specific configuration explicit.

### Legacy domain orchestrators

- `co_ppal_*` owns orchestration and notebook chaining,
- `co_dl_*` owns movement across lake zones plus standardization,
- and `co_dwh_*` owns dimensional, fact, or analytical publication outputs.

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
- Mounted `/mnt` routes are operational dependencies in legacy estates
- Reprocess and one-time flows must remain explicit and auditable
- Synapse publications are part of the serving contract when consumers depend on them

## Delivery Expectations

- datasets must be traceable,
- lineage must be documented,
- transformations must be testable,
- notebooks must remain ordered and scoped,
- and pipeline execution must fail fast when required sources or contracts are missing.
