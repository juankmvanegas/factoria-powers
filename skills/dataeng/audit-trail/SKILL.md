---
name: dataeng-audit-trail
description: "Complete traceability log — every decision, approval, and change is documented"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Audit Trail

## Purpose

Every important decision, approval, change, and event is recorded. Complete traceability for audits and compliance. Nothing is lost, nothing is forgotten, nothing can be denied.

This skill is auto-activated (`user-invocable: false`). It activates only when key events occur in other skills. It is NOT invoked manually.

---

## Events That Trigger Recording

The audit-trail activates automatically on the following events:

| Event | Code | Trigger |
|-------|------|---------|
| Migration approved | `MIGRATION_APPROVED` | When a migrated module is approved by the user |
| PRP approved | `PRP_APPROVED` | When a PRP (Product Requirements Proposal) is approved |
| ADR created | `ADR_CREATED` | When an Architecture Decision Record is created |
| Logic verified | `LOGIC_VERIFIED` | When verify-logic completes its analysis |
| Smoke test completed | `SMOKE_PASS` / `SMOKE_FAIL` | When smoke-tests finishes (pass or fail) |
| Rollback executed | `ROLLBACK_EXECUTED` / `ROLLBACK_FAILED` | When a rollback is executed |
| Health check executed | `HEALTH_CHECK` | When a health-check is run |
| Breaking change approved | `BREAKING_CHANGE_APPROVED` | When the user approves a breaking change in validate-contracts |
| Breaking change rejected | `BREAKING_CHANGE_REJECTED` | When the user rejects a breaking change |
| Module completed | `MODULE_COMPLETED` | When a module passes all migration phases |
| Auto-shielding error | `AUTO_SHIELDING_ERROR` | When an error prevented by auto-shielding is detected |
| Constraint violated | `CONSTRAINT_VIOLATED` | When an attempt to violate a migration constraint is made |
| Contract validation | `CONTRACTS_VALIDATED` | When validate-contracts completes |
| Dashboard generated | `DASHBOARD_UPDATED` | When the dashboard is updated |

---

## What Is Recorded

For EACH event, an entry is recorded with the following structure:

### Individual Entry Format

Append to `.cloud/audit/audit-trail.md`:

```markdown
---

## [YYYY-MM-DD HH:MM] — [Event Type]

| Field | Value |
|-------|-------|
| **Event** | [EVENT_CODE] |
| **Module** | [Name of the module, feature, or component affected] |
| **Action** | [Concise description of what was done] |
| **Result** | [APPROVED / REJECTED / COMPLETED / FAILED / PARTIAL] |
| **Decider** | [User who approved/rejected, or "System" if automatic] |
| **Evidence** | [Path to evidence file: logic report, smoke test, health check, etc.] |
| **Context** | [Additional relevant information: coverage percentage, score, breaking changes, etc.] |
| **Notes** | [Additional observations, decision reasons, etc.] |
```

---

## Audit Summary

In addition to the detailed trail, maintain an updated summary in `.cloud/audit/audit-summary.md`.

---

## Strict Rules

1. **NEVER omit a record** — every key event MUST be recorded, no exceptions
2. **NEVER modify past entries** — the audit trail is append-only, immutable
3. **ALWAYS include reference to evidence** — link to the real report file
4. **The audit trail survives rollbacks** — the rollback itself is recorded, but previous entries are not deleted
5. **Consistent format** — the table structure MUST be identical across all entries to allow automatic parsing
6. **If the audit file does not exist, create it** with standard headers
7. **Update the summary** every time an entry is added to the trail
8. **Auto-shielding errors are also recorded** — if an error was prevented, document it
9. **Precise timestamps** — use format YYYY-MM-DD HH:MM consistently
10. **Do not record trivial events** — only key events that have project impact
11. **The audit trail is the legal source of truth** — in case of dispute, the audit trail is the reference

---

## Integration with Other Skills

This skill is PASSIVE — it is not invoked directly. Other skills activate it:

| Skill | When it activates audit-trail |
|-------|------------------------------|
| **rollback-plan** | When executing rollback (successful or failed) |
| **smoke-tests** | When completing (pass or fail) |
| **validate-contracts** | When completing validation, when approving/rejecting breaking changes |
| **dashboard** | When generating/updating dashboard |
| **health-check** | When completing health check |
| **verify-logic** | When completing logic verification |
| **migration-execute** | When completing module migration |
| **migration-plan** | When approving migration plan |
| **prp** | When approving PRP |
| **generate-adr** | When creating ADR |
