# ADR-002: Python 3.12+ as Target Runtime

## Status
Accepted

## Date
2025-06-01

## Context
Choosing a Python version impacts the language features available, performance characteristics, library compatibility, and long-term support timeline. We need to standardize on a minimum Python version that provides modern language features while maintaining broad ecosystem support.

## Decision
We adopt **Python 3.12+** as the minimum target runtime for all Factoria-Pyt projects.

Key features that justify this choice:

- **Improved error messages** — More descriptive tracebacks and suggestion hints for common mistakes
- **`type` statement** — Native type alias syntax (`type Vector = list[float]`) for cleaner type definitions
- **`tomllib` in stdlib** — Native TOML parsing without third-party dependencies (useful for `pyproject.toml` reading)
- **PEP 684: Per-interpreter GIL** — Foundation for true parallelism in sub-interpreters, improved performance for concurrent workloads
- **Pattern matching** (available since 3.10) — `match/case` for complex branching logic in domain services
- **Exception groups** (available since 3.11) — `ExceptionGroup` and `except*` for handling multiple errors simultaneously
- **Union syntax** (available since 3.10) — `str | None` instead of `Optional[str]`
- **Built-in generic syntax** (available since 3.9) — `list[int]` instead of `List[int]`
- **Performance** — Significant speed improvements across Python 3.11 and 3.12 (up to 25% faster than 3.10)

All Docker images, CI runners, and development environments MUST use Python 3.12 or later.

## Consequences
### Positive
- Access to the latest language features simplifies code and improves readability
- Performance improvements benefit all services without code changes
- Long-term support: Python 3.12 is supported until October 2028
- Modern type syntax reduces boilerplate in type annotations
- `tomllib` eliminates one dependency for configuration parsing

### Negative
- Some legacy libraries may not yet support Python 3.12 (increasingly rare)
- Developers must be familiar with newer Python features (pattern matching, exception groups)
- Cannot deploy to environments locked to older Python versions without upgrading

### Neutral
- Python 3.12 is widely supported by all major cloud providers and container registries
- The choice aligns with the broader industry trend toward modern Python versions
