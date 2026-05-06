# ADR-003: uv as Package Manager

## Status
Accepted

## Date
2025-06-01

## Context
Python's packaging ecosystem offers multiple tools (pip, pip-tools, poetry, pdm, hatch) with varying levels of performance, reliability, and feature completeness. We need a standardized package management approach that provides fast dependency resolution, deterministic builds, and a single source of truth for project metadata.

## Decision
We adopt **uv** as the package manager for all Factoria-Python projects.

Key aspects of this decision:

- **`pyproject.toml`** is the single source of truth for all project metadata, dependencies, and tool configuration (PEP 621 compliant)
- **`uv.lock`** provides deterministic, reproducible builds with exact version pinning and hash verification
- **No `requirements.txt`** for dependency management — only generated when needed for compatibility (e.g., Docker builds, legacy systems)
- **Virtual environment management** via `uv venv` and `uv sync`
- **Dependency groups** for organizing dev, test, and production dependencies

```toml
# pyproject.toml
[project]
name = "my-service"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "sqlalchemy[asyncio]>=2.0",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = ["ruff", "mypy", "pytest", "pytest-asyncio", "httpx"]
```

Standard commands:
- `uv sync` — Install all dependencies from lock file
- `uv add <package>` — Add a dependency
- `uv remove <package>` — Remove a dependency
- `uv lock` — Update lock file
- `uv run <command>` — Run a command in the project environment

## Consequences
### Positive
- 10-100x faster than pip for dependency resolution and installation
- Deterministic builds via `uv.lock` (exact versions + hashes)
- Single tool replaces pip, pip-tools, virtualenv, and parts of poetry
- Written in Rust — minimal installation footprint, no Python bootstrap needed
- Supports PEP 621 standard (`pyproject.toml`) without proprietary extensions

### Negative
- Relatively new tool — ecosystem is still maturing
- Team members need to learn `uv` commands (migration from pip/poetry)
- Some CI/CD environments may not have `uv` pre-installed (requires installation step)

### Neutral
- `uv.lock` must be committed to version control (similar to `package-lock.json` in Node.js)
- Compatible with pip — `uv pip install` works as a drop-in replacement when needed
