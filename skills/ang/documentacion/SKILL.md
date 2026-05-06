---
name: ang-documentacion
description: "Use when documentation (CHANGELOG, README, API docs, comments) needs to be generated or updated after code changes"
---

---
name: documentacion
description: "Auto-skill for Angular documentation — CHANGELOG, architecture, README"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Documentation (Auto-Activated)

## Activates when

- After significant code changes
- At the end of the automatic chain (after tests)
- When the user requests it

## What it does

### CHANGELOG.md
Update with Keep a Changelog format:
```markdown
## [Unreleased]
### Added
- New {entity} view with complete CRUD
### Changed
- Updated {entity} service with validation
### Fixed
- Fixed {entity} routing
```

### Architecture
- Update `.cloud/architecture/current.md` if there are structural changes
- Create ADRs for new decisions

### README.md
- Update if there are new views or endpoints
- Update execution instructions if they change

## Rules

- ALWAYS update CHANGELOG with each change
- NEVER generic documentation — always specific to the change made
- ALWAYS Keep a Changelog format
