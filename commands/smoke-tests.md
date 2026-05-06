# /smoke-tests

Runs smoke tests to verify a migrated module works end-to-end.

## What it does
Executes basic functionality tests on a recently migrated module to confirm it starts, responds, and handles basic scenarios.

## Instructions
1. Identify the migrated module's endpoints or entry points
2. Build the project to verify compilation
3. Run existing tests for the module
4. Verify DI registration is complete (no missing dependencies)
5. Report pass/fail status for each smoke test

## Usage
```
/smoke-tests [module name]
```
