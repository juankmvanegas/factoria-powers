# Factoria Powers

**Full Stack Software Factory as a multi-CLI plugin.**

Factoria enforces Clean Architecture, mandatory policies (security / testing / coding-standards), 14 ADRs per factory, 8 specialized agents, 30+ workflow skills, and 12 runtime enforcement hooks — distributed as a zero-runtime plugin for all major AI coding CLIs.

## Supported CLIs

| CLI | Install |
|---|---|
| **Claude Code** | `/plugin marketplace add factoria-org/factoria-powers` then `/plugin install factoria@factoria-powers` |
| **Cursor** | Cursor plugin marketplace → search "factoria" |
| **Codex App** | Codex App marketplace → search "factoria" |
| **Codex CLI** | `codex plugin marketplace add factoria-org/factoria-powers && codex plugin install factoria` |
| **Gemini CLI** | `gemini extensions install https://github.com/factoria-org/factoria-powers` |
| **OpenCode** | Add `"factoria@git+https://github.com/factoria-org/factoria-powers.git"` to `opencode.json` |
| **Factory Droid** | `droid plugin marketplace add factoria-org/factoria-powers && droid plugin install factoria` |
| **Copilot CLI** | Plugin marketplace — search "factoria" |
| **Manual (any CLI)** | `git clone https://github.com/factoria-org/factoria-powers ~/.claude/plugins/factoria` |

## Factories

| Factory | Stack | Description |
|---|---|---|
| `net` | .NET 8 | Clean Architecture 4-layer, Azure stack, xUnit, FluentValidation |
| `ang` | Angular 16+ | SPA, standalone components, Signals, NgRx |
| `nest` | NestJS 11 | BFF / API Gateway, TypeORM, Guards, Interceptors |
| `next` | Next.js 14 | App Router, Server Components, Prisma, Tailwind |
| `python` | FastAPI | Clean Architecture, async, Pydantic v2, SQLAlchemy 2 |

## How it works

On session start, a hook auto-detects your project's factory (from `.csproj`, `angular.json`, `@nestjs/core`, `next.config.*`, `pyproject.toml`) and injects the **Factoria bootstrap** into the agent's first turn. The agent then loads skills on demand via its native skill tool.

For Claude Code, 12 enforcement hooks (`.cjs`) fire on PreToolUse/PostToolUse to enforce naming, secrets, architecture, golden-path packages, and commit conventions at runtime. Other CLIs use the `validate-compliance` skill for textual enforcement.

## Updating

```bash
# Claude Code plugin dir (adjust path as needed)
cd ~/.claude/plugins/factoria && git pull
```

Or use your CLI's marketplace update command.

## License

MIT
