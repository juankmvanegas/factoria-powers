# Testing Policy

These testing rules are mandatory for Factoria-DataEng.

## Unit and Spark Transformation Tests

- Data pipeline and orchestration code must have pytest coverage
- Validate schemas, expectations, and critical transformation behavior
- Validate error paths for missing sources, invalid records, and broken assumptions
- Test null semantics, duplicate handling, late-arriving data, schema drift, partition behavior, and incremental logic when they affect outputs
- Avoid tests that require a live workspace unless the workflow is explicitly integration or deployment validation

## Transformation Logic

- Reusable transformation helpers require tests when they affect data behavior or outputs
- Notebooks do not need direct unit tests, but their reusable extracted code does
- Notebooks with production logic must extract reusable code into `src/core` before delivery

## Pipeline Safety

- Changes to jobs, pipelines, params, schemas, or table names require verification of downstream compatibility
- Tests must help detect data pipeline regressions caused by pipeline changes
- Lakeflow expectations, Delta constraints, and data quality rules must have positive and negative test cases when practical
- Streaming changes must validate checkpoint compatibility, replay semantics, idempotency, and watermark behavior

## Documentation

- If the workflow changes, update README and operational documentation
- If dataset contracts change, update data dictionary, lineage, and runtime assumptions
- If deployment behavior changes, update Databricks Asset Bundle target notes and runbooks
