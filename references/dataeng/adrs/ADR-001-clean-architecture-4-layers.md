# ADR-001: Data Engineering Structure with Application, Core, Infrastructure, and Initialization

## Status

Accepted

## Decision

Data Engineering projects built with this factory use four fixed areas: `application`, `core`, `infrastructure`, and `initialization`.

## Consequences

- Pipeline orchestration remains separated from transformation logic
- Spark transformations and dataset contracts stay in `core`
- Platform setup and deployment resources stay explicit
