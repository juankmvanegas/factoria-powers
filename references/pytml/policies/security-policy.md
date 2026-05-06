# Security Policy

These rules are mandatory for every Python backend generated or modified by Factoria-Pyt.

## Secrets

- Never hardcode passwords, tokens, API keys, or connection strings
- Sensitive values are resolved through `.env` references and Azure Key Vault
- Local development must use secure credential resolution such as Azure CLI authentication

## Error Exposure

- Never expose stack traces or internal dependency details to consumers
- Exception payloads must be semantic and sanitized
- Infrastructure errors must be translated before crossing layer boundaries

## External Integrations

- All outbound URLs must come from configuration
- Validate and sanitize outbound data before calling third-party services
- Do not trust external payloads; map them explicitly before use

## Logging and Tracing

- Logs must avoid secrets and personal data unless explicitly masked
- Temporary debug logs must be removed before delivery
- Observability must support diagnosis without leaking confidential values

## Dependencies

- Only use maintained packages from trusted sources such as PyPI and recognized vendors
- Individual-maintainer packages require recent maintenance, acceptable license, and no critical vulnerabilities
- New dependencies must be justified and reviewed
