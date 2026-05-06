# /migration-plan

Generates a full migration plan from discovery output.

## What it does
Analyzes the discovery results, identifies technology gaps, generates ADRs for each technology change, and produces a comprehensive migration plan.

## Prerequisites
- `/migration-discovery` must have been completed
- Team must have reviewed `.cloud/planning/legacy-discovery/` files

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator invokes the **architecture-agent** (`.ai/agents/architecture-agent.md`) which:
   - Performs technology gap analysis
   - Presents gaps to the team for confirmation (interactive checkpoint)
   - Generates ADRs for each confirmed technology change
3. After ADR generation, the orchestrator produces `.cloud/planning/migration-plan.md`
4. The migration plan must be **explicitly approved** by the team before execution
5. No execution happens without approval

## Usage
```
/migration-plan
```
