---
name: ang-calidad
description: "Use when code quality needs to be checked — linting, conventions, patterns, and coding standards compliance"
---

---
name: calidad
description: "Auto-skill for Angular tests, validation, and quality gates"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Quality (Auto-Activated)

## Activates when

- Tests are written or modified
- Validations are executed
- Quality gates are verified

## What it does

### Testing
- AAA pattern mandatory
- Naming: `should [behavior] when [scenario]`
- ng-mocks for mocking
- Jasmine spies for verifying calls
- One behavior per test

### Validation
- `ng build --configuration production` without errors
- `ng lint` without warnings
- `ng test --watch=false` all pass

### Quality Gates
- Services: 100% with tests
- Guards/Interceptors: 100% with tests
- Build: successful
- Lint: clean

## Rules

- NEVER deliver code without tests
- NEVER ignore lint warnings
- ALWAYS run production build to validate

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/testing-policy.md`** — Testing policy (absolute priority)
- **`.cloud/policies/coding-standards.md`** — Code standards (naming, structure)

In case of any doubt or conflict between this skill and the policies, **policies win**.
