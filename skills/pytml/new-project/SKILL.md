---
name: pytml-new-project
description: "Initialize Factoria in a Python MLOps project — from scratch or on an existing analytical template"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Prepare a Python MLOps project to work with Factoria. Supports two scenarios:

- **Scenario A**: Empty folder → complete MLOps scaffold
- **Scenario B**: Existing science/data/inference project → analysis, validation, and onboarding

## Execution Flow

### Step 0: Automatic Detection

Before any questions, scan the project directory:

1. Look for `main.py`, `pyproject.toml`, `dvc.yaml`, `databricks.yml`, `src/`, and `tests/`
2. If they **do NOT exist** → **Scenario A**
3. If they **exist** → **Scenario B**

## Scenario A: Project from Scratch

Ask for:

1. Project name
2. Business purpose of the model
3. Main inference contract
4. Whether the solution needs DVC, MLflow, Databricks, monitoring, or all of them
5. Artifact types expected in runtime

Generate the baseline:

- `main.py`
- `pyproject.toml`
- `dvc.yaml`
- `params.yaml`
- `databricks.yml` if remote orchestration is needed
- `src/application`, `src/core`, `src/infrastructure`, `src/initialization`
- `docs/`, `resources/`, `tests/`

## Rules

- Keep the service reproducible
- Keep serving separate from training execution
- Model artifacts must be expected and validated explicitly
