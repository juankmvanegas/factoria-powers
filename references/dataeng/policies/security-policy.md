# Security Policy

These rules are mandatory for every Data Engineering project generated or modified by Factoria-DataEng. They are based on the Azure Databricks Agent Skill security references for Unity Catalog, service principals, secrets, workload identity federation, audit logs, secure networking, governed tags, row filters, column masks, and Databricks CLI/API authentication.

## Identity and Automation

- Use Microsoft Entra ID users, groups, managed identities, service principals, or workload identity federation for automation.
- Personal access tokens are not allowed for CI/CD, production jobs, or long-lived automation.
- Service principals must have explicit workspace, catalog, schema, table, volume, job, and pipeline permissions.
- Group-based access is preferred over direct user grants.
- SCIM or approved identity synchronization must be used when enterprise identity lifecycle is in scope.

## Unity Catalog Governance

- Unity Catalog is mandatory for governed datasets, volumes, external locations, shares, row filters, column masks, tags, lineage, and access control.
- Do not bypass Unity Catalog with direct cloud storage paths from pipeline code.
- Catalogs, schemas, tables, views, volumes, connections, storage credentials, service credentials, and external locations must have explicit owners.
- `ALL PRIVILEGES` is not acceptable as a default grant. Grant only the minimum required privileges.
- `EXTERNAL USE SCHEMA`, `EXTERNAL USE LOCATION`, and `MANAGE` require explicit approval because they can enable data exfiltration or privilege escalation.
- Prefer Unity Catalog volumes with `READ VOLUME` and `WRITE VOLUME` over direct `READ FILES` and `WRITE FILES` on external locations.

## Secrets and Credentials

- Never hardcode passwords, tokens, API keys, connection strings, storage keys, workspace IDs, catalog names, or service principal secrets.
- Storage access must use Unity Catalog storage credentials, managed identities, or approved external locations.
- External cloud service access should use Unity Catalog service credentials when available.
- Databricks secrets can be used only for approved legacy or transitional cases and must never appear in logs, notebooks, bundle variables, or committed files.
- Pipeline code must reference secret names or credential objects, never secret values.

## Data Protection

- Sensitive data requires classification, governed tags, masking, row filters, or column-level controls when exposed to broader audiences.
- Logs, metrics, failed records, checkpoints, and quarantine tables must not leak PII, credentials, tokens, or restricted business data.
- Dashboard, AI/BI, SQL warehouse, and sharing permissions must follow least privilege.
- Delta Sharing, external data access, clean rooms, and external clients require explicit security review.

## Compute and Network Security

- Production workloads must use approved compute policies.
- No-isolation shared clusters are not allowed for governed production data.
- User isolation, dedicated compute, Lakeguard, or fine-grained access control must be used when the workload requires protected data access.
- Workspace ingress, egress, Private Link, IP access lists, network policies, and storage firewall constraints must be documented when relevant.

## Auditability

- Audit log delivery or system-table access must be available for production workspaces.
- Security-sensitive changes must be traceable: grants, ownership changes, external locations, service credentials, storage credentials, jobs, pipelines, and shares.
- The final delivery must identify any missing security evidence or permissions that require platform-owner action.
