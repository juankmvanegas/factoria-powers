# ADR-015: Legacy Notebook-First Domain Repositories Are a Supported Migration Baseline

## Status

Accepted

## Decision

Factoria-DataEng must explicitly support Databricks repositories organized by business domain, shared utility folders, and notebook/script entrypoints such as `co_ppal_*`, `co_dl_*`, and `co_dwh_*` as a valid legacy baseline.

## Consequences

- Migration and maintenance workflows must understand domain-oriented folders before proposing structural changes
- The factory cannot assume that every existing team repository already follows Databricks Asset Bundle structure
- Refactors must preserve operational behavior before introducing modern repository shapes
