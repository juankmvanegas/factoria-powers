---
name: python-new-project
description: "Use when initializing a brand-new project from scratch following the factory template"
---

---
name: new-project
description: "Scaffold new Python/FastAPI project or onboard existing one with Factoria conventions"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Bootstrap a new Python/FastAPI project from scratch or adopt an existing Python project into the Factoria ecosystem with Clean Architecture, testing infrastructure, and governance files.

## When to Use

- Starting a brand-new Python/FastAPI microservice
- Onboarding an existing Python project into Factoria conventions
- Usage: `/new-project [ServiceName] [InitType: REST|CLI|Worker|Scheduler]`

## Execution Flow — 12 Strict Steps

### Scenario A: Empty Folder (Full Scaffold)

1. **Create root structure** — `pyproject.toml` with project metadata, dependencies (fastapi, uvicorn, pydantic), dev dependencies (pytest, pytest-asyncio, httpx, ruff, mypy, import-linter), scripts section
2. **Create src/ package** — `src/{service_name}/` with `__init__.py`
3. **Create domain layer** — `src/{service_name}/domain/` with `entities/`, `ports/`, `exceptions.py`, `__init__.py`
4. **Create application layer** — `src/{service_name}/application/` with `use_cases/`, `dtos/`, `__init__.py`
5. **Create infrastructure layer** — `src/{service_name}/infrastructure/` with `adapters/`, `persistence/`, `config/`, `__init__.py`
6. **Create API layer** — `src/{service_name}/api/` with `routers/`, `schemas/`, `dependencies.py`, `__init__.py`
7. **Create entry point** — `src/{service_name}/main.py` with FastAPI app factory, CORS, health endpoint
8. **Create test structure** — `tests/` with `unit/`, `integration/`, `architecture/`, `conftest.py`
9. **Create architecture tests** — `tests/architecture/test_layer_dependencies.py` validating import rules
10. **Configure import-linter** — `.importlinter` config enforcing domain independence and layer contracts
11. **Create .cloud/ governance** — Copy policies, ADRs structure from Factoria-Python templates
12. **Create .claude/ and .ai/** — CLAUDE.md project config, agent references, skill references

### Scenario B: Existing Project (Onboarding)

1. **Detect project type** — Scan for `pyproject.toml`, `setup.py`, `requirements.txt`, `manage.py`, `app.py`
2. **Analyze current structure** — Map existing modules, identify framework (FastAPI, Flask, Django, plain Python)
3. **Create .cloud/ governance** — Add policies, ADRs adapted to current stack
4. **Create .claude/ config** — CLAUDE.md with project-specific settings
5. **Create .ai/ agents** — Agent definitions for the project
6. **Generate compliance report** — List deviations from Factoria standards with remediation plan

## Auto-Shielding

- NEVER overwrite existing `pyproject.toml` without user confirmation
- NEVER delete existing source code during onboarding
- ALWAYS verify Python version compatibility (3.11+)
- ALWAYS run `ruff check` after scaffold to verify no lint errors

## Rules

- Domain layer MUST have zero framework imports (no fastapi, no sqlalchemy)
- All async code MUST use native `async/await` (no threading for I/O)
- Entry point MUST use app factory pattern (`create_app()`)
- Test conftest MUST include async fixtures with `pytest-asyncio`
- Import-linter contracts MUST be configured before first commit
- pyproject.toml MUST use `[project]` table (PEP 621), not `[tool.poetry]`
