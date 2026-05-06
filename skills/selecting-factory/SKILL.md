---
name: selecting-factory
description: Use when the active factory could not be auto-detected from the project files and the user must be asked to select one
---

# Selecting Factory

## When Auto-Detection Fails

The SessionStart hook checked the project root for known signals. None matched. Detection order and signals:
- `.sln` / `.csproj` / `Program.cs` → net
- `databricks.yml` / `dlt.yml` / `pyspark` / `delta-spark` in deps → dataeng
- `dvc.yaml` / `mlflow` / `dvc[azure]` in deps → pytml
- `main.py` / `fastapi` in deps → pyt
- `@nestjs/core` in deps → nest
- `angular.json` / `@angular/core` → ang
- `*.swift` / `Package.swift` / `*.xcodeproj` → swf
- `theme.json` + `functions.php` + `style.css`, or `wp-content/` → wps
- `build.gradle.kts` / `*.kt` / `AndroidManifest.xml` → kot

## Ask the User

Pose this question exactly once:

> Which Factoria factory does this project use?
> 1. **net** — .NET 8 / C# / Clean Architecture 4 layers
> 2. **ang** — Angular 16+ / TypeScript / SPA
> 3. **nest** — NestJS 11 / TypeScript / BFF
> 4. **pyt** — Python 3.11+ / FastAPI / Clean Architecture
> 5. **pytml** — Python MLOps / FastAPI + DVC + MLflow + Databricks
> 6. **dataeng** — Databricks / PySpark / Delta Lake / Medallion
> 7. **kot** — Android / Kotlin / MVVM + Feature Modules
> 8. **swf** — iOS / Swift / MVVM + SPM
> 9. **wps** — WordPress Block Theme / FSE / Gutenberg

## After Selection

1. Set `ACTIVE_FACTORY=<choice>` in session context.
2. Invoke skill `factoria:loading-factory-context` to load policies and ADRs.
3. Proceed with the original user request.

## Rules

- NEVER assume a factory without confirmation
- NEVER ask more than once
- If the user says "none" or the project is not a Factoria project, inform them that Factoria skills won't apply and work normally
