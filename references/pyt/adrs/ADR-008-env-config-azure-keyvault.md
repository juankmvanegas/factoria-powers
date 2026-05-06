# ADR-008: Environment Configuration with Azure Key Vault

## Status
Accepted

## Date
2025-06-01

## Context
Application configuration includes both non-sensitive settings (feature flags, timeouts, pagination defaults) and sensitive secrets (database passwords, API keys, encryption keys). We need a configuration strategy that is type-safe, environment-aware, and integrates with enterprise secret management while remaining simple for local development.

## Decision
We adopt a three-tier configuration strategy:

### 1. Pydantic BaseSettings for Typed Configuration

All configuration is modeled as Pydantic `BaseSettings` classes with full type validation:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DB_")
    host: str = "localhost"
    port: int = 5432
    name: str
    user: str
    password: SecretStr
```

### 2. .env Files for Local Development

- `.env` files are used ONLY for local development
- `.env` MUST be listed in `.gitignore` — NEVER committed to version control
- `.env.example` with placeholder values IS committed as documentation

### 3. Azure Key Vault for Production Secrets

- All secrets in staging/production are stored in Azure Key Vault
- Application retrieves secrets at startup via `azure-identity` + `azure-keyvault-secrets`
- Secrets are cached for the application lifetime (no repeated Key Vault calls)
- Key Vault access uses Managed Identity (no client secrets for Key Vault itself)

### Absolute Rule

**NEVER hardcode secrets, connection strings, API keys, or credentials in source code.**

## Consequences
### Positive
- Type-safe configuration catches misconfigurations at startup (fail fast)
- Pydantic validates types, constraints, and required fields automatically
- Azure Key Vault provides centralized, audited secret management
- `.env` files make local development simple without compromising security
- `SecretStr` prevents accidental logging of sensitive values

### Negative
- Azure Key Vault adds a dependency on Azure infrastructure
- Startup time increases slightly due to Key Vault calls
- Developers must maintain `.env` files locally (not version-controlled)

### Neutral
- The pattern mirrors the configuration approach in the .NET factory (replacing Azure App Configuration with Pydantic BaseSettings)
- Environment variables are the standard 12-factor app configuration mechanism
