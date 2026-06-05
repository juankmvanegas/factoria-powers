# ADR-009: Configuration via .env and Azure Key Vault

## Status

Accepted

## Decision

Configuration starts in `.env`, and sensitive values are resolved from Azure Key Vault. Configuration is modeled as typed Pydantic `BaseSettings` classes.

### Tiers

1. **Typed configuration** — all settings are Pydantic `BaseSettings` with full type validation; misconfigurations fail fast at startup. Use `SecretStr` for sensitive values to prevent accidental logging.
2. **`.env` for local development** — `.env` is used only locally and MUST be in `.gitignore`; a committed `.env.example` with placeholders serves as documentation.
3. **Azure Key Vault for production secrets** — staging/production secrets are stored in Key Vault, retrieved at startup via `azure-identity` + `azure-keyvault-secrets`, cached for the application lifetime, and accessed via Managed Identity.

### Absolute Rule

NEVER hardcode secrets, connection strings, API keys, or credentials in source code.

## Consequences

- Secrets stay outside source control
- Environments share a consistent, type-safe configuration model
- `SecretStr` prevents accidental logging of sensitive values
- Non-standard configuration mechanisms require review
