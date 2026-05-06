---
name: selecting-factory
description: Use when the active factory could not be auto-detected from the project files and the user must be asked to select one
---

# Selecting Factory

## When Auto-Detection Fails

The SessionStart hook checked the project root for known signals. None matched:
- No `.sln` / `.csproj` / `Program.cs` → not net
- No `angular.json` / `@angular/core` → not ang
- No `@nestjs/core` → not nest
- No `next.config.*` / `next` dep → not next
- No `pyproject.toml` / `requirements.txt` → not python

## Ask the User

Pose this question exactly once:

> Which Factoria factory does this project use?
> 1. **net** — .NET 8 / C# / Clean Architecture 4 layers
> 2. **ang** — Angular 16+ / TypeScript / SPA
> 3. **nest** — NestJS 11 / TypeScript / BFF
> 4. **next** — Next.js 14 / TypeScript / Full Stack
> 5. **python** — Python 3.12+ / FastAPI / Clean Architecture

## After Selection

1. Set `ACTIVE_FACTORY=<choice>` in session context.
2. Invoke skill `factoria:loading-factory-context` to load policies and ADRs.
3. Proceed with the original user request.

## Rules

- NEVER assume a factory without confirmation
- NEVER ask more than once
- If the user says "none" or the project is not a Factoria project, inform them that Factoria skills won't apply and work normally
