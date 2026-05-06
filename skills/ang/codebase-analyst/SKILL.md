---
name: ang-codebase-analyst
description: "Use when deep analysis of the existing codebase is needed — understanding structure, patterns, or impact of changes"
---

---
name: codebase-analyst
description: "Analyze existing Angular project — patterns, debt, opportunities"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Codebase Analyst

## Purpose

Analyze an Angular project to understand its architecture, patterns, and technical debt.

## Flow

1. Scan folder structure
2. Analyze `angular.json`, `package.json`, `tsconfig.json`
3. Identify patterns used (DI, routing, state management)
4. Evaluate compliance with Clean Architecture 3 layers
5. Detect technical debt (duplicated code, `any` types, etc.)
6. Identify improvement opportunities

## Output

```markdown
# Codebase Analysis: {project}

## Architecture
- Layers found: {N}
- DI pattern: {description}
- Routing: {lazy/eager}

## Strengths
- {list}

## Technical Debt
| Type | Location | Severity | Recommendation |
|------|----------|----------|----------------|

## Opportunities
- {list}

## Metrics
- Components: N
- Services: N
- Tests: N (estimated coverage)
- Dependencies: N
```
