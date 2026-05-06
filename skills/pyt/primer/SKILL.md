---
name: pyt-primer
description: "Use at the start of a session to load the full factory context when the automatic bootstrap did not run or needs to be refreshed"
---

---
name: primer
description: "Load project context at session start â€” detect type, load policies, establish working state"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Purpose

Bootstrap a Claude Code session by loading the project context. Reads CLAUDE.md, detects the project type and framework, loads relevant policies and ADRs, and establishes the working state for the session.

## When to Use

- At the start of every new Claude Code session
- When switching to a different project context
- When the project configuration has changed and context needs refreshing

## Execution Flow â€” 6 Strict Steps

1. **Read project configuration** â€” Load `CLAUDE.md` from the project root:
   - Extract project name, type, and framework
   - Identify the active Factoria factory (Python/FastAPI)
   - Load work mode preferences
   - Load any session-specific overrides

2. **Detect project type** â€” Scan the project structure:
   - Check for `pyproject.toml` â†’ Python project
   - Check for FastAPI imports â†’ FastAPI framework
   - Check for `manage.py` â†’ Django (may be migration source)
   - Check for Flask imports â†’ Flask (may be migration source)
   - Detect: REST API, CLI tool, Worker service, Scheduler
   - Identify Python version from pyproject.toml

3. **Load governance context** â€” Read relevant files:
   - `.cloud/policies/coding-standards.md` â†’ coding rules for this session
   - `.cloud/policies/security-policy.md` â†’ security constraints
   - `.cloud/policies/testing-policy.md` â†’ testing requirements
   - Active ADRs from `.cloud/architecture/decisions/` â†’ architectural constraints
   - Current architecture from `.cloud/architecture/current.md`

4. **Load project state** â€” Check for ongoing work:
   - Active PRPs in `.claude/PRPs/`
   - Progress trackers in `.cloud/planning/progress-*.md`
   - Migration status (if migration is in progress)
   - Last health check score

5. **Verify tooling** â€” Check that required tools are available:
   - Python and pip (correct version)
   - pytest, ruff, mypy (development tools)
   - import-linter (architecture validation)
   - Alembic (if database project)
   - Report any missing tools

6. **Present session context** â€” Output a summary:
   - Project: {name} ({type})
   - Framework: FastAPI {version}
   - Python: {version}
   - Active governance: {N} policies, {N} ADRs
   - Ongoing work: {active PRPs or "none"}
   - Health score: {last score or "not checked"}
   - Ready for: {available actions based on project state}

## Auto-Shielding

- NEVER modify any files during primer (read-only)
- NEVER skip policy loading â€” all three policies must be loaded
- ALWAYS verify CLAUDE.md exists before proceeding
- If CLAUDE.md is missing, suggest running `new-project` to initialize

## Rules

- Primer is READ-ONLY â€” it only loads context, never modifies
- All three policies MUST be loaded regardless of project state
- Missing governance files should be flagged as warnings, not errors
- The primer output MUST be concise â€” one screen maximum
- If ongoing work is detected, suggest the appropriate next skill (e.g., continue migration, resume PRP)
- Primer sets the session context but does NOT auto-execute any work
