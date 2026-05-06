# Security Testing Policy — Angular

> Mandatory for public routes, authentication flows, role-protected areas, forms, file uploads, and release candidates.

## 1. Security Suites

Formal security validation includes:
- SAST
- DAST
- dependency and secrets scanning
- abuse-oriented functional scenarios

## 2. SAST Scope

SAST must review:
- Angular source code
- configuration
- dependency manifests
- environment handling
- secrets exposure risks

## 3. DAST Scope

DAST must validate, when applicable:
- login and session handling
- unauthorized route access
- input validation
- exposed error details
- security headers and misconfiguration indicators

## 4. Blocking Criteria

Release is blocked when:
- CRITICAL or HIGH exploitable findings remain open
- secrets or tokens are exposed
- protected routes can be accessed incorrectly
- required DAST validation is skipped without approval

## 5. Evidence

Security reports must document:
- environment
- tools or method
- findings
- severity
- evidence
- recommendation
