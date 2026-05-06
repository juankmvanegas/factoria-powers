---
name: dataeng-backend
description: "Python data pipeline specialist for Data Engineering services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Backend Data Engineering — Enterprise Standards

This skill is automatically activated when writing Python data pipeline code: Spark job endpoints, startup, warmup, configuration, or runtime data pipeline orchestration.

## Boundaries

- `main.py` validates artifacts and starts the service
- `src/application/api` exposes REST endpoints
- `src/application/services` orchestrates data pipeline behavior
- Training and quality profiling do not happen inside API requests

## Data pipeline Rules

- Keep endpoints thin
- Validate input at the boundary
- Warm up only what is needed for runtime
- Fail fast if required artifacts are missing

## Source of Truth

This skill implements the rules defined in:
- `.cloud/policies/coding-standards.md`
- `.cloud/policies/security-policy.md`
