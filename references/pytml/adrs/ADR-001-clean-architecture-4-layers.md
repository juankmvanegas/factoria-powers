# ADR-001: MLOps Service Structure with Application, Core, Infrastructure, and Initialization

## Status

Accepted

## Decision

Python MLOps services built with this factory use four fixed areas: `application`, `core`, `infrastructure`, and `initialization`.

## Consequences

- Serving remains separated from analytical code
- Notebook and artifact logic stays in `core`
- Operational setup stays explicit
