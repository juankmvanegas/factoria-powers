# ADR-002: Python 3.11 and Databricks Runtime Baseline

## Status

Accepted

## Decision

Data Engineering projects use Python `3.11.x` with Databricks Runtime LTS, PySpark, Spark SQL, and Delta Lake as the standard execution baseline.

## Consequences

- New pipelines follow the same runtime baseline
- Libraries must remain compatible with the selected Databricks Runtime
- Runtime upgrades require compatibility validation for Spark, Delta, connectors, and tests
