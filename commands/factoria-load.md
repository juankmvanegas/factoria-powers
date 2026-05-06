# /factoria-load [factory]

Load the full Factoria context for the specified (or auto-detected) factory into the current session.

Equivalent to invoking skill `factoria:loading-factory-context`.

## What gets loaded

1. Detect the active factory — use the provided `[factory]` argument, or auto-detect from cwd signals, or invoke `factoria:selecting-factory` if unknown.
2. Read `references/<factory>/CLAUDE.md` — technology stack, golden rules, architecture.
3. Read **all files** in `references/<factory>/policies/` — number of policies varies by factory.
4. Read **all files** in `references/<factory>/adrs/` — number of ADRs varies by factory.

Do not hardcode file counts or names — use Glob on the actual directories.

## Use when

- Starting a session where the auto-bootstrap did not fire
- Switching factories in a multi-factory project
- After `/factoria-update` on the plugin (context may have changed)
