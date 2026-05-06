# Coding Standards

Extracted from the Python backend template and enterprise engineering rules.

## 1. Architecture Standards

### Layer Rules

- **4 layers only:** `api`, `application`, `core`, `infrastructure`
- No new layers. No renamed layers. No hidden utility layer replacing a real one
- `core` is framework-agnostic
- `application` depends only on `core`
- `api` depends on `application`
- `infrastructure` implements contracts declared by `application`

### Dependency Management

- FastAPI wiring and dependency resolution belong to `api/config`
- Application services depend on interfaces, not concrete infrastructure classes
- Infrastructure adapters implement the interfaces declared in `application/interfaces`

## 2. Naming Conventions

### Root Structure

- `main.py` in the repository root
- `src/api`
- `src/application`
- `src/core`
- `src/infrastructure`
- `tests/application.Tests`
- `tests/core.Tests`

### Language Rule

- Code is written in Spanish
- Folder names and file suffixes are written in English

### Styles

- Folders, methods, and functions: camelCase
- Classes: PascalCase
- REST routes: kebab-case

### Helpers and Utilities

- Files in `common/helpers` must include a purpose suffix before `.py`
- Files in `common/utilities` can use direct descriptive names

## 3. API Standards

- API endpoints expose resources over REST
- Use HTTP verbs semantically
- Keep endpoints thin: validate, map, delegate
- Do not implement business rules in the API layer

## 4. Application Standards

- Use cases live in `application/services`
- DTOs live in `application/dtos`
- Interfaces live in `application/interfaces`
- Application orchestrates infrastructure and invokes core when needed

## 5. Infrastructure Standards

- Infrastructure implements adapters declared by application
- REST integrations use `httpx`
- Model loading and technical connectors belong to infrastructure
- New responsibilities outside these boundaries require explicit validation

## 6. Error Handling

- Centralize exception handling in `api/exception_handler`
- Translate dependency failures in infrastructure
- Never expose stack traces, hostnames, credentials, or raw third-party payloads
- Error responses must preserve the standard shape:

```json
{
  "title": "Tipo del error",
  "error": "Mensaje contextual"
}
```

## 7. Configuration

- `.env` is the standard configuration entry point
- Sensitive values are resolved from Azure Key Vault
- Do not hardcode secrets in source files
- Any non-standard configuration mechanism requires validation

## 8. Testing

- Prefer pytest
- Unit tests are mandatory for `application`
- Test `core` whenever there is domain logic
- Follow Arrange, Act, Assert

## 9. Documentation

- Keep `README.md` updated
- Maintain pre-dev and post-dev documents
- Contract changes must be reflected in OpenAPI artifacts

## 10. Sonar Standards

- Cyclomatic complexity must stay **below 10** per function or method
- Cognitive complexity must stay **below 15** per function or method
- Avoid nesting deeper than **3 levels**
- Do not leave dead code, duplicated branches, or unreachable code paths
- Do not leave commented-out code
- Avoid source-code comments for routine logic; prefer self-documenting names, smaller functions, and extracted helpers
