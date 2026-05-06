# /factoria-init [factory]

Initialize the current project with the minimum Factoria scaffolding.

## What this command does

1. Detect the active factory — use the provided `[factory]` argument, auto-detect from cwd signals, or invoke `factoria:selecting-factory` if unknown. Supported factory keys live in `references/` — list that directory to see all available factories; do not hardcode the list.
2. Write `CLAUDE.md` (pointer to the plugin — does NOT include all policies inline).
3. Append Factoria entries to `.gitignore`.
4. Create the `.cloud/` skeleton — **create directories before files**, in this exact order:
   a. Create directory `.cloud/planning/` — then write `.cloud/planning/.gitkeep` (empty)
   b. Create directory `.cloud/architecture/` — then create directory `.cloud/architecture/decisions/` — then write `.cloud/architecture/decisions/.gitkeep` (empty)
   c. Write `.cloud/architecture/current.md` (blank architecture diagram placeholder)

Do NOT attempt to write a file inside a directory before the directory exists.

## What it does NOT write

This command does NOT copy skill files, agent prompts, or hook scripts into the project — those live in the plugin and are loaded automatically.

## After running

- Run `factoria:loading-factory-context` to load policies and ADRs for the active factory.
- Commit the 3 files + `.cloud/` skeleton.
- The project is now Factoria-equipped.
