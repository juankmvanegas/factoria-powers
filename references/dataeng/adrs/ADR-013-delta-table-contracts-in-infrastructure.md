# ADR-013: Delta Table Contracts Live in Infrastructure

## Status

Accepted

## Decision

Infrastructure owns concrete Delta table, volume, external location, and connector references. Core transformations depend on explicit dataset contracts, not workspace-specific table names or secret-backed paths.

## Consequences

- Core transformations remain portable and testable
- Unity Catalog names are centralized and easier to govern
- Dataset contract changes require downstream compatibility checks
