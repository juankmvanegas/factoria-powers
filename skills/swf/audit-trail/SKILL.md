---
name: swf-audit-trail
description: "Complete traceability log — every decision, approval, and change is documented"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Audit Trail

## Purpose

Every important decision, approval, change, and event is recorded. Complete traceability for audits and compliance. Nothing is lost, nothing is forgotten, nothing can be denied.

This skill is auto-activated (`user-invocable: false`). It activates only when key events occur in other skills. It is NOT invoked manually.

## Events That Trigger Recording

The audit-trail activates automatically on the following events:

| Event | Code | Trigger |
|-------|------|---------|
| Feature added | `FEATURE_ADDED` | When add-feature completes a feature |
| ADR created | `ADR_CREATED` | When an Architecture Decision Record is created |
| Tests generated | `TESTS_GENERATED` | When generate-feature-tests completes |
| Quality gate passed | `QUALITY_GATE_PASS` | When calidad verifies all gates |
| Quality gate failed | `QUALITY_GATE_FAIL` | When calidad detects failures |
| Architecture updated | `ARCHITECTURE_UPDATED` | When update-architecture runs |
| Realm migration executed | `REALM_MIGRATION` | When database migration is performed |
| Security scan completed | `SECURITY_SCAN` | When security validation runs |
| DRP created | `DRP_CREATED` | When a Disaster Recovery Plan is generated |
| Breaking change approved | `BREAKING_CHANGE_APPROVED` | When the user approves a breaking change |
| Breaking change rejected | `BREAKING_CHANGE_REJECTED` | When the user rejects a breaking change |
| Rollback executed | `ROLLBACK_EXECUTED` | When a rollback is performed |
| Auto-shielding error | `AUTO_SHIELDING_ERROR` | When an error prevented by auto-shielding is detected |
| Dashboard generated | `DASHBOARD_UPDATED` | When the dashboard is updated |

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
| **Module** | [Name of the SPM module, feature, or component affected] |
| **Action** | [Concise description of what was done] |
| **Result** | [APPROVED / REJECTED / COMPLETED / FAILED / PARTIAL] |
| **Decider** | [User who approved/rejected, or "System" if automatic] |
| **Evidence** | [Path to evidence file: test report, scan result, etc.] |
| **Context** | [Additional relevant information: coverage %, score, etc.] |
| **Notes** | [Additional observations, decision reasons, etc.] |
```

## Audit Summary

In addition to the detailed trail, maintain an updated summary in `.cloud/audit/audit-summary.md`.

## Auto-Shielding

- **ABORT** if `.cloud/audit/` directory cannot be created or accessed
- **WARN** if the audit trail file exceeds 500 entries — suggest archival

## Rules

1. **NEVER omit a record** — every key event MUST be recorded, no exceptions
2. **NEVER modify past entries** — the audit trail is append-only, immutable
3. **ALWAYS include reference to evidence** — link to the real report file
4. **The audit trail survives rollbacks** — the rollback itself is recorded, but previous entries are not deleted
5. **Consistent format** — the table structure MUST be identical across all entries to allow automatic parsing
