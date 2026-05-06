---
name: ang-audit-trail
description: "Use when audit logging for operations needs to be reviewed or generated for compliance tracking"
---

---
name: audit-trail
description: "Append-only traceability log for decisions and approvals"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Audit Trail

## Purpose

Record every decision, approval, and significant change in an append-only log.

## Activates automatically after

- Migration approvals
- ADR creation
- Rollbacks
- Logic verifications
- Health checks
- Architecture changes

## Format

File: `.cloud/audit/audit-trail.md`

```markdown
# Audit Trail — {Project}

## [YYYY-MM-DD HH:MM] {Type}
- **Action**: {description}
- **Result**: {approved/rejected/completed}
- **Files**: {list}
- **Approved by**: {user/system}
```

## Entry Types

| Type | Trigger |
|------|---------|
| MIGRATION_APPROVAL | Module approved for migration |
| ADR_CREATED | New ADR generated |
| LOGIC_VERIFIED | Logic verification completed |
| ROLLBACK | Rollback executed |
| HEALTH_CHECK | Diagnostic executed |
| MODULE_COMPLETED | Migration module completed |

## Rules

- NEVER edit existing entries — APPEND only
- ALWAYS include timestamp
- ALWAYS include result
