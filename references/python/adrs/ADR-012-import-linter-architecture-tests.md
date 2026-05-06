# ADR-012: import-linter for Architecture Test Enforcement

## Status
Accepted

## Date
2025-06-01

## Context
Clean Architecture relies on strict dependency direction rules between layers. Without automated enforcement, developers can accidentally introduce imports that violate layer boundaries, gradually eroding the architecture. Manual code review is insufficient for catching all violations consistently.

## Decision
We adopt **import-linter** to enforce layer boundary contracts through automated architecture tests.

### Contract Configuration

Contracts are defined in `pyproject.toml`:

```toml
[tool.importlinter]
root_package = "app"

[[tool.importlinter.contracts]]
name = "Domain layer has no external dependencies"
type = "forbidden"
source_modules = ["app.domain"]
forbidden_modules = [
    "app.application",
    "app.infrastructure",
    "app.api",
    "sqlalchemy",
    "fastapi",
    "httpx",
    "celery",
    "redis",
]

[[tool.importlinter.contracts]]
name = "Application depends only on Domain"
type = "layers"
layers = ["app.api", "app.infrastructure", "app.application", "app.domain"]

[[tool.importlinter.contracts]]
name = "Infrastructure does not depend on API"
type = "forbidden"
source_modules = ["app.infrastructure"]
forbidden_modules = ["app.api"]
```

### Test Execution

```python
# tests/architecture/test_layer_contracts.py
import subprocess

def test_architecture_contracts():
    result = subprocess.run(
        ["lint-imports"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, f"Architecture violation:\n{result.stdout}"
```

### Critical Rule

**Architecture tests are IMMUTABLE.** When an architecture test fails:

1. Identify the offending import in production code
2. Fix the code to respect the layer boundary
3. NEVER modify the contract to accommodate the violation

New layers or modules may require NEW contracts, but existing contracts are NEVER relaxed.

### CI Integration

Architecture tests run as the FIRST step in the CI/CD pipeline, before linting, type checking, or any other tests. This ensures structural violations are caught immediately with minimal CI cost.

## Consequences
### Positive
- Layer boundary violations are caught automatically in CI
- Provides executable documentation of the system's structural rules
- Prevents architectural erosion over time
- Runs fast (static analysis, no runtime needed)
- Configuration is declarative and easy to understand

### Negative
- Developers must understand why certain imports are forbidden
- Adding new third-party dependencies to Domain layer requires explicit justification
- False positives possible with re-exported modules (requires careful package structure)

### Neutral
- import-linter is a lightweight tool with no runtime dependencies
- Contract definitions serve as architecture documentation
- The approach replaces ArchUnitNET (used in .NET factory) with Python equivalent
