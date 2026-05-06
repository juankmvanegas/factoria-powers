---
name: nest-audit-trail
description: "Use when audit logging for operations needs to be reviewed or generated for compliance tracking"
---

---
name: audit-trail
description: "Record traceability for approvals, ADRs, rollbacks, and verifications"
allowed-tools: Read, Write, Edit
user-invocable: false
---

# Skill: Audit Trail

## Activates When

After approvals, ADR creation, rollbacks, migration steps, or compliance verifications.

## Responsibilities

1. Record event in `.cloud/audit/audit-log.md`
2. Include: timestamp, event type, description, decision made, user confirmation
3. Track: migration progress, ADR approvals, rollback executions, compliance checks

## Format

```markdown
### [YYYY-MM-DD HH:mm] — [Event Type]
- **Action**: What was done
- **Result**: Success/Failure
- **Decision**: What was decided
- **Approved by**: User confirmation reference
```

## Rules

- Auto-activated — no user invocation needed
- NEVER skip audit entries, even for minor decisions
- Append only — NEVER delete or modify existing entries
