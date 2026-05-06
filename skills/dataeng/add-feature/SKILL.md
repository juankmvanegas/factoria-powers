---
name: dataeng-add-feature
description: "Add a new Data Engineering feature following the service and reproducibility boundaries"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Add a new feature without breaking data pipeline data pipeline, reproducibility, artifact lineage, or monitoring assumptions.

## Execution Flow

1. Understand whether the feature affects data pipeline, ingestion and transformation, artifacts, monitoring, or remote orchestration
2. Update the appropriate area:
   - `src/application` for data pipeline/orchestration
   - `src/core` for analytical logic
   - `src/infrastructure` for monitoring/ops
   - `src/initialization` for operational helpers
3. If the feature changes stage execution, review `databricks.yml`, `params.yaml`, and artifact expectations
4. Add tests and update docs

## Rules

- Do not blur ingestion and transformation and data pipeline responsibilities
- Do not hide artifact assumptions
- Do not introduce silent pipeline side effects
