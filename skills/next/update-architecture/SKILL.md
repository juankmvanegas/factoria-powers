---
name: next-update-architecture
description: "Use when the architecture documentation must reflect recent changes — after an ADR is accepted, new service types added, or new infrastructure providers introduced"
---

---
name: update-architecture
description: "Update .cloud/architecture/current.md after structural changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Update Architecture

## Purpose

Update the architecture documentation in `.cloud/architecture/current.md` after any structural change to the project. Keeps the living architecture document in sync with the actual codebase — layer contents, route map, component inventory, ADR table, and dependency versions.

## Execution Flow — 5 Steps

### Step 1: Read Current Architecture Doc

Read `.cloud/architecture/current.md` to understand the last documented state. If the file does not exist, create it from scratch.

### Step 2: Scan Project Structure

Analyze the actual project structure:

```
app/                          → Route map (pages, layouts, route groups)
  (public)/                   → Public routes
  (protected)/                → Protected routes requiring auth
  api/                        → API route handlers
src/
  presentation/               → Components (Server vs Client), hooks, styles
  application/                → Use cases, DTOs, interfaces
  infrastructure/             → Adapters, external service clients
  domain/                     → Entities, value objects, business rules
lib/                          → Shared utilities, configuration
middleware.ts                 → Auth middleware
```

### Step 3: Update Layer Contents

For each layer, list:
- **Domain**: entities, value objects, enums
- **Application**: use cases, DTOs (input/output), interfaces
- **Infrastructure**: adapters (HTTP, storage, auth), implementations
- **Presentation**: pages (count), components (Server vs Client count), hooks, layouts
- **API Routes**: list of `/api/*` handlers with HTTP methods

### Step 4: Update Metadata

- **ADR Table**: list all ADRs from `.cloud/architecture/decisions/` with status
- **Dependency Versions**: read `package.json` for key deps (next, react, typescript, tailwindcss, next-auth, etc.)
- **Route Map**: full tree of `app/` directory showing route groups and dynamic segments
- **Last Updated**: current date

### Step 5: Write Updated Document

Write the updated `.cloud/architecture/current.md`:

```markdown
# Architecture — {Project Name}
## Last Updated: {YYYY-MM-DD}

## Stack
| Technology | Version |
|------------|---------|
| Next.js    | 14.x   |
| React      | 18.x   |
| TypeScript | 5.x    |
| Tailwind   | 3.x    |

## Layer Summary
| Layer          | Files | Key Contents |
|----------------|-------|-------------|
| Domain         | N     | ...         |
| Application    | N     | ...         |
| Infrastructure | N     | ...         |
| Presentation   | N     | ...         |

## Route Map
...

## ADR Registry
| ADR | Title | Status |
|-----|-------|--------|
| ... | ...   | ...    |
```

## Rules

- NEVER invent contents — only document what actually exists in the codebase
- ALWAYS scan the real file system, never rely on cached or assumed state
- ALWAYS preserve any custom sections the user may have added to current.md
- ALWAYS update the "Last Updated" date
- If a layer is empty, document it as empty — do not omit it
