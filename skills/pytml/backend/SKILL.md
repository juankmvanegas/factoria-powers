---
name: pytml-backend
description: "Python serving specialist for MLOps services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Backend Python MLOps — Enterprise Standards

This skill is automatically activated when writing Python serving code: FastAPI endpoints, startup, warmup, configuration, or runtime inference orchestration.

## Boundaries

- `main.py` validates artifacts and starts the service
- `src/application/api` exposes REST endpoints
- `src/application/services` orchestrates inference behavior
- Training and experimentation do not happen inside API requests

## Serving Rules

- Keep endpoints thin
- Validate input at the boundary
- Warm up only what is needed for runtime
- Fail fast if required artifacts are missing

## Source of Truth

This skill implements the rules defined in:
- `.cloud/policies/coding-standards.md`
- `.cloud/policies/security-policy.md`
