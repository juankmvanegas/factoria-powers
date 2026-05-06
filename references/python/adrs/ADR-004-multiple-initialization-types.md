# ADR-004: Multiple Initialization Types

## Status
Accepted

## Date
2025-06-01

## Context
Backend services often need to expose functionality through multiple interfaces: HTTP APIs for synchronous communication, CLI tools for administrative tasks, background workers for asynchronous processing, and schedulers for recurring jobs. Each initialization type has different entry points and runtime characteristics, but they all share the same business logic.

## Decision
We support **four initialization types**, all sharing the same Domain, Application, and Infrastructure layers:

### 1. REST API (uvicorn + main.py)
- Entry point: `app/main.py` with `uvicorn.run()`
- FastAPI application with routers, middleware, and exception handlers
- Production: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`
- Primary interface for synchronous HTTP communication

### 2. CLI (Typer)
- Entry point: `app/cli.py` with Typer application
- Administrative commands: migrations, seed data, health checks, one-off tasks
- Execution: `uv run python -m app.cli <command>`
- Uses the same use cases and repositories as the API

### 3. Worker (Celery)
- Entry point: `app/worker.py` with Celery application
- Processes asynchronous tasks from the message queue
- Execution: `celery -A app.worker worker --loglevel=info`
- Tasks invoke Application use cases — NEVER contain business logic directly

### 4. Scheduler (Celery Beat)
- Entry point: `app/scheduler.py` with Celery Beat configuration
- Periodic tasks: cleanup jobs, report generation, data synchronization
- Execution: `celery -A app.worker beat --loglevel=info`
- Schedules are defined in configuration, not hardcoded

### Shared Architecture

```
app/
  domain/          → Shared across ALL initialization types
  application/     → Shared across ALL initialization types
  infrastructure/  → Shared across ALL initialization types
  api/             → REST API specific (routers, middleware)
  cli.py           → CLI specific (Typer commands)
  worker.py        → Worker specific (Celery tasks)
  scheduler.py     → Scheduler specific (Celery Beat)
  main.py          → API entry point
```

## Consequences
### Positive
- Business logic is written once and reused across all interfaces
- Each initialization type can be deployed, scaled, and monitored independently
- CLI commands can reuse the same use cases for administrative operations
- Workers process the same business workflows asynchronously

### Negative
- More entry points to maintain and test
- Dependency injection must work for both async (API) and sync (CLI/Worker) contexts
- Docker images may need different CMD instructions per initialization type

### Neutral
- Each initialization type has its own Dockerfile target or docker-compose service
- Health checks differ per initialization type (HTTP for API, heartbeat for workers)
