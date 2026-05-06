---
name: kot-audit-trail
description: "Complete traceability record — every decision, approval, and change is documented"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Audit Trail

## Purpose

Every important decision, approval, change, and event is recorded. Full traceability for audits and compliance. Nothing is lost, nothing is forgotten, nothing can be denied.

This skill is auto-activated (`user-invocable: false`). It triggers only when key events occur in other skills. It is NOT invoked manually.

---

## Events That Trigger Recording

The audit-trail activates automatically on the following events:

| Event | Code | Trigger |
|-------|------|---------|
| Migration approved | `MIGRATION_APPROVED` | When a migrated module is approved by the user |
| PRP approved | `PRP_APPROVED` | When a PRP is approved |
| ADR created | `ADR_CREATED` | When an Architecture Decision Record is created |
| Logic verified | `LOGIC_VERIFIED` | When verify-logic completes its analysis |
| Smoke test completed | `SMOKE_PASS` / `SMOKE_FAIL` | When smoke-tests finishes |
| Rollback executed | `ROLLBACK_EXECUTED` / `ROLLBACK_FAILED` | When a rollback is executed |
| Health check executed | `HEALTH_CHECK` | When a health-check runs |
| Breaking change approved | `BREAKING_CHANGE_APPROVED` | When the user approves a breaking change |
| Module completed | `MODULE_COMPLETED` | When a module passes all migration phases |
| Auto-shielding error | `AUTO_SHIELDING_ERROR` | When an error prevented by auto-shielding is detected |
| Contracts validated | `CONTRACTS_VALIDATED` | When validate-contracts completes |
| Dashboard updated | `DASHBOARD_UPDATED` | When the dashboard is updated |

---

## What Gets Recorded

For EACH event, an entry is recorded with the following structure:

### Individual Entry Format

Append to `.cloud/audit/audit-trail.md`:

```markdown
---
## [EVENT_CODE] — [Timestamp ISO 8601]

**Action:** [Brief description of the action]
**Module/Feature:** [Name of the affected module or feature]
**User:** [Who executed/approved]
**Details:**
- [Detail 1]
- [Detail 2]

**Evidence:** [Link to modified file, PR, or commit]
---
```

## Integrity Rules

1. **NEVER** delete entries from the audit trail
2. **NEVER** modify existing entries
3. Only APPEND new entries
4. Each entry includes UTC timestamp
5. File in append-only format
