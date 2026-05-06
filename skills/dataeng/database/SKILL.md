---
name: dataeng-database
description: "Persistence and artifact-storage specialist for Data Engineering services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Persistence and Artifact Storage — Data Engineering

This skill is automatically activated when working with repositories, artifact paths, runtime files, or storage-related integrations.

## Ownership

- Keep storage details explicit and externalized
- Do not leak operational details into API contracts
- Treat data assets as runtime dependencies with provenance

## Rules

- Never hardcode sensitive storage credentials
- Keep artifact locations configurable
- Preserve compatibility with Delta Lake-governed assets
