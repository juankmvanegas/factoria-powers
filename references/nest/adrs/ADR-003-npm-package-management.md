# ADR-003: npm Package Management

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
Consistent dependency management is critical for reproducible builds, security auditing, and team collaboration. BFF projects need a standardized approach ensuring all environments use identical dependency trees.

## Decision
Adopt npm as the sole package manager with strict version control:

- **npm** (bundled with Node.js 20 LTS) as the only allowed package manager. No yarn or pnpm.
- `package-lock.json` must be committed. No alternative lockfiles allowed.
- **Production dependencies**: exact versions (no `^` or `~`) to prevent unexpected updates.
- **Dev dependencies**: allow minor version ranges (`^`) for tooling flexibility.
- **Approved stack only**: NestJS ecosystem, Azure SDK, class-validator/class-transformer, Jest, ESLint/Prettier, dependency-cruiser. New packages require ADR or team approval.
- `npm audit` runs in CI. Critical vulnerabilities block deployment. High vulnerabilities resolved within one sprint.

## Consequences
- Exact production versions eliminate surprise updates
- Lockfile guarantees reproducible builds across all environments
- Approved stack prevents dependency proliferation
- Exact versions require more frequent manual updates
- Adding new packages has additional friction (requires approval)
