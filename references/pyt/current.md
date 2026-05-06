# Current System Architecture

## Overview

Factoria-Pyt defines a **Python backend** baseline with **FastAPI** and **Clean Architecture**.
The canonical service shape is a single REST entrypoint in `main.py`, source code under `src/`,
and tests grouped by layer under `tests/`.

## Architecture Diagram

```text
main.py
  |
  v
src/api ------------------------------+
  |                                   |
  v                                   |
src/application ---- contracts ----> src/infrastructure
  |
  v
src/core
```

## Layer Details

### API

- Hosts FastAPI routers and startup wiring
- Validates and maps HTTP requests
- Delegates use cases to `application`
- Centralizes exception handling in `src/api/exception_handler`

### Application

- Defines use cases, DTOs, and service interfaces
- Orchestrates repositories, REST adapters, and model services
- Depends only on `core`
- Declares the contracts implemented by `infrastructure`

### Core

- Contains entities, domain rules, and typed business exceptions
- Must remain framework-agnostic
- Must not import FastAPI, persistence libraries, or HTTP clients

### Infrastructure

- Implements application interfaces
- Owns persistence details, outbound REST clients, and `.pkl` model loading
- Uses `httpx` for REST integrations
- Translates technical failures into controlled exceptions

## Expected Repository Layout

```text
.
├── main.py
├── README.md
├── .env
├── src/
│   ├── api/
│   │   ├── end_points/
│   │   ├── config/
│   │   └── exception_handler/
│   ├── application/
│   │   ├── dtos/
│   │   ├── interfaces/
│   │   └── services/
│   ├── core/
│   │   ├── entities/
│   │   └── exceptions/
│   └── infrastructure/
│       ├── models/
│       ├── repositories/
│       └── services/
└── tests/
    ├── application.Tests/
    └── core.Tests/
```

## Cross-Cutting Concerns

- **Configuration:** `.env` at the repository root
- **Secrets:** Azure Key Vault for sensitive values
- **Observability:** OpenTelemetry tracing and structured logs
- **Validation:** typed request/response models with Pydantic
- **Error handling:** semantic HTTP payloads with a centralized handler

## Testing

- `tests/application.Tests` validates use case orchestration
- `tests/core.Tests` validates domain rules and exceptions
- `pytest` is the default framework
- New features must include tests for happy path and relevant failure paths

## Delivery Expectations

- The service must start from `main.py`
- Architecture boundaries must remain explicit
- Contract changes must be reflected in documentation and OpenAPI artifacts
