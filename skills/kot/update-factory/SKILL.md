---
name: kot-update-factory
description: "Update configuration from MCP server"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Update Factory — Sync with MCP

## Purpose

Update the local versions of skills, policies, and ADRs with the latest versions from the central MCP server.

## Process

1. **Call** MCP tool `sync_project(factory: "kot")`
2. **Compare** local versions with server
3. **Show** list of available changes
4. **Ask** the user what to update
5. **Download** and apply updates
6. **Document** changes in CHANGELOG

## sync_project Output

```json
{
  "factory": "kot",
  "total_documents": 45,
  "updated_since": "2024-01-01T00:00:00Z",
  "updated_count": 3,
  "updated_documents": [
    {
      "uri": "factoria://skill/kot/security-scan",
      "name": "security-scan",
      "type": "skill",
      "lastModified": "2024-06-15T10:30:00Z"
    },
    ...
  ]
}
```

## User Interface

```
📥 Updates available from Factoria MCP

| Document | Type | Modified |
|----------|------|----------|
| security-scan | skill | 2024-06-15 |
| testing-policy | policy | 2024-06-10 |
| ADR-015 | adr | 2024-06-08 |

What would you like to update?
  1. Everything
  2. Skills only
  3. Policies only
  4. ADRs only
  5. Select individually
  6. Cancel

> 
```

## Post-Update

1. Run `health-check` to verify compatibility
2. Document in CHANGELOG:
   ```markdown
   ## [Unreleased]
   ### Changed
   - Updated skill security-scan from Factoria MCP
   - Updated testing-policy from Factoria MCP
   ```
3. If there are breaking changes in policies → review existing code

## If the Project is Ejected

```
⚠️ This project is in standalone mode (ejected).

It cannot sync with the MCP server.
To reconnect, re-run the Factoria setup.
```
