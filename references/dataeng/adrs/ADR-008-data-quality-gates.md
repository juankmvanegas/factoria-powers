# ADR-008: Data Quality Gates

## Status

Accepted

## Decision

Critical data quality rules are mandatory gates for production pipeline promotion. Expectations can be implemented with Lakeflow expectations, reusable validation helpers, or explicit test suites.

## Consequences

- Broken contracts stop downstream publication
- Quality failures are observable and attributable
- Non-critical warnings are documented with remediation paths
