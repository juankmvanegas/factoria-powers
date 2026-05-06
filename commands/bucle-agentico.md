# /bucle-agentico

Implements complex features through structured BLUEPRINT phases.

## What it does
Breaks down a complex feature into sequential phases, implementing each one with full validation before proceeding to the next.

## Instructions
1. Receive the approved PRP/DRP as input
2. Break the feature into BLUEPRINT phases (plan, scaffold, implement, test, document)
3. Execute each phase sequentially with validation gates
4. Run the automatic chain after each phase: verify-logic → generate-tests → documentacion
5. Report progress after each phase completion

## Usage
```
/bucle-agentico [feature name or PRP reference]
```
