# ADR-013: Trained Models Load from Infrastructure

## Status

Accepted

## Decision

When the backend integrates machine learning, trained `.pkl` artifacts are loaded in `infrastructure`.

## Consequences

- Model access stays isolated from business orchestration
- Application uses abstractions instead of direct file handling
- Model loading can evolve without contaminating other layers
