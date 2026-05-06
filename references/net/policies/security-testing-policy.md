# Security Testing Policy

> Mandatory for release candidates and any feature that affects authentication, authorization, data exposure, file handling, public endpoints, or external integrations.

## 1. Specialized Security Suites

Security validation in Factoria QA includes:
- SAST
- DAST
- Dependency and secrets scanning
- Security-focused functional abuse scenarios

`security-scan` remains the fast guard. Formal release validation requires dedicated reports.

## 2. SAST Requirements

SAST must review:
- Application code
- Configuration files
- Dependency manifests
- Infrastructure-as-code if present
- Secrets exposure patterns

The report must classify findings by severity and indicate fix guidance.

## 3. DAST Requirements

DAST must be executed only against approved non-production environments.

The suite must verify, when applicable:
- Authentication flows
- Authorization gaps
- Input validation
- Injection vectors
- Security headers
- Error handling exposure
- Sensitive endpoint discovery

## 4. Blocking Criteria

Delivery is blocked when:
- Any exploitable CRITICAL finding exists
- Any HIGH finding exists without an approved exception
- Secrets are exposed
- Public endpoints bypass required auth rules
- DAST cannot be executed and the risk level requires it

## 5. Evidence

Security reports must include:
- Target environment
- Tool or method used
- Findings with severity
- Evidence
- Recommended remediation
- Final recommendation

## 6. Exceptions

Exceptions must be documented with:
- Risk accepted
- Approver
- Expiration date
- Mitigation plan
