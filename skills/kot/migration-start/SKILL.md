---
name: kot-migration-start
description: "Start the complete migration workflow"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Migration Start — Begin Migration

## Purpose

Start the complete migration workflow for a legacy Android project to the modern MVVM + Feature Modules + Compose architecture.

## Mandatory Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    MIGRATION WORKFLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   /migration-start                                           │
│        │                                                     │
│        ▼                                                     │
│   /migration-discovery ──────► Team Review                   │
│        │                           │                         │
│        │                           │ ✅ Approved             │
│        ▼                           ▼                         │
│   /migration-plan ───────────► Team Review                   │
│        │                           │                         │
│        │                           │ ✅ Approved             │
│        ▼                           ▼                         │
│   /migration-execute [phase 1]                               │
│        │                                                     │
│        ▼                                                     │
│   /migration-execute [phase 2]                               │
│        │                                                     │
│        ▼                                                     │
│       ...                                                    │
│        │                                                     │
│        ▼                                                     │
│   MIGRATION COMPLETE 🎉                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Rules

1. **NO step can be skipped**
2. Each step requires completion and review before the next
3. Discovery MUST be approved before creating the plan
4. Plan MUST be approved before executing any phase
5. Each phase MUST be completed before starting the next

## How to Use

```bash
# Start migration (equivalent to /migration-discovery)
/migration-start /path/to/legacy/project

# After discovery is approved
/migration-plan

# After plan is approved
/migration-execute phase-0
/migration-execute phase-1
# ... etc
```

## Pre-Migration Checklist

Before starting, verify:
- [ ] Access to legacy repository
- [ ] Understanding of the app's business logic
- [ ] Stakeholder buy-in for the migration
- [ ] Agreed timeline
- [ ] Team assigned

## Output

On start, create:
- `.cloud/planning/` — directory if it doesn't exist
- Record in audit-trail: `MIGRATION_STARTED`
- Automatically execute: `/migration-discovery`
