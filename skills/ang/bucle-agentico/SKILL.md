---
name: ang-bucle-agentico
description: "Use when an approved PRP exists and complex implementation should proceed phase by phase with just-in-time context mapping"
---

---
name: bucle-agentico
description: "Execute complex Angular features by BLUEPRINT phases"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Agentic Loop

## Purpose

Implement complex features phase by phase using the BLUEPRINT methodology.

## Prerequisites

- Approved PRP with defined phases

## Flow per Phase

For EACH phase of the PRP:

### 1. MAP (Context Mapping)
- Read ONLY the files relevant to this phase
- Identify dependencies, existing patterns, code to reuse

### 2. GENERATE (Generate Phase Plan)
- Define files to create/modify
- Define execution order

### 3. EXECUTE (Execute)
- Implement following execution order: Application → Infrastructure → Presentation
- Inline templates, strict types, abstract classes for DI

### 4. VALIDATE (Validate)
- `ng build` without errors
- `ng lint` without warnings
- Phase tests pass

## Auto-chaining

Upon completing ALL phases:
1. Invoke `/generate-tests` for complete tests
2. Invoke `/documentacion` for CHANGELOG and docs

## Auto-Shielding

If there are errors:
1. Capture complete error
2. Fix and re-verify
3. Maximum 3 attempts per phase before escalating

## Rules

- NEVER skip phases
- ALWAYS map real context before each phase
- ALWAYS validate at the end of each phase
