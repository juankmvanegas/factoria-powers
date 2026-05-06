---
name: python-codebase-analyst
description: "Use when deep analysis of the existing codebase is needed — understanding structure, patterns, or impact of changes"
---

---
name: codebase-analyst
description: "Analyze existing Python codebase for patterns, violations, and technical debt"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Codebase Analyst

## Purpose

Perform a comprehensive analysis of an existing Python codebase to identify architectural patterns, violations, technical debt, test coverage gaps, and improvement opportunities. This is a read-only analysis — no code is modified.

## When to Use

- When onboarding a new project to understand its current state
- Before planning a refactoring effort
- To get a baseline assessment of code quality
- As input for migration planning
- context: fork (read-only)

## Execution Flow — 7 Strict Steps

1. **Project overview** — Scan project root:
   - Framework detection (FastAPI, Django, Flask, etc.)
   - Python version from pyproject.toml or setup.cfg
   - Dependency count and notable libraries
   - Project size (files, lines of code)

2. **Architecture analysis** — Map the code structure:
   - Identify layers (if any) and their boundaries
   - Detect circular dependencies
   - Check for proper separation of concerns
   - Evaluate dependency injection patterns
   - Compare against Clean Architecture principles

3. **Pattern detection** — Identify coding patterns:
   - Design patterns in use (Repository, Factory, Strategy, etc.)
   - Anti-patterns detected (God objects, circular imports, global state)
   - Framework usage patterns (proper or misused)
   - Async patterns (correct await usage, no blocking in async)

4. **Technical debt inventory** — Catalog:
   - TODO/FIXME/HACK comments with locations
   - Deprecated dependency usage
   - Code duplication (similar functions across modules)
   - Overly complex functions (cyclomatic complexity)
   - Missing type hints
   - Unused imports and dead code

5. **Test coverage analysis** — Evaluate testing:
   - Test file count vs source file count
   - Test types present (unit, integration, e2e)
   - Mocking patterns used
   - Missing test coverage areas
   - Test quality (assertions, edge cases)

6. **Security scan** — Quick security review:
   - Hardcoded secrets or credentials
   - SQL injection vectors
   - Unsafe deserialization
   - Missing input validation
   - Known vulnerable dependencies

7. **Generate report** — Output structured analysis to `.cloud/planning/codebase-analysis.md`:
   - Executive summary (1 paragraph)
   - Architecture score (0-100)
   - Findings by category with severity
   - Recommended improvements (prioritized)
   - Estimated effort for key improvements

## Auto-Shielding

- NEVER modify any source code during analysis
- NEVER execute application code (only read and analyze)
- ALWAYS report findings factually with file paths and line numbers
- ALWAYS prioritize findings by impact

## Rules

- This skill is strictly READ-ONLY
- Every finding MUST include the file path and specific location
- Severity levels: Critical, High, Medium, Low, Info
- The report MUST be actionable — each finding has a remediation suggestion
- Do not report style issues that would be caught by ruff — focus on architectural and logical issues
- If the codebase is too large to analyze fully, focus on the most critical paths first
