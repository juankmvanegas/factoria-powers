# ADR-004: Medallion Lakehouse Architecture

## Status

Accepted

## Decision

Lakehouse datasets are organized into Bronze, Silver, and Gold layers. Each layer has explicit ownership, schemas, quality expectations, and downstream compatibility responsibilities.

## Consequences

- Raw ingestion is separated from conformed transformations and curated outputs
- Data consumers can reason about dataset maturity
- Promotion across layers requires quality and contract validation
