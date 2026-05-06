# ADR-009: Configuration via .env and Azure Key Vault

## Status

Accepted

## Decision

Configuration starts in `.env`, and sensitive values are resolved from Azure Key Vault.

## Consequences

- Secrets stay outside source control
- Environments share a consistent configuration model
- Non-standard configuration mechanisms require review
