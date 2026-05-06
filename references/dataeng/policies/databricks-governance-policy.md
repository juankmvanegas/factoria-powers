# Databricks Governance Policy

This policy converts the Azure Databricks Agent Skill governance references into delivery gates for Factoria-DataEng.

## Unity Catalog Objects

- Every governed table, view, materialized view, streaming table, function, model, volume, connection, external location, storage credential, service credential, share, recipient, and provider must be represented as a Unity Catalog object or explicitly justified.
- Catalog and schema creation must define owner, purpose, workspace binding needs, managed storage decision, and baseline grants.
- External locations must be path-scoped and must not overlap restricted DBFS root or workspace system data.
- Storage credentials and service credentials must have owners, purpose, allowed principals, and rotation/ownership notes.

## Privileges

- Required grants must be listed as least-privilege statements.
- `BROWSE`, `USE CATALOG`, `USE SCHEMA`, `SELECT`, `MODIFY`, `CREATE TABLE`, `CREATE VOLUME`, `READ VOLUME`, and `WRITE VOLUME` must be chosen deliberately.
- `ALL PRIVILEGES` cannot be used as a shortcut in generated code or docs.
- `EXTERNAL USE SCHEMA`, `EXTERNAL USE LOCATION`, `MANAGE`, `CREATE EXTERNAL TABLE`, and `WRITE FILES` require explicit security rationale.

## Data Classification and Fine-Grained Access

- Sensitive datasets must define classification tags or governed tags.
- Row filters and column masks are mandatory when broad audiences need restricted access to sensitive rows or columns.
- Dynamic views are allowed only when they are the appropriate governance mechanism and must document their access assumptions.

## Lineage and Access Evidence

- Production datasets must document upstream sources, transformations, downstream consumers, and owner.
- Use Unity Catalog lineage and system tables as preferred evidence sources.
- If external lineage is needed, document the external metadata object or integration path.
