---
name: pytml-database
description: "Persistence and artifact-storage specialist for Python MLOps services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Persistence and Artifact Storage — Python MLOps

This skill is automatically activated when working with repositories, artifact paths, runtime files, or storage-related integrations.

## Ownership

- Keep storage details explicit and externalized
- Do not leak operational details into API contracts
- Treat model artifacts as runtime dependencies with provenance

## Rules

- Never hardcode sensitive storage credentials
- Keep artifact locations configurable
- Preserve compatibility with DVC-governed assets
