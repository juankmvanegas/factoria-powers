# Factoria Plugin — Release Notes

## v1.1.3 — 2026-05-06

Fix PowerShell incompatibility — hooks now work in Copilot CLI and any Windows host that executes commands via PowerShell.

### Changes

**SEV-1 — Runtime fix (PowerShell hosts):**
- `hooks/run-hook.cjs` *(new)*: Node.js cross-platform hook dispatcher, replaces the cmd/bash polyglot `run-hook.cmd`
- `hooks/hooks.json`: all 12 hook commands changed from `"\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" <name>"` to `"node \"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cjs\" <name>"`
- `hooks/hooks-cursor.json`: same update for `sessionStart` hook

**Root cause:** PowerShell parses `"quoted/path.cmd" arg` as a string-literal expression, then `arg` as an unexpected token (`ParserError: UnexpectedToken`). Changing to `node "quoted/path.cjs" arg` works in PowerShell, cmd.exe, and bash uniformly — the first token is now a plain executable, not a quoted path.

**`run-hook.cmd` is preserved** as a legacy fallback (not deleted). `run-hook.cjs` dispatch logic: `.cjs` hooks execute directly via the current Node process; extensionless bash hooks (e.g. `session-start`) still invoke Git Bash with the same fallback chain.

### Known limitation

Node.js must be on PATH. Node is already a hard dependency for the 16 `.cjs` enforcement and lifecycle hooks — if Node is unavailable, hooks were already non-functional before this change.

### Upgrade
```
/plugin install factoria@factoria-powers
```
Or reinstall:
```
/plugin marketplace add juankmvanegas/factoria-powers
/plugin install factoria@factoria-powers
```

---

## v1.1.2 — 2026-05-06

Comprehensive sweep of residual MCP-server and 5-factory references after v1.1.x partial fixes.

### Changes

**SEV-1 — Runtime fixes:**
- `skills/{nest,kot,pyt}/update-factory/SKILL.md`: rewrote from MCP `sync_project` call to CLI-native install table (same as `/factoria-update`)
- `skills/{kot,wps,swf}/eject-factory/SKILL.md`: rewrote from "scrub MCP refs" narrative to actual plugin copy workflow (`references/<factory>/` → project)
- `references/{ang,nest,net,swf,kot}/CLAUDE.md`: removed "register in MCP Server" and `get_factory_context` instructions
- `hooks/lifecycle/auto-primer.cjs`: rewrote `detectProject()` to cover all 9 factories (was: only net/ang). Removed "Backend/Frontend/Full Stack" 4-mode labels.
- `references/{pyt,pytml,dataeng,kot,swf,wps}/CLAUDE.md`: added enforcement coverage note — runtime `.cjs` guards cover net/ang/nest only; use `/factoria-validate` for other factories

**SEV-2 — Incorrect info in user-visible manifests:**
- All 5 plugin manifests (`.claude-plugin`, `.cursor-plugin`, `.codex-plugin`, `gemini-extension.json`, `marketplace.json`): updated description from "Next.js and Python" to full 9-factory list
- `.codex-plugin/plugin.json`: updated `longDescription` to include all stacks
- All 3 keyword arrays: replaced `"python"` with `"pyt"` + added `pytml`, `dataeng`, `kot`, `swf`, `wps`
- `references/pyt/adrs/{ADR-002,ADR-003,ADR-014}`: renamed `Factoria-Python` → `Factoria-Pyt`
- `skills/pyt/skill-creator/SKILL.md`: renamed `Factoria-Python` → `Factoria-Pyt`
- `agents/qa-agent.md`: made factory-agnostic (was hardcoded to `Factoria-Net`)
- `commands/factoria-load.md`: replaced `git pull` trigger with `/factoria-update`

### Known limitation

Runtime enforcement hooks (`.cjs` guards) cover `.cs` and `.ts` extensions only — effective for `net`, `ang`, `nest`. For the other 6 factories (`pyt`, `pytml`, `dataeng`, `kot`, `swf`, `wps`), use `/factoria-validate` which runs the same checks via the `validate-compliance` skill. Full multi-factory hook support is planned for v1.2.

### Upgrade
```
/plugin install factoria@factoria-powers
```
Or reinstall:
```
/plugin marketplace add juankmvanegas/factoria-powers
/plugin install factoria@factoria-powers
```

---

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
