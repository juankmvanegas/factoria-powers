# /verify-logic

Verifies that migrated or refactored code preserves the original business logic.

## What it does
Compares the new implementation against the legacy code to ensure no business logic was lost or altered during migration.

## Instructions
1. Read the legacy source code (provided by user or from discovery docs)
2. Read the new implementation
3. Compare method by method: inputs, outputs, validations, error handling, edge cases
4. Report coverage percentage and any gaps found
5. If coverage < 95%, list specific gaps that need to be addressed

## Usage
```
/verify-logic [module or service name]
```
