# Coding Standards

Extracted from the Python MLOps template and enterprise engineering rules.

## 1. Architecture Standards

- `main.py` is the root service entrypoint
- `dvc.yaml` defines reproducible stages
- `params.yaml` centralizes tunable parameters
- `application` serves and orchestrates inference
- `core` contains notebooks and analytical logic
- `infrastructure` contains monitoring and operational support
- `initialization` contains setup scripts and manifests

## 2. Naming Conventions

- Code is written in Spanish when it expresses business logic
- Folder names and file suffixes are written in English
- Notebooks follow ordered prefixes such as `0.01-...`, `1.01-...`
- Artifact names must be descriptive and stable
- Parameter keys must remain explicit and traceable

## 3. Reproducibility Standards

- Do not introduce hidden pipeline steps outside `dvc.yaml`
- Do not hardcode artifact paths when they should be configurable
- Preserve DVC, MLflow, and Databricks alignment when changing the workflow
- Runtime inference must consume previously generated artifacts

## 4. Serving Standards

- FastAPI endpoints stay thin
- Validation happens at the API boundary
- Startup verifies artifact availability
- Serving code must not trigger training side effects

## 5. Data Science Assets

- Reusable analytical code belongs in `src/core/libraries`
- Notebooks belong in `src/core/data_science/notebooks`
- Reports and generated analytical outputs must remain organized and attributable

## 6. Security and Config

- No secrets in code
- No storage credentials in notebooks or manifests
- Runtime and remote execution settings must be externalized

## 7. Testing

- Prefer pytest
- Test service behavior, validation logic, and critical helpers
- Analytical transformations with business impact require coverage
