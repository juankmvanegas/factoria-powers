# /migration-execute

Executes migration for one module at a time.

## What it does
Migrates a single module from the legacy system to the target architecture, then automatically runs tests and updates documentation.

## Prerequisites
- `/migration-discovery` must have been completed and reviewed
- `/migration-plan` must have been completed and **explicitly approved**
- The specific module must be listed in the approved `migration-plan.md`

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator invokes the chain:
   - **migration-agent** — writes the migration code for the specified module
   - **testing-agent** — generates and runs tests automatically
   - **docs-agent** — updates documentation automatically
3. After completion, the team must approve before the next module can be migrated
4. **One module per invocation.** No batch execution.
5. If any gap is found not covered by the plan, the entire chain stops

## Usage
```
/migration-execute [module-name]
```
