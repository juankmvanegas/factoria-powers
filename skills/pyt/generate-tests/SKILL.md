---
name: pyt-generate-tests
description: "Use when new code has been written and tests need to be generated or a service/component needs full test coverage"
---

---
name: generate-tests
description: "Generate pytest test suites for services, use cases, and endpoints"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate comprehensive pytest test suites for Python/FastAPI projects. Covers unit tests with mocked ports, integration tests with httpx.AsyncClient, and architecture tests validating import-linter contracts.

## When to Use

- After implementing a new feature or use case
- When test coverage is below the required threshold
- To add missing tests for existing code
- To generate architecture validation tests

## Execution Flow â€” 6 Strict Steps

1. **Identify target** â€” Determine what needs testing:
   - A specific use case in `application/use_cases/`
   - A specific endpoint in `api/routers/`
   - A specific adapter in `infrastructure/adapters/`
   - The entire architecture (import contracts)

2. **Analyze the code** â€” Read the target code. Identify:
   - Dependencies (ports) that need mocking
   - Input/output types (DTOs, schemas)
   - Edge cases and error paths
   - Business rules and validation logic

3. **Generate unit tests** â€” For use cases and domain logic:
   - Create test file in `tests/unit/` mirroring the source structure
   - Mock all ports using `unittest.mock.AsyncMock`
   - Test happy path with valid inputs
   - Test each validation rule with invalid inputs
   - Test each error path (exceptions, empty results, etc.)
   - Use `pytest.mark.asyncio` for async tests
   - Use `pytest.fixture` for shared setup

4. **Generate integration tests** â€” For API endpoints:
   - Create test file in `tests/integration/`
   - Use `httpx.AsyncClient` with FastAPI test app
   - Override dependencies with test doubles
   - Test each endpoint: happy path, validation errors, auth errors, not found
   - Verify response status codes, body structure, headers

5. **Generate architecture tests** â€” For import contract validation:
   - Create/update `tests/architecture/test_layer_dependencies.py`
   - Verify domain has no framework imports
   - Verify application only imports from domain
   - Verify import-linter contracts pass: `lint-imports`

6. **Run and validate** â€” Execute the full test suite:
   - `pytest tests/unit/ -v` â€” all unit tests pass
   - `pytest tests/integration/ -v` â€” all integration tests pass
   - `pytest tests/architecture/ -v` â€” all architecture tests pass
   - `pytest --cov=src/ --cov-report=term-missing` â€” coverage report

## Auto-Shielding

- NEVER generate tests that import from incorrect layers
- NEVER use real database connections in unit tests
- NEVER skip async test markers (`pytest.mark.asyncio`)
- ALWAYS mock external dependencies in unit tests
- ALWAYS use the FastAPI test client for integration tests (not direct HTTP)

## Rules

- Every use case MUST have at least 3 test cases (happy path, validation error, domain error)
- Every endpoint MUST have at least 4 test cases (success, 400, 401/403, 404)
- Architecture tests are IMMUTABLE â€” fix the code, never the test
- Test files MUST mirror source structure: `src/app/use_cases/create_user.py` â†’ `tests/unit/use_cases/test_create_user.py`
- Use `conftest.py` for shared fixtures â€” do NOT duplicate setup across test files
- Integration tests MUST use async fixtures for app and client setup
