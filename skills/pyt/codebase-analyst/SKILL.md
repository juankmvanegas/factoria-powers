---
name: codebase-analyst
description: "Analyze existing Python/FastAPI codebase — patterns, architecture, dependencies, technical debt"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Codebase Analyst

## Purpose

Analyze an existing Python backend to identify patterns, validate against Clean Architecture rules, detect anti-patterns, technical debt, missing tests, and security issues. Generate a report with actionable recommendations.

## Execution Flow

### Step 1: Structure Scan

1. Identify `main.py`, `pyproject.toml`, `requirements*.txt`, and `src/`
2. Map the folder structure
3. Identify Python and FastAPI versions
4. List declared dependencies
5. Count files by type (`.py`, `.yml`, `.json`, etc.)

### Step 2: Architecture Analysis

Verify adherence to Clean Architecture:

1. **Layer separation**: Are `api`, `application`, `core`, and `infrastructure` explicit?
2. **Inter-layer dependencies**:
   - `core` must not import other layers
   - `application` must only import `core`
   - `api` depends on `application`
   - `infrastructure` implements contracts from `application`
3. **Layer violations**: Search imports that incorrectly cross boundaries
4. **Misplaced logic**: Search for business rules in endpoints or infrastructure adapters

### Step 3: Pattern Analysis

1. **Design patterns used**: repository, ports/adapters, service layer, etc.
2. **Dependency wiring**: Is FastAPI dependency injection coherent?
3. **Error handling**: typed exceptions? centralized handler?
4. **Validation**: Where is validation done? Pydantic? manual rules?
5. **Mapping**: explicit mapping between DTOs and entities?

### Step 4: Technical Debt Analysis

1. **Duplicate code**: Search for repeated patterns
2. **Oversized classes**: >300 lines
3. **Overly long methods**: >50 lines
4. **God classes**: Classes with too many responsibilities
5. **Magic strings/numbers**: Hardcoded values
6. **TODO/HACK/FIXME**: Search for technical debt comments
7. **Dead code**: Unreferenced functions, unused classes
8. **Outdated dependencies**: Packages with old versions

### Step 5: Testing Analysis

1. **Coverage**: Which services have tests? Which don't?
2. **Test quality**: AAA pattern? Correct naming? One behavior per test?
3. **Fixtures and fakes**: Are they simple and understandable?
4. **Integration tests**: Do they exist when external boundaries matter?

### Step 6: Security Analysis

1. **Secrets in code**: Search for hardcoded passwords, API keys, connection strings
2. **SQL injection**: Search for string concatenation in queries
3. **Input validation**: Do all endpoints validate input?
4. **Authentication/authorization**: Is it configured correctly?
5. **CORS**: Appropriate configuration?
6. **Logging**: Is sensitive data being logged?

### Step 7: Report Generation

Generate report in the console (or in a file if the user requests it):

```markdown
# Codebase Analysis: {ProjectName}

**Date**: {date}
**Framework**: .NET {version}
**Projects**: {N}
**.cs files**: {N}

## Overall Score
- Architecture: {1-10}
- Code quality: {1-10}
- Testing: {1-10}
- Security: {1-10}
- **Total**: {average}/10

## Architecture
### Clean Architecture Compliance
{Detailed analysis}

### Violations Found
{List with severity}

## Identified Patterns
{List of patterns in use}

## Technical Debt
### Critical
{Items that must be resolved soon}

### Important
{Items affecting maintainability}

### Minor
{Desirable but not urgent items}

## Testing
- Services with tests: {N}/{total}
- Estimated coverage: {%}
- Test quality: {evaluation}

## Security
{Findings with severity}

## Prioritized Recommendations
1. {Most important recommendation}
2. {Second}
3. {Third}
...

## Suggested Next Step
{What the team should do first}
```

## Rules

- NEVER modify code during analysis — READ ONLY
- NEVER report false positives as certainties — indicate confidence level
- ALWAYS analyze ALL categories, do not skip any
- ALWAYS prioritize recommendations (most impactful first)
- ALWAYS give actionable recommendations, not generic ones
- If the codebase is very large, inform the user and propose analyzing by modules
- Scores must be justified with concrete evidence
