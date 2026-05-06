---
name: nest-calidad
description: "Use when code quality needs to be checked — linting, conventions, patterns, and coding standards compliance"
---

---
name: calidad
description: "Quality gates for testing and code quality"
allowed-tools: Read, Grep, Glob, Bash
user-invocable: false
---

# Skill: Calidad

## Activates When

Tests, validation, or quality checks are needed after code changes.

## Quality Gates

1. **ESLint**: `npm run lint` must pass with zero errors
2. **Tests**: `npm test` must pass with zero failures
3. **Coverage**: `npm run test:cov` must report >= 90%
4. **Build**: `npm run build` must compile without errors
5. **SonarCloud**: Quality gate must pass (if configured)
6. **Complexity**: Cyclomatic complexity < 10 per function

## Rules

- Auto-activated after test generation
- BLOCK delivery if any gate fails
- Report specific failures with file and line references
