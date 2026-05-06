# /add-feature

Plans and implements a new feature following the PRP workflow.

## What it does
Creates a PRP document, gets approval, then implements the feature across all affected layers with tests and documentation.

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator will first generate a PRP using the **generate-drp** skill (`.ai/skills/generate-drp/SKILL.md`) and the PRP template (`.claude/PRPs/prp-base.md`)
3. Wait for PRP approval before proceeding
4. After approval, the orchestrator delegates to:
   - **execution-agent** — implements the feature following layer order
   - **testing-agent** — generates tests automatically after code is written
   - **docs-agent** — updates documentation after tests pass
5. Follow all policies in `.cloud/policies/`

## Usage
```
/add-feature [feature description]
```
