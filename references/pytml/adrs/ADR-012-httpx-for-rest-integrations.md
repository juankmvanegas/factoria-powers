# ADR-012: DVC and MLflow Are First-Class Operational Dependencies

## Status

Accepted

## Decision

Reproducibility and experiment tracking rely on DVC and MLflow as first-class operational dependencies.

## Consequences

- Artifact lineage and metric lineage are not optional
- Workflow changes must consider both systems
