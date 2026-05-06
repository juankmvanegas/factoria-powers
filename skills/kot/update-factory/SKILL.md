---
name: kot-update-factory
description: "Use when the Factoria plugin needs to be updated to the latest version with new skills, ADRs, or policies"
user-invocable: true
---

# Update Factory

## Purpose

Update the Factoria plugin to the latest version so this Kotlin/Android project gets new skills, policies, and ADRs.

## How to Update

Use your CLI's native update command:

| CLI | Command |
|-----|---------|
| Claude Code | `/plugin install factoria@factoria-powers` |
| Copilot CLI | `copilot plugin install factoria@factoria-powers` |
| Codex CLI | `codex plugin install factoria@factoria-powers` |
| Gemini CLI | `gemini extensions update factoria` |
| Factory Droid | `droid plugin install factoria@factoria-powers` |

## After Updating

1. Check `RELEASE-NOTES.md` in the plugin directory for what changed
2. Reload factory context in the current session: invoke skill `factoria:loading-factory-context`
3. If ADRs or policies changed, review them before continuing work

## Notes

- The plugin lives in your CLI's plugins directory — not inside this project
- All updates are non-destructive — this project's `.cloud/` files are not affected
- To reinstall from scratch: `juankmvanegas/factoria-powers`
