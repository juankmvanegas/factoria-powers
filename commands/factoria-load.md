# /factoria-load [factory]

Load the full Factoria context for the specified (or auto-detected) factory into the current session.

Equivalent to invoking skill `factoria:loading-factory-context`.

## What gets loaded

- `references/<factory>/CLAUDE.md` — technology stack, golden rules, architecture
- `references/<factory>/policies/security-policy.md`
- `references/<factory>/policies/testing-policy.md`
- `references/<factory>/policies/coding-standards.md`
- `references/<factory>/adrs/ADR-001` through `ADR-014`

## Use when

- Starting a session where the auto-bootstrap did not fire
- Switching factories in a multi-factory project
- After `git pull` on the plugin (context may have changed)
