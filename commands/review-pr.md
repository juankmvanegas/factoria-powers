# /review-pr

Reviews code changes against all project policies and architecture rules.

## What it does
Analyzes a pull request or set of code changes for compliance with coding standards, security policy, testing policy, and architecture rules.

## Instructions
1. This command runs directly — no sub-agent delegation needed
2. Read all policies:
   - `.cloud/policies/coding-standards.md`
   - `.cloud/policies/security-policy.md`
   - `.cloud/policies/testing-policy.md`
3. Read the architecture: `.cloud/architecture/current.md`
4. Read all ADRs in `.cloud/architecture/decisions/`
5. Review the changes against:
   - **Architecture:** Layer dependencies, no new layers, correct namespaces
   - **Coding Standards:** Naming conventions, patterns, DI registration
   - **Security:** No secrets, no system details in errors, input validation
   - **Testing:** Tests exist for new services, AAA pattern, correct naming
   - **Packages:** No unauthorized packages (check `Directory.Packages.props`)
6. Report findings with severity: BLOCK, WARN, or INFO

## Usage
```
/review-pr [PR number or branch name]
```
