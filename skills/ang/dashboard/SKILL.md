---
name: ang-dashboard
description: "Use when generating a status overview or metrics report of the current project state"
---

---
name: dashboard
description: "Progress panel for Angular migrations and large projects"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Dashboard

## Purpose

Show progress status of Angular migrations and large projects.

## Flow

1. Read `.cloud/planning/migration-plan.md` (if it exists)
2. Read `.cloud/planning/logic-verification/` (verifications)
3. Read `.cloud/planning/health-check/` (diagnostics)
4. Read `CHANGELOG.md` (recent activity)

## Output

```
╔══════════════════════════════════════════╗
║        DASHBOARD — {Project}            ║
╠══════════════════════════════════════════╣
║                                          ║
║  MIGRATION                               ║
║  ████████░░░░░░  50% (3/6 modules)       ║
║                                          ║
║  Current module: Notes                   ║
║  Status: In progress                     ║
║                                          ║
║  HEALTH CHECK                            ║
║  Score: 85/100 ⚠️                       ║
║                                          ║
║  LATEST ACTIVITY                         ║
║  - Auth module migrated ✅               ║
║  - Layout module migrated ✅             ║
║  - Notes module in progress...           ║
║                                          ║
╚══════════════════════════════════════════╝
```
