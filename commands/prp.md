# /prp

Plans a feature with PRP + DRP documents before implementation.

## What it does
Creates a structured planning document that defines requirements, scope, and design decisions for a feature before any code is written.

## Instructions
1. Interview the user about the feature requirements
2. Generate a PRP document using the template in `.claude/PRPs/prp-base.md`
3. Include scope, acceptance criteria, affected layers, and dependencies
4. Generate a DRP with technical design decisions
5. Wait for explicit user approval before any implementation begins

## Usage
```
/prp [feature description]
```
