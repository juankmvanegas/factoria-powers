# Factoria Plugin — Release Notes

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
