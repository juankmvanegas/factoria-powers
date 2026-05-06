# Factoria Powers

**Full Stack Software Factory as a multi-CLI plugin.**

Factoria enforces Clean Architecture, mandatory policies, ADRs per factory, specialized agents, 30+ workflow skills, and 12 runtime enforcement hooks — distributed as a zero-runtime plugin for all major AI coding CLIs. Supports 9 factory types across web, mobile, data engineering, and MLOps.

## Supported CLIs

| CLI | Install |
|---|---|
| **Claude Code** | `/plugin marketplace add juankmvanegas/factoria-powers` then `/plugin install factoria@factoria-powers` |
| **Cursor** | Cursor plugin marketplace → search "factoria" |
| **Codex App** | Codex App marketplace → search "factoria" |
| **Codex CLI** | `codex plugin marketplace add juankmvanegas/factoria-powers && codex plugin install factoria@factoria-powers` |
| **Gemini CLI** | `gemini extensions install https://github.com/juankmvanegas/factoria-powers` |
| **OpenCode** | Add `"factoria@git+https://github.com/juankmvanegas/factoria-powers.git"` to `opencode.json` |
| **Factory Droid** | `droid plugin marketplace add juankmvanegas/factoria-powers && droid plugin install factoria@factoria-powers` |
| **Copilot CLI** | `copilot plugin marketplace add juankmvanegas/factoria-powers` then `copilot plugin install factoria@factoria-powers` |

## Updating

Re-run the install command for your CLI — it pulls the latest version:

| CLI | Update command |
|---|---|
| **Claude Code** | `/plugin install factoria@factoria-powers` |
| **Copilot CLI** | `copilot plugin install factoria@factoria-powers` |
| **Codex CLI** | `codex plugin install factoria@factoria-powers` |
| **Gemini CLI** | `gemini extensions update factoria` |
| **Factory Droid** | `droid plugin install factoria@factoria-powers` |

## Factories

| Key | Stack | Description |
|---|---|---|
| `net` | .NET 8 / C# | Clean Architecture 4-layer, Azure stack, xUnit, FluentValidation |
| `ang` | Angular 16+ | SPA, standalone components, Signals, NgRx |
| `nest` | NestJS 11 | BFF / API Gateway, TypeORM, Guards, Interceptors |
| `pyt` | Python FastAPI | Clean Architecture, async, Pydantic v2, SQLAlchemy 2 |
| `pytml` | Python MLOps | FastAPI + DVC + MLflow + Databricks — ML pipelines |
| `dataeng` | Databricks / PySpark | Delta Lake, Medallion architecture, Unity Catalog |
| `kot` | Android / Kotlin | MVVM, Feature Modules, Jetpack Compose |
| `swf` | iOS / Swift | MVVM, SPM Modules, SwiftUI |
| `wps` | WordPress | Block Theme, FSE, Custom Gutenberg Blocks |

## How it works

On session start, a hook auto-detects your project's factory from cwd signals (`.csproj`, `angular.json`, `@nestjs/core`, `databricks.yml`, `dvc.yaml`, `main.py`, `Package.swift`, `theme.json`, `build.gradle.kts`, etc.) and injects the **Factoria bootstrap** into the agent's first turn. The agent then loads skills on demand via its native skill tool.

For Claude Code, 12 enforcement hooks (`.cjs`) fire on PreToolUse/PostToolUse to enforce naming, secrets, architecture, golden-path packages, and commit conventions at runtime. Other CLIs use the `validate-compliance` skill for textual enforcement.

## License

MIT