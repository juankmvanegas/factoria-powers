# /migration-discovery

Extracts all contracts and logic from a legacy project.

## What it does
Reads a legacy codebase and produces a complete discovery report covering database contracts, business logic, API contracts, integrations, and red flags.

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator invokes the **discovery-agent** (`.ai/agents/discovery-agent.md`)
3. The discovery agent reads the entire legacy project and generates 5 files in `.cloud/planning/legacy-discovery/`:
   - `database-contracts.md`
   - `business-logic.md`
   - `api-contracts.md`
   - `integrations.md`
   - `red-flags.md`
4. Each module gets a confidence score (1-10)
5. After completion, the team must review the discovery output before proceeding to `/migration-plan`

## Usage
```
/migration-discovery [legacy-repo-path]
```
