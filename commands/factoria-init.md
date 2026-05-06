# /factoria-init [factory]

Initialize the current project with the minimum Factoria scaffolding.

## What this command does

1. Detects (or uses the provided) factory: `net` | `ang` | `nest` | `next` | `python`
2. Writes `CLAUDE.md` (pointer to the plugin — does NOT include all policies inline)
3. Appends Factoria entries to `.gitignore`
4. Creates the `.cloud/` skeleton:
   - `.cloud/planning/` (for PRPs and migration docs)
   - `.cloud/architecture/decisions/` (for project-specific ADRs)
   - `.cloud/architecture/current.md` (blank architecture diagram)

## What it does NOT write

This command does NOT copy skill files, agent prompts, or hook scripts into the project — those live in the plugin and are loaded automatically.

## After running

- Run `factoria:loading-factory-context` to load policies and ADRs for the active factory.
- Commit the 3 files + `.cloud/` skeleton.
- The project is now Factoria-equipped.
