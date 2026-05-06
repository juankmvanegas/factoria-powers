---
name: python-audit-trail
description: "Use when audit logging for operations needs to be reviewed or generated for compliance tracking"
---

---
name: audit-trail
description: "Auto-skill for tracking decisions, approvals, and changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Audit Trail (Auto-Activated)

## Activation Trigger

This skill activates automatically for every session, recording all significant actions and decisions.

## Purpose

Maintain a complete audit trail of all architectural decisions, approval gates, file modifications, and session activities in `.cloud/audit/`.

## Recording Rules

### 1. Architectural Decisions

Record every architectural decision with:
- **What**: The decision made
- **Why**: The rationale or driving requirement
- **Source**: Which ADR, policy, or user instruction informed the decision
- **Alternatives**: What other options were considered (if discussed)
- **Impact**: Which modules/layers are affected

Format in `.cloud/audit/decisions.log`:
```
[YYYY-MM-DD HH:mm] DECISION: {description}
  Source: {ADR-NNN | policy | user instruction}
  Rationale: {why this choice}
  Impact: {affected modules}
```

### 2. Approval Gates

Record every approval gate crossed:
- **Gate**: Which quality or compliance gate
- **Status**: Pass / Fail / Skipped (with reason)
- **Details**: What was checked, any findings

Gates tracked:
- Architecture compliance (import-linter)
- Security scan results
- Quality gates (ruff, mypy, pytest)
- Policy compliance validation
- User approval for destructive operations

Format in `.cloud/audit/gates.log`:
```
[YYYY-MM-DD HH:mm] GATE: {gate_name} — {PASS|FAIL}
  Checked: {what was validated}
  Findings: {details or "none"}
```

### 3. File Changes

Record every file created or modified with:
- **File**: Full path
- **Action**: Created / Modified / Deleted
- **Reason**: Why the change was made
- **Related**: Which feature, bug fix, or task

Format in `.cloud/audit/changes.log`:
```
[YYYY-MM-DD HH:mm] {CREATE|MODIFY|DELETE}: {file_path}
  Reason: {why}
  Related: {feature/task reference}
```

### 4. Session Timeline

Maintain a session-level timeline in `.cloud/audit/sessions/`:
- One file per session: `session-{YYYY-MM-DD-HHmm}.md`
- Records the overall flow of work
- Captures user requests and agent responses at a high level
- Links to specific decisions, gates, and changes

Format:
```markdown
# Session {YYYY-MM-DD HH:mm}

## Objective
{What the user wanted to accomplish}

## Timeline
- [HH:mm] Started — {initial context}
- [HH:mm] Decision — {what was decided}
- [HH:mm] Gate — {gate result}
- [HH:mm] Created — {file}
- [HH:mm] Completed — {summary}

## Summary
{Brief description of what was accomplished}

## Files Changed
- {list of files}
```

### Directory Structure

```
.cloud/audit/
  decisions.log      — Architectural decisions (append-only)
  gates.log          — Approval gate results (append-only)
  changes.log        — File change tracking (append-only)
  sessions/          — Per-session timelines
    session-2026-04-05-1030.md
    session-2026-04-05-1415.md
```

### Rules

- Audit logs are **append-only** — NEVER modify or delete existing entries
- EVERY significant action MUST be recorded — no silent changes
- Timestamps MUST be in ISO 8601 format
- Keep entries concise but complete enough for traceability
- If `.cloud/audit/` directory does not exist, create it
- Audit trail recording MUST NOT block or slow down the primary task

## Auto-Shielding

This skill operates silently in the background. It MUST:
1. Record all qualifying events without being asked
2. NEVER skip recording due to time pressure
3. NEVER modify historical entries
4. Create the audit directory structure if it does not exist
