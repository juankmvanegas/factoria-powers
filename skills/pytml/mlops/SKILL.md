---
name: pytml-mlops
description: "Reproducibility, artifacts, DVC, MLflow, Databricks, and monitoring specialist"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# MLOps — Enterprise Standards

This skill is automatically activated when working with DVC, MLflow, Databricks, notebooks, params, runtime artifacts, or model monitoring.

## Reproducibility

- Preserve the stage model in `dvc.yaml`
- Keep `params.yaml` as the source of tunable values
- Treat `dvc.lock` as execution trace, not disposable noise

## Experiments and Artifacts

- MLflow metrics and artifacts must remain attributable
- Artifact naming changes require downstream validation
- Runtime inference must consume generated artifacts, not ad-hoc local files

## Operational Rules

- Databricks job definitions must stay declarative
- Monitoring changes must preserve observability intent
- Notebook ordering and scope must remain understandable
