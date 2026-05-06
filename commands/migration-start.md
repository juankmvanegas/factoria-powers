# /migration-start

Starts the full migration workflow from a legacy project.

## What it does
Initiates the mandatory 3-step migration process: discovery, planning, and execution. This command kicks off the first step (discovery) and guides through the full workflow.

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator will invoke the **discovery-agent** first
3. After discovery completes, the team must review the output before proceeding
4. The full migration workflow is:
   ```
   /migration-discovery → team review → /migration-plan → team approval → /migration-execute
   ```
5. **No steps can be skipped.** Each step requires completion and review before the next.

## Usage
```
/migration-start [legacy-repo-path]
```

This is equivalent to running `/migration-discovery` as the first step.
