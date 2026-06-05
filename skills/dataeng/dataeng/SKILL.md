---
name: dataeng-dataeng
description: "Azure Databricks, Spark, Delta Lake, Unity Catalog, Lakeflow, data quality, lineage, and monitoring specialist"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Data Engineering — Enterprise Standards

This skill is automatically activated when working with Azure Databricks, Spark, Delta Lake, Unity Catalog, Lakeflow pipelines, Databricks jobs, notebooks, data quality, lineage, monitoring, Synapse publication, or mounted Data Lake zones.

## Reproducibility

- Preserve Databricks Asset Bundle resources as the source of deployment truth
- Keep `params.yaml` or bundle variables as the source of tunable values
- Treat Databricks job run metadata as execution trace, not disposable noise
- When the repository is legacy notebook-first, preserve the existing domain folder structure until an approved migration plan says otherwise
- Preserve semantic notebook roles: `co_ppal_*` orchestrates, `co_dl_*` prepares data across lake zones, `co_dwh_*` publishes analytical outputs

## Data Quality and Assets

- Lakeflow expectations, metrics, and data quality results must remain attributable
- Dataset naming changes require downstream validation
- Pipelines must consume governed sources and publish governed Delta assets
- If the current contract publishes to Synapse, downstream validation must include the Synapse serving layer and not only Delta outputs

## Operational Rules

- Databricks job definitions must stay declarative
- Monitoring changes must preserve observability intent
- Notebook ordering and scope must remain understandable
- Reprocess and one-time flows must remain explicit and auditable
- Mounted routes, widgets, `%run` dependencies, and shared helpers are part of the execution contract in legacy repositories and must be mapped before refactoring
