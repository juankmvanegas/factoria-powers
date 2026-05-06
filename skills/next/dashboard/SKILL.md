---
name: next-dashboard
description: "Use when generating a status overview or metrics report of the current project state"
---

---
name: dashboard
description: "Progress panel for migrations and large projects"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Dashboard

## Purpose

Show a comprehensive progress panel for migrations, large features, and project health. Reads planning files, counts completed vs pending modules, displays test status, and calculates architecture compliance score.

## Execution Flow — 5 Steps

### Step 1: Read Planning Files

Scan `.cloud/planning/` for:
- `migration-plan.md` — module list and status
- `legacy-discovery/` — extracted contracts
- `prp-*.md` — active PRPs with completion status

### Step 2: Count Module Progress

For each module in the migration plan:
- **Completed**: code migrated + tests passing + docs updated
- **In progress**: code exists but tests incomplete or docs missing
- **Pending**: not yet started
- **Blocked**: dependencies not met or approval pending

### Step 3: Test Status

Run or read last results of:
```bash
npm test -- --watchAll=false --coverage 2>/dev/null || echo "No test results"
```

Extract: total tests, passing, failing, coverage percentage.

### Step 4: Architecture Compliance Score

Check adherence to ADRs and policies:
- Layer separation respected (no cross-layer imports)
- Server Components by default (no unnecessary `'use client'`)
- Path aliases used consistently
- Security headers in `next.config.js`
- Environment variables properly handled

Score = (checks passed / total checks) * 100

### Step 5: Render Dashboard

```
Dashboard — {Project Name}
══════════════════════════════════════

Migration Progress:  [████████░░] 80% (8/10 modules)
  ✅ Completed: 8    🔄 In Progress: 1    ⏳ Pending: 1    🚫 Blocked: 0

Test Status:
  Total: 142    ✅ Passing: 138    ❌ Failing: 4    Coverage: 87%

Architecture Compliance: 92/100
  ✅ Layer separation    ✅ Server Components    ⚠️ Path aliases (2 violations)

Active PRPs: 2
  - PRP-feature-auth: 60% complete
  - PRP-feature-dashboard: 30% complete
```

## Rules

- NEVER modify any file — this skill is read-only
- ALWAYS show actual numbers, never estimates
- ALWAYS include the compliance score
- NEVER hide failing tests or violations — transparency is mandatory
- If no planning files exist, show project health only (tests + compliance)
