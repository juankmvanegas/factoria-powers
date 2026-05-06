# ADR-008: Azure Key Vault for Secrets Management

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF requires access to sensitive configuration: API keys, connection strings, and third-party credentials. Storing these in code or committed config files creates security vulnerabilities. The organization uses Azure Key Vault as the standard secrets management solution.

## Decision
Use `@azure/keyvault-secrets` with `@azure/identity` (DefaultAzureCredential) for all secrets management, integrated with `@nestjs/config`:

- **NEVER** store secrets in source code, committed `.env` files, or configuration files.
- `.env` files allowed ONLY for local development, must be in `.gitignore`.
- All production secrets MUST come from Azure Key Vault.
- Secret naming convention: `{service}-{environment}-{secret-name}` (e.g., `bff-prod-service-bus-connection`).
- Secrets loaded at application startup and cached for the application lifecycle. Rotation handled by Key Vault policies — BFF reads latest version on restart.
- DefaultAzureCredential works in local dev (Azure CLI) and production (Managed Identity).

## Consequences
- Secrets never exist in source code or configuration files
- Azure Key Vault provides audit, rotation, and centralized access control
- Adds network dependency at startup (Key Vault latency)
- Local development requires additional setup (Azure CLI login or .env)
- If Key Vault is unavailable at startup, application fails to start
- Secret rotation requires application restart
