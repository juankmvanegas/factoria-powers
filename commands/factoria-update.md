# /factoria-update

Update the Factoria plugin to the latest version.

## Steps

1. Find the plugin directory (where this file lives — `${CLAUDE_PLUGIN_ROOT}` or equivalent)
2. Run: `git pull` in that directory
3. Confirm the update with: `git log --oneline -5`
4. Reload the session context by invoking skill `factoria:loading-factory-context`

## Example (Claude Code on Unix/Mac)

```bash
cd ~/.claude/plugins/factoria && git pull
```

## Example (Claude Code on Windows)

```powershell
cd $env:USERPROFILE\.claude\plugins\factoria; git pull
```

## After update

- Check `RELEASE-NOTES.md` for what changed
- If policies or ADRs were updated, reload context with `/factoria-load`
