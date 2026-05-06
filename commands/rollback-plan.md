# /rollback-plan

Creates a rollback plan before critical changes and can execute it if needed.

## What it does
Snapshots the current state before a risky change and generates a step-by-step reversal plan.

## Instructions
1. Identify the files and state that will be changed
2. Create a snapshot (git stash or branch) of the current state
3. Document the rollback steps in `.cloud/planning/rollback-{name}.md`
4. If rollback is requested, execute the reversal steps
5. Verify the project builds and tests pass after rollback

## Usage
```
/rollback-plan [change description]
```
