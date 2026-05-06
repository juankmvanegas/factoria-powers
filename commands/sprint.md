# /sprint

Executes a quick task (bug fix, small adjustment) without formal PRP planning.

## What it does
Directly implements a small change following all policies and standards, then runs the automatic chain.

## Instructions
1. Understand the task from the user's description
2. Identify affected files and layers
3. Implement the change following all `.cloud/policies/`
4. Run the automatic chain: security-scan → verify-logic → generate-tests → documentacion
5. Report what was changed and tested

## Usage
```
/sprint [task description]
```
