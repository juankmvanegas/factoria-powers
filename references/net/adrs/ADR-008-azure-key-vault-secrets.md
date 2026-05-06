# ADR-008: Azure Key Vault for Secrets Management

## Status
Accepted

## Date
2023-04-19

## Context
Secrets (connection strings, API keys, certificates) must not exist in code
or versioned configuration files per corporate security policy.

## Decision
Use Azure Key Vault as the sole secrets store with runtime resolution.

### Configuration
```json
{
  "AzureKeyVaultConfig": {
    "TenantId": "...",
    "AppId": "...",
    "AppSecret": "...",
    "KeyVault": "https://[name].vault.azure.net"
  }
}
```

### Resolution Pattern
- `ResolveSecrets` is called at application startup
- Secrets are injected into configuration before services are built
- Connection strings for SQL Server, MongoDB, and Service Bus come from Key Vault

### What Must Be in Key Vault
- RSA public/private keys
- AES encryption keys
- Digital certificates
- Service passwords
- Connection strings (SQL, MongoDB, Service Bus)
- API keys
- Firebase credentials

## Consequences
- Local development uses `appsettings.Development.json` (in `.gitignore`)
- Production uses Key Vault exclusively
- Key Vault credentials themselves come from the deployment pipeline
- No secrets in versioned files
