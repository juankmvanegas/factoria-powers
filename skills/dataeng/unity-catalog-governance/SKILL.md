---
name: dataeng-unity-catalog-governance
description: "Apply Azure Databricks Unity Catalog governance standards: catalogs, schemas, tables, volumes, external locations, storage credentials, service credentials, grants, tags, lineage, row filters, and column masks."
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Unity Catalog Governance

Use this skill when creating or modifying governed Databricks assets, permissions, data access, external locations, storage credentials, service credentials, row filters, column masks, governed tags, shares, or lineage.

## Required Context

Before changing code or documentation:

1. Read `security-policy`.
2. Read `databricks-governance-policy`.
3. Identify all affected Unity Catalog objects.
4. Identify the principal model: users, groups, service principals, managed identities, or CI/CD identity.

## Execution Rules

- Prefer catalog/schema/table/view/volume grants over broad workspace-level assumptions.
- Do not generate `ALL PRIVILEGES` grants as a default.
- Explicitly justify `MANAGE`, `EXTERNAL USE SCHEMA`, `EXTERNAL USE LOCATION`, `CREATE EXTERNAL TABLE`, `READ FILES`, and `WRITE FILES`.
- Prefer volumes and `READ VOLUME` / `WRITE VOLUME` over direct file privileges.
- Use storage credentials for cloud storage and service credentials for external cloud services.
- Define owner, purpose, allowed principals, and environment scope for each governed object.
- Sensitive data requires classification, tags, masks, row filters, or a written exception.

## Deliverables

- SQL, YAML, Terraform, or documentation changes for the governed assets.
- A grants matrix with principal, object, privilege, and rationale.
- Lineage and data dictionary updates for production datasets.
- Security notes for any privileged or external access.
