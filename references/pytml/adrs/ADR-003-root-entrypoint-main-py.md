# ADR-003: Root Entrypoint and Runtime Validation in main.py

## Status

Accepted

## Decision

The service bootstraps from `main.py` at the repository root and validates required artifacts before serving.

## Consequences

- Startup remains predictable
- Inference fails fast when assets are missing
