# /eject-factory

Removes Factoria framework files from the project, leaving only the generated code.

## What it does
Cleans up all Factoria-specific files (.claude/, .ai/, CLAUDE.md) while preserving the project code, tests, and architecture docs.

## Instructions
1. Confirm with the user that they want to eject
2. List all Factoria-specific files that will be removed
3. Preserve: source code, tests, .cloud/ docs, CHANGELOG
4. Remove: .claude/skills/, .claude/commands/, .ai/agents/, CLAUDE.md
5. Verify the project still builds after ejection

## Usage
```
/eject-factory
```
