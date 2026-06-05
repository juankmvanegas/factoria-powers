# ADR-016: Synapse Publication Is a First-Class Analytical Serving Boundary

## Status

Accepted

## Decision

When the current platform publishes curated datasets to Synapse, that publication layer is treated as a first-class contract boundary alongside lakehouse storage.

## Consequences

- Changes to `co_dwh_*` flows require downstream compatibility validation
- Synapse table names, merge semantics, and publication schedules are part of the delivery contract
- Lakehouse modernization cannot remove Synapse publication without explicit consumer review and migration planning
