---
name: dataeng-new-project
description: "Initialize Factoria in a Data Engineering project — from scratch or on an existing analytical template"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Prepare a Data Engineering project to work with Factoria. Supports two scenarios:

- **Scenario A**: Empty folder → complete Data Engineering scaffold
- **Scenario B**: Existing science/data/data pipeline project → analysis, validation, and onboarding

## Execution Flow

### Step 0: Automatic Detection

Before any questions, scan the project directory:

1. Look for `main.py`, `pyproject.toml`, `databricks.yml`, `databricks.yml`, `src/`, and `tests/`
2. If they **do NOT exist** → **Scenario A**
3. If they **exist** → **Scenario B**

## Scenario A: Project from Scratch

Ask for:

1. Project name
2. Business purpose of the data
3. Main data pipeline contract
4. Whether the solution needs Delta Lake, Delta Live Tables, Databricks, monitoring, or all of them
5. Artifact types expected in runtime

Generate the baseline:

- `main.py`
- `pyproject.toml`
- `databricks.yml`
- `params.yaml`
- `databricks.yml` if remote orchestration is needed
- `src/application`, `src/core`, `src/infrastructure`, `src/initialization`
- `docs/`, `resources/`, `tests/`

## Rules

- Keep the service reproducible
- Keep data pipeline separate from ingestion and transformation execution
- Data artifacts must be expected and validated explicitly
