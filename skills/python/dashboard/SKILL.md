---
name: python-dashboard
description: "Use when generating a status overview or metrics report of the current project state"
---

---
name: dashboard
description: "Progress panel for migrations and large projects showing phases, completion, and blockers"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Dashboard

## Purpose

Display a comprehensive progress panel for ongoing migrations and large project implementations. Shows phase status, completion percentages, blockers, and key metrics at a glance.

## When to Use

- During multi-phase migrations to track overall progress
- When executing a PRP with multiple phases
- To get a quick status overview of the project
- When checking on blocker status

## Execution Flow — 5 Strict Steps

1. **Gather progress data** — Scan project planning files:
   - Read `.cloud/planning/progress-*.md` for active progress trackers
   - Read `.cloud/planning/migration-plan.md` for migration status
   - Read `.claude/PRPs/PRP-*.md` for active PRPs
   - Read latest `.cloud/planning/health-check-*.md` for health score

2. **Calculate metrics** — For each active work stream:
   - Total phases / completed phases → completion percentage
   - Current phase and its status
   - Blocked phases and blocker descriptions
   - Time elapsed since work started
   - Estimated remaining effort

3. **Build dashboard view** — Format as structured text:
   ```
   ===== FACTORIA DASHBOARD =====
   Project: {name}    Health: {score}/100    Date: {today}

   --- Migration Progress ---
   Module 1: User Management    [####------] 40%  IN PROGRESS
   Module 2: Products           [----------]  0%  PENDING
   Module 3: Orders             [----------]  0%  BLOCKED (depends on Module 1)

   --- Active PRPs ---
   PRP-001: Payment Gateway     Phase 2/5    IN PROGRESS

   --- Blockers ---
   ! Module 3 blocked by Module 1 (User entity dependency)

   --- Last Health Check ---
   Architecture: 23/25  Tests: 20/25  Quality: 18/20  Security: 14/15  Docs: 8/10
   =============================
   ```

4. **Identify risks** — Flag:
   - Phases that have been "in progress" for too long
   - Dependencies on blocked items
   - Health score degradation compared to previous check
   - Missing test coverage in completed phases

5. **Provide recommendations** — Based on current state:
   - Next action to take (which phase to work on)
   - Blockers that need resolution
   - Suggested health check if last one is outdated

## Auto-Shielding

- NEVER modify progress data — dashboard is READ-ONLY
- NEVER fabricate progress percentages — calculate from actual phase status
- ALWAYS read the latest files, do not cache stale data
- ALWAYS show blockers prominently

## Rules

- Dashboard is strictly READ-ONLY — it displays, never modifies
- Completion percentage MUST be calculated from actual phase counts
- Blockers MUST be shown with their root cause
- The dashboard MUST be displayable in a terminal (no HTML, no images)
- If no progress data exists, show "No active work streams" and suggest starting a PRP
- Health score from the last check is shown but flagged if older than 7 days
