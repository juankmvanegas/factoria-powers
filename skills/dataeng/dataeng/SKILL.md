---
name: dataeng-dataeng
description: "Azure Databricks, Spark, Delta Lake, Unity Catalog, Lakeflow, data quality, lineage, and monitoring specialist"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Data Engineering — Enterprise Standards

This skill is automatically activated when working with Azure Databricks, Spark, Delta Lake, Unity Catalog, Lakeflow pipelines, Databricks jobs, notebooks, data quality, lineage, or monitoring.

## Reproducibility

- Preserve Databricks Asset Bundle resources as the source of deployment truth
- Keep `params.yaml` or bundle variables as the source of tunable values
- Treat Databricks job run metadata as execution trace, not disposable noise

## Data Quality and Assets

- Lakeflow expectations, metrics, and data quality results must remain attributable
- Dataset naming changes require downstream validation
- Pipelines must consume governed sources and publish governed Delta assets

## Operational Rules

- Databricks job definitions must stay declarative
- Monitoring changes must preserve observability intent
- Notebook ordering and scope must remain understandable
