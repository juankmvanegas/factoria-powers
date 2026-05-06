---
name: nest-codebase-analyst
description: "Use when deep analysis of the existing codebase is needed — understanding structure, patterns, or impact of changes"
---

---
name: codebase-analyst
description: "Analyze existing NestJS BFF code for architecture compliance and patterns"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Codebase Analyst

## Purpose

Analyze an existing NestJS BFF codebase to understand its structure, detect patterns, assess compliance with Factoria standards, and identify issues.

## Execution Flow

### Step 1: Structure Scan

1. Scan `src/` for the 3-layer structure (`api/`, `infrastructure/`, `application/`)
2. Scan `libs/` for shared utilities (config, tracer, errors)
3. Scan `test/` for test structure
4. Read `package.json` for dependencies

### Step 2: Architecture Compliance

1. Verify 3-layer separation (no cross-layer imports that violate rules)
2. Check that controllers only inject application services
3. Check that application has no imports from api or infrastructure
4. Verify module registration patterns

### Step 3: Code Quality

1. Check for `any` types, `console.log`, commented-out code
2. Verify class-validator usage in DTOs
3. Check Swagger decorator coverage on controllers
4. Verify custom exception usage (no raw `throw new Error()`)

### Step 4: Test Coverage

1. Scan test files and compare against services
2. Identify untested services
3. Check AAA pattern compliance

### Step 5: Report

Generate a structured report with findings, issues, and recommendations.

## Rules

- Read-only analysis — NEVER modify code
- Report ALL findings, even minor ones
- Flag business logic in the BFF as a CRITICAL violation
