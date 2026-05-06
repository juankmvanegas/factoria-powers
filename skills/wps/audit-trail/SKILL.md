---
name: wps-audit-trail
description: "Complete traceability log for every decision, approval, and code change"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Audit Trail

## Purpose

Maintain a complete traceability log that records every architectural decision, code change, approval, and rejection throughout the project lifecycle. This skill ensures full accountability by linking changes to their rationale, ADRs, policies, and the agent or user who authorized them. The audit trail serves as the single source of truth for project history.

## Execution Flow — 5 Strict Steps

### Step 1 — Identify Change Context

- Determine the type of event: `decision`, `code-change`, `approval`, `rejection`, `rollback`, `config-change`.
- Collect metadata: timestamp (ISO 8601), author/agent, affected files, related ADR/policy IDs.
- Read existing audit log at `.cloud/audit/audit-trail.md` (create if missing).

### Step 2 — Format Audit Entry

- Use the standard entry format:
  ```
  ## [YYYY-MM-DDTHH:MM:SS] — {EVENT_TYPE}
  - **Author:** {agent or user}
  - **Scope:** {files or components affected}
  - **Related:** {ADR-NNN, policy name, or "N/A"}
  - **Summary:** {one-line description}
  - **Detail:** {expanded rationale if needed}
  - **Status:** {applied | pending | reverted}
  ```

### Step 3 — Append to Audit Log

- Append the new entry at the top of `.cloud/audit/audit-trail.md` (newest first).
- Preserve all existing entries — never overwrite or truncate.

### Step 4 — Cross-Reference

- If the change relates to an ADR, add a back-reference comment in the ADR file: `<!-- Audit: YYYY-MM-DDTHH:MM:SS -->`.
- If the change modifies a block or component, note the audit entry timestamp in the CHANGELOG.

### Step 5 — Verify Integrity

- Count total entries in the audit log and confirm the new entry is present.
- Validate that no entries were lost or reordered.
- Report the total entry count and last 3 entries as confirmation.

## Rules

- NEVER delete or modify existing audit entries — the log is append-only.
- ALWAYS include a timestamp in ISO 8601 format.
- ALWAYS link to the relevant ADR or policy when one exists.
- NEVER log sensitive credentials, tokens, or secrets in the audit trail.
- ALWAYS create the `.cloud/audit/` directory and `audit-trail.md` file if they do not exist.
- NEVER skip logging for automated or agent-initiated changes — all changes are auditable.
