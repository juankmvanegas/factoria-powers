# ADR-013: Runtime Inference Depends on Validated .pkl Artifacts

## Status

Accepted

## Decision

Inference startup depends on validated `.pkl` artifacts generated upstream by the pipeline.

## Consequences

- Serving does not guess artifact state
- Startup checks become mandatory
