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
- `ResolveSecrets` MUST run in `Program.cs` before `InfrastructureDependencyInjection` or any provider that reads connection strings, credentials, certificates, API keys, or Service Bus settings
- If Key Vault cannot be reached in a non-local environment, startup MUST fail fast instead of falling back to committed configuration
- Local development may use User Secrets or ignored environment files only for developer credentials; versioned `appsettings*.json` files remain non-secret

### Initialization Layer Contract
Each initializer (`RestApiService`, `GrpcApiService`, `MessagingService`, `CronJobService`) MUST include the Key Vault resolution step in its own `Program.cs`. Multiple initializers in the same solution cannot rely on a different initializer to resolve secrets.

Required sequence:

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.AddCustomConfiguration();
builder.Configuration.ResolveSecrets();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddCustomServices(builder.Configuration);

WebApplication app = builder.Build();

await app.RunAsync();
```

Equivalent host-builder syntax is allowed for Messaging and CronJob services, but the order is mandatory: configuration providers first, Key Vault resolution second, DI registration third.

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
- Health checks, smoke tests, and onboarding reports must flag missing or late `ResolveSecrets` calls as non-compliant
