# Factoria Plugin — Release Notes

## v1.1.1 — 2026-05-06

Fix marketplace name mismatch — `/plugin install factoria@factoria-powers` now works without manual clone.

### Changes
- `marketplace.json`: renamed marketplace `name` from `factoria-dev` to `factoria-powers` so the install suffix matches
- Version bumped to 1.1.1 in all 6 manifests

### Upgrade
```
/plugin marketplace add juankmvanegas/factoria-powers
/plugin install factoria@factoria-powers
```

---

## v1.1.0 — 2026-05-06

Sync with `sc-nes-factoria` (updated source). 9 factories active; QA layer added to all factories.

### Factories (9 total)
- **net** — .NET 8 Clean Architecture (updated + QA layer)
- **ang** — Angular 16 frontend (updated + QA layer)
- **nest** — NestJS 11 BFF (updated agents and skills)
- **pyt** — Python FastAPI backend (renamed from `python`)
- **pytml** *(new)* — Python MLOps: FastAPI + DVC + MLflow + Databricks
- **dataeng** *(new)* — Databricks / PySpark / Delta Lake / Medallion architecture
- **kot** *(new)* — Android / Kotlin / MVVM + Feature Modules
- **swf** *(new)* — iOS / Swift / MVVM + SPM Modules
- **wps** *(new)* — WordPress Block Theme / FSE / Custom Gutenberg Blocks

### Breaking changes
- Factory `python` renamed to `pyt` — update any saved configurations
- Factory `next` removed — no longer in upstream source

### QA layer (net + ang)
- 1 new agent: `qa-agent`
- 12 new commands: `qa-plan`, `qa-strategy`, `qa-scenarios`, `qa-test-cases`, `qa-run-suite`, `qa-report`, `qa-release-gate`, `qa-automate-functional`, `qa-automation-plan`, `sast-scan`, `dast-scan`, `perf-test`
- 3 new policies per factory: `qa-policy`, `performance-policy`, `security-testing-policy`

### Updated detection
Session-start and OpenCode now detect 9 factory types including Swift, WordPress, DataEng, MLOps, Kotlin.

---

## v1.0.0 — 2026-05-06

Initial release as multi-CLI plugin (factoria-powers).

Migrated from `sc-mcp-factoria` MCP server to content-only plugin following the superpowers pattern.

### Factories included
- **net** — .NET 8 Clean Architecture (4 layers, 14 ADRs, 8 agents, 30+ skills)
- **ang** — Angular 16 frontend (SPA, standalone components, Signals)
- **nest** — NestJS 11 BFF (API Gateway pattern)
- **next** — Next.js 14 full-stack (App Router, Server Components)
- **python** — FastAPI backend (Clean Architecture, async, Pydantic v2)

### What changed vs MCP server
- No Docker, no server, no install script — pure plugin
- Multi-CLI support: Claude Code, Cursor, Codex CLI/App, Gemini CLI, OpenCode, Factory Droid, Copilot CLI
- SessionStart hook auto-detects factory from project files
- 12 enforcement hooks (.cjs) for Claude Code; textual `validate-compliance` skill for other CLIs
- `sync_project` replaced by `git pull` on plugin dir / marketplace update
- `bootstrap_project` (80 files) replaced by `/factoria-init` command (3 files)
