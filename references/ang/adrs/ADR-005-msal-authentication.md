# ADR-005: MSAL for Authentication (AAD + B2C)

## Status
Accepted

## Context
The company uses Azure Active Directory and Azure AD B2C for authentication.

## Decision
Use `@azure/msal-angular` v3 with dual support (AAD + B2C).

### Architecture
- `MsalAdapter` (abstract in Application) defines the contract
- `MicrosoftAuthenticationLibraryService` (Infrastructure) implements it
- Separate providers: `msal-aad.providers.ts` and `msal-b2c.providers.ts`
- Guards: `BaseGuard` (auth) + `RoleGuard` (roles from JWT)

### Security
- Tokens in memory (NEVER localStorage)
- Automatic refresh before expiration
- Roles extracted from `idTokenClaims`

## Consequences
- Positive: Enterprise SSO, managed security, JWT roles
- Negative: Azure dependency, complex initial configuration
