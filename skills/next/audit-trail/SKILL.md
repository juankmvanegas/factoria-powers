---
name: next-audit-trail
description: "Use when audit logging for operations needs to be reviewed or generated for compliance tracking"
---

---
name: audit-trail
description: "Complete traceability log — every decision, approval, and change is documented"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Skill: Audit Trail (Auto-Activated)

## Purpose

Maintain a complete, append-only traceability log of every significant decision, approval, rollback, and change in the project. Enables compliance auditing, rollback decisions, and provenance verification. Every entry links back to its authoritative source.

## Activates automatically when

- After approvals (PRP approval, migration step approval)
- After ADR creation or modification
- After rollback execution
- After logic verification (`verify-logic`) completes
- After migration steps complete
- After security scan findings are resolved
- After factory ejection or update

## Does NOT activate when

- Routine code changes without decisions (handled by `documentacion`)
- Test-only changes
- Documentation-only changes
- Formatting or linting fixes

## Log Location

`.cloud/audit/audit-trail.md` — append-only file. Entries are NEVER deleted or modified.

## Entry Format

```markdown
## [{YYYY-MM-DD HH:mm}] {Action Type}

- **What changed**: {description of the change}
- **Who approved**: {user / auto-approved by skill}
- **Source**: {policy / ADR / skill / user-input}
- **Reference**: {document name or URI}
- **Files affected**:
  - `path/to/file1.ts` — created
  - `path/to/file2.ts` — modified
  - `path/to/file3.ts` — deleted
- **Provenance**: [{claim}]: source=[{type}], reference=[{document}]
```

## Action Types

| Type | When logged |
|------|-------------|
| `PRP-APPROVED` | User approves a Product Requirements Proposal |
| `ADR-CREATED` | New Architecture Decision Record created |
| `ADR-SUPERSEDED` | Existing ADR replaced by a new one |
| `MIGRATION-STEP` | Migration module completed and approved |
| `ROLLBACK-EXECUTED` | Rollback plan was triggered |
| `LOGIC-VERIFIED` | Business logic verification completed |
| `SECURITY-RESOLVED` | Security scan finding was fixed |
| `CONTRACT-VALIDATED` | API contract validation passed or failed |
| `FACTORY-UPDATED` | Factoria files updated to new version |
| `FACTORY-EJECTED` | Factoria removed from project |
| `SKILL-CREATED` | New custom skill added |
| `COMPLIANCE-CHECK` | Policy compliance verification completed |

## Example Entries

```markdown
## [2026-04-05 14:30] MIGRATION-STEP

- **What changed**: Migrated module "notes" from legacy Express to Next.js App Router
- **Who approved**: user (explicit approval after verify-logic)
- **Source**: skill
- **Reference**: migration-execute
- **Files affected**:
  - `app/api/notes/route.ts` — created
  - `src/application/use-cases/notes.use-case.ts` — created
  - `src/infrastructure/adapters/notes.adapter.ts` — created
- **Provenance**: [Used App Router for API]: source=ADR, reference=ADR-002-nextjs-app-router

---

## [2026-04-05 14:35] LOGIC-VERIFIED

- **What changed**: Verified notes module business logic against legacy
- **Who approved**: auto-approved (all checks passed)
- **Source**: skill
- **Reference**: verify-logic
- **Files affected**:
  - `src/application/use-cases/notes.use-case.ts` — verified
- **Provenance**: [Logic matches legacy]: source=skill, reference=verify-logic
```

## Provenance Format

Every audit entry MUST include provenance linking the action to its authoritative source:

```
[claim]: source=[policy/ADR/skill/user-input], reference=[document name]
```

Examples:
- `[Used Server Components by default]: source=ADR, reference=ADR-003-server-components-first`
- `[Applied security headers]: source=policy, reference=security-policy`
- `[Chose Zod over Yup]: source=user-input, reference=orchestrate-interview`

## Rules

- NEVER delete or modify existing audit entries — append only
- ALWAYS include timestamp, source, and provenance
- ALWAYS list affected files with their action (created/modified/deleted)
- NEVER log trivial changes (formatting, comments) — only decisions and approvals
- ALWAYS create the audit file if it does not exist: `.cloud/audit/audit-trail.md`
- Entries are written in Spanish for descriptions, English for technical references
- If the audit file grows beyond 500 entries, archive older entries to `.cloud/audit/archive/audit-trail-{year}.md`
