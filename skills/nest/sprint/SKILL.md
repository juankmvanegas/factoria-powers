---
name: nest-sprint
description: "Use when planning or executing a sprint — multiple features or tasks to be implemented in sequence"
---

---
name: sprint
description: "Quick tasks without planning — bug fixes, adjustments, small changes"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute quick tasks (bug fixes, adjustments, small changes) without requiring a full PRP.

## Execution Flow

1. Understand the task
2. Identify affected layers
3. Execute changes following the layer order (application → infrastructure → api)
4. Auto-chain runs: security-scan → generate-tests → documentacion

## Rules

- Still follows layer execution order
- Still runs auto-chain after changes
- For anything spanning more than 2 modules, use `/prp` + `/bucle-agentico` instead
- NEVER skip testing or security scan even for "small" changes
