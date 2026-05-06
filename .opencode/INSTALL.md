# Installing Factoria for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add factoria to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["factoria@git+https://github.com/factoria-org/factoria-powers.git"]
}
```

Restart OpenCode. The plugin installs through OpenCode's plugin manager and registers all skills.

Verify by asking: "Tell me about factoria and what factory we're working with"

## Pinning a version

```json
{
  "plugin": ["factoria@git+https://github.com/factoria-org/factoria-powers.git#v1.0.0"]
}
```

## Windows install issues

If OpenCode cannot install via git URL, try:

```powershell
npm install factoria@git+https://github.com/factoria-org/factoria-powers.git --prefix "$HOME\.config\opencode"
```

Then use:

```json
{
  "plugin": ["~/.config/opencode/node_modules/factoria"]
}
```

## Tool mapping (inside skills)

When skills reference Claude Code tools:
- `TodoWrite` → `todowrite`
- `Task` with subagents → `@mention` syntax
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools
