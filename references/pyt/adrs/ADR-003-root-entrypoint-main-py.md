# ADR-003: Root Entrypoint in main.py

## Status

Accepted

## Decision

The application bootstraps from `main.py` at the repository root.

## Consequences

- Service startup remains predictable
- Uvicorn runs against `main:app`
- Bootstrap logic is not scattered across arbitrary files
