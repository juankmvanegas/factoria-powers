# Current System Architecture

## Overview

Factoria-Pyt-MLOps defines a **Python MLOps** baseline for services that combine:

- reproducible data/model pipelines,
- tracked experiments,
- versioned artifacts,
- and a FastAPI inference surface.

## Conceptual Flow

```text
notebooks / params / code
        |
        v
     DVC pipeline  -----> tracked artifacts
        |                    |
        v                    v
     MLflow metrics      inference .pkl assets
                                |
                                v
                             main.py
                                |
                                v
                     FastAPI serving application
```

## Runtime Layout

```text
.
├── main.py
├── dvc.yaml
├── dvc.lock
├── params.yaml
├── databricks.yml
├── docs/
├── resources/
├── src/
│   ├── application/
│   │   ├── api/
│   │   ├── config/
│   │   └── services/
│   ├── core/
│   │   ├── data_science/
│   │   └── libraries/
│   ├── infrastructure/
│   │   └── monitoring/
│   └── initialization/
└── tests/
```

## Responsibility Map

### main.py

- validates required artifacts,
- starts the serving process,
- and points Uvicorn to the application entrypoint.

### src/application

- owns FastAPI exposure,
- runtime configuration,
- warmup logic,
- and inference orchestration.

### src/core

- owns notebooks,
- reusable analytical methods,
- experiment logic,
- and domain-specific transformation rules.

### src/infrastructure

- owns monitoring and operational support assets.

### src/initialization

- owns runtime setup helpers and manifests used by the pipeline.

## Operational Concerns

- `dvc.yaml` defines stage execution
- `dvc.lock` records reproducible state
- `params.yaml` centralizes tunable values
- `databricks.yml` models remote execution
- serving depends on already-built artifacts; training is not part of API startup

## Delivery Expectations

- artifacts must be traceable,
- metrics must be attributable,
- notebooks must remain ordered and reproducible,
- and inference must fail fast when required assets are missing.
