---
name: pyt-migration-start
description: "Use when starting a migration of a legacy system â€” first step before any code analysis"
---

---
name: migration-start
description: "Capture migration constraints by detecting source framework and system characteristics"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Capture all constraints and characteristics of the source system before starting a migration to Python/FastAPI with Clean Architecture. This is Phase 0 of the migration workflow â€” no code is written, only analysis.

## When to Use

- Before migrating a Django project to FastAPI
- Before migrating a Flask project to FastAPI
- Before migrating any Python web framework to Clean Architecture with FastAPI
- As the mandatory first step before `migration-discovery`

## Execution Flow â€” 6 Strict Steps

1. **Detect source framework** â€” Scan the project root for:
   - **Django**: `manage.py`, `settings.py`, `wsgi.py`, `asgi.py`, `urls.py`
   - **Flask**: `app.py` or files with `from flask import`, `Flask(__name__)`
   - **Other**: `main.py` with framework imports, `requirements.txt` analysis
   - Record framework name and version from dependencies

2. **Detect database** â€” Identify:
   - Database type (PostgreSQL, MySQL, SQLite, MongoDB)
   - ORM in use (Django ORM, SQLAlchemy, Peewee, MongoEngine, raw SQL)
   - Migration tool (Django migrations, Alembic, manual)
   - Number of models/collections

3. **Detect authentication system** â€” Identify:
   - Auth method (Django auth, Flask-Login, JWT, OAuth2, API keys, custom)
   - User model location and customizations
   - Permission/role system
   - Session management

4. **Detect external integrations** â€” Catalog:
   - Third-party APIs (REST, GraphQL, SOAP)
   - Message queues (Celery, RabbitMQ, Redis queues)
   - File storage (S3, local, cloud)
   - Email services
   - Caching (Redis, Memcached)

5. **Assess business rules complexity** â€” Evaluate:
   - Number of models/entities
   - Number of views/routes
   - Signal/event handlers (Django signals, Flask signals)
   - Middleware stack
   - Management commands / CLI commands
   - Background tasks
   - Complexity rating: Low (< 20 models) / Medium (20-50) / High (50+)

6. **Generate constraints document** â€” Write to `.cloud/planning/migration-constraints.md`:
   - Source framework summary
   - Database details
   - Auth system details
   - External integrations inventory
   - Complexity assessment
   - Identified risks
   - Recommended migration strategy (big bang vs. module-by-module)

## Auto-Shielding

- NEVER modify any source code during this phase
- NEVER start migration-discovery without completing constraints capture
- ALWAYS verify database connection details are documented (not hardcoded passwords)
- ALWAYS flag deprecated dependencies that need replacement

## Rules

- This skill is READ-ONLY â€” no code changes
- Every integration must be cataloged, even if migration strategy is unclear
- The constraints document becomes input for migration-discovery and migration-plan
- If the source project has no tests, flag this as HIGH RISK
- If the source project has custom middleware, each middleware must be individually documented
