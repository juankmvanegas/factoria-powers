# ADR-006: Celery + Redis for Asynchronous Tasks

## Status
Accepted

## Date
2025-06-01

## Context
Many backend operations should not block the HTTP request/response cycle: sending emails, generating reports, processing uploaded files, synchronizing external systems, and other long-running tasks. We need a reliable, scalable mechanism for executing tasks asynchronously with support for retries, scheduling, and monitoring.

## Decision
We adopt **Celery** with **Redis** as the message broker for asynchronous task processing.

### Architecture

- **Task definitions** live in the Application layer as thin wrappers around use cases
- **Celery configuration** (broker URL, result backend, serializer) lives in Infrastructure
- **Worker entry point** (`worker.py`) is an initialization concern
- **Celery Beat** handles periodic/scheduled tasks

### Task Structure

```python
# application/tasks/notification_tasks.py
@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_notification_task(self, user_id: str, message: str) -> None:
    try:
        use_case = build_send_notification_use_case()
        asyncio.run(use_case.execute(user_id, message))
    except TransientError as exc:
        raise self.retry(exc=exc)
```

### Key Design Decisions

- Redis as broker (fast, lightweight, supports pub/sub)
- JSON serialization (NEVER pickle — security risk)
- Task results stored in Redis with configurable TTL
- Automatic retries with exponential backoff for transient failures
- Dead letter queue for permanently failed tasks
- Task routing for separating workload types across worker pools

## Consequences
### Positive
- HTTP endpoints respond immediately; heavy work happens in background
- Built-in retry mechanism with configurable strategies
- Celery Beat provides cron-like scheduling without external tools
- Redis is lightweight, fast, and already commonly used for caching
- Worker processes scale horizontally by adding more instances

### Negative
- Adds operational complexity (Redis + Celery workers to manage)
- Celery tasks run in synchronous context — async use cases need `asyncio.run()` wrapper
- Monitoring requires additional tooling (Flower, custom dashboards)
- Message loss is possible if Redis is not configured with persistence

### Neutral
- Celery is the de facto standard for Python background tasks
- Redis can also serve as a cache and session store, consolidating infrastructure
- Alternative brokers (RabbitMQ) can be swapped if needed without changing task code
