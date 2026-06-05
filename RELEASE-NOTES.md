# Factoria Plugin — Release Notes

## v1.2.0 — 2026-06-05

Sync with `sc-nes-factoria` upstream through 2026-05-20. The plugin's last content sync was 2026-05-06, so all upstream changes between 2026-05-07 and 2026-05-20 (plus a few missed 2026-04-30 deltas) are now ported. Audited file-by-file against upstream — not by commit messages.

### Factory content syncs

**net (.NET):**
- **Mapster replaces AutoMapper** (upstream 2026-05-07): deleted `ADR-010-automapper-dto-mapping`, added `ADR-010-mapster-dto-mapping`, and swept all AutoMapper→Mapster references across `backend`, `codebase-analyst`, `health-check`, `smoke-tests` skills, `coding-standards`, `testing-policy`, `current.md`, `CLAUDE.md`, `ADR-003`, `ADR-004`. Zero AutoMapper residue remains.
- **Performance scaffolding REST/gRPC + k6** (upstream 2026-05-20): re-ported `net-perf-test` (was a stub) with REST vs gRPC template selection, k6 MCP-preferred + Docker fallback; refreshed `net-qa-release-gate`, `net-qa-report`, `net-qa-run-suite`.

**ang (Angular):**
- **Playwright MCP-first** (upstream 2026-05-20): reverted a regression — the plugin still said "CLI is preferred over MCP"; `playwright-cli` and `playwright-visual` now prefer the Playwright MCP with CLI as fallback, and `references/ang/CLAUDE.md` documents the `claude mcp add playwright …` setup.
- **Perf/k6**: re-ported `ang-perf-test` (was a stub), `ang-qa-report`, `ang-qa-run-suite`.

**dataeng (Databricks):**
- **Legacy Databricks patterns** (upstream 2026-05-19): added `ADR-015-legacy-notebook-first-compatibility` and `ADR-016-synapse-publication-boundary`; re-ported the `dataeng` and `migration-discovery` skills and `coding-standards`, `testing-policy`, `current.md`, `CLAUDE.md` with `co_ppal_*/co_dl_*/co_dwh_*` notebook roles, `/mnt` lake zones, reproceso/one-time flows, and Synapse publication boundaries.

**wps (WordPress):**
- Added the "Recommended MCPs (Web QA)" Playwright-MCP section to `references/wps/CLAUDE.md` (upstream 2026-05-20).

**Cross-cutting QA discipline** (net + ang): ported the Azure DevOps **work-item context intake** — `qa-policy` now has a "Functional Intake from Azure DevOps" section and the `.cloud/qa/context/work-item-context.md` artifact; `qa-strategy`/`qa-plan` skills ask for the work item id first. Phrased CLI-agnostically (the plugin has no bundled MCP server).

### New cross-factory orchestration skills

The orchestrator referenced `/openapi-generator`, `/sync-contracts`, `/validate-integration` but no backing files existed. Ported all three from upstream as top-level shared skills (`skills/openapi-generator`, `skills/sync-contracts`, `skills/validate-integration`), generalized from the upstream 2-factory model to the 9-factory model, MCP-server calls removed.

### `/factoria-init` now scaffolds the QA workspace

The QA skills write under `.cloud/qa/…` but init never created it. `/factoria-init` now scaffolds the `.cloud/qa/{context,strategy,plans,scenarios,cases,automation,reports,templates}/` workspace + `.qa-reports/` + seed files for all factories, and the k6/SAST/DAST tooling templates (`rest-smoke.js`, `grpc-smoke.js`, `run-perf.sh`, `semgrep/rules.yml`, …) for `net`, `nest`, `pyt` (REST/gRPC) and `ang` (browser).

### Internal coherence fixes

- **pyt ADR collision resolved**: the factory had two overlapping ADR sets with duplicate numbers. The upstream-canonical lineage keeps `ADR-001…014`; genuinely distinct decisions (uv, sqlalchemy-async repository, celery/redis, import-linter, github-actions, multiple-init) were renumbered to `ADR-015…021`; six contradictory duplicates were merged into their canonical ADR and removed. The set is now contiguous `001…021` with no collisions.
- Orchestrator factory list confirmed coherent (9 factories incl. `dataeng`) — already correct; the upstream's own orchestrator omits DataEng and miscounts.
- Removed the stale `nextjs` keyword from the plugin/cursor/codex manifests (the `next` factory was removed in v1.1.0).

### Not ported (intentional)
- `Factoria-Nes` (legacy NestJS gRPC BFF) — not in upstream's authoritative factory list; correctly excluded.
- MCP-server-internal wiring (`.mcp.json` server blocks, Hermes installer, `bootstrap-project.ts` mechanics) — the plugin is content-only and dropped the server. External-MCP *guidance* (Azure DevOps / Playwright / k6) was kept where user-facing.

### Upgrade
```
/plugin install factoria@factoria-powers
```

---

## v1.1.4 — 2026-05-06

Reduce SessionStart context overhead — ~30× less context per session.

### Changes

**Performance:**
- `hooks/session-start`: removed inline injection of the full `using-factoria` SKILL body. SessionStart now emits only the detected factory + a directive to invoke the skill on the first turn. The model loads the SKILL body lazily via the `Skill` tool when needed.
- Output size per SessionStart: ~8 KB → ~280 bytes (30× reduction).
- Behavior unchanged: the model still invokes `factoria:using-factoria` before responding, which loads the same bootstrap workflow on demand.

### Why

`using-factoria/SKILL.md` is 8 KB and was being injected into every conversation's context window via SessionStart, even on sessions where Factoria workflows aren't used. The plugin model already loads SKILL frontmatter into the system prompt for skill discovery, so the body only needs to be read when the skill is actually invoked.

### Upgrade
```
/plugin install factoria@factoria-powers
```

---

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
