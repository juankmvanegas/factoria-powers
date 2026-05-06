#!/usr/bin/env node
/**
 * run-hook.cjs — Cross-platform hook dispatcher
 *
 * Replaces run-hook.cmd polyglot to fix PowerShell incompatibility.
 * PowerShell cannot execute `"quoted/path.cmd" arg` (ParserError: UnexpectedToken).
 * `node "quoted/path.cjs" arg` works uniformly in PowerShell, cmd.exe, and bash.
 *
 * Usage: node run-hook.cjs <hook-name> [args...]
 *   hook-name examples: "session-start", "enforcement/guard-naming",
 *                        "lifecycle/stop-summary"
 *
 * Dispatch logic:
 *   1. If <hook-name>.cjs exists → execute with current node process (no bash needed)
 *   2. If <hook-name> exists (extensionless bash script) → execute with bash
 *   3. Neither found → silent exit 0 (hook unavailable, not a fatal error)
 */

"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const scriptName = process.argv[2];
if (!scriptName) {
  process.stderr.write("run-hook.cjs: missing hook name\n");
  process.exit(1);
}

const hookDir = __dirname;
const target = path.join(hookDir, scriptName);
const extraArgs = process.argv.slice(3);

// ─── Case 1: .cjs hook — invoke with same node binary, no bash dependency ───
const cjsPath = scriptName.endsWith(".cjs") ? target : target + ".cjs";
if (fs.existsSync(cjsPath)) {
  const result = spawnSync(process.execPath, [cjsPath, ...extraArgs], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

// ─── Case 2: extensionless bash script (e.g. "session-start") ───
if (fs.existsSync(target)) {
  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Git\\bin\\bash.exe",
          "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
          "bash",
        ]
      : ["/bin/bash", "bash"];

  for (const bash of candidates) {
    // Skip absolute paths that don't exist; always try bare "bash" (PATH lookup)
    if (bash.includes("\\") && !fs.existsSync(bash)) continue;
    const result = spawnSync(bash, [target, ...extraArgs], {
      stdio: "inherit",
    });
    if (result.error && result.error.code === "ENOENT") continue;
    process.exit(result.status ?? 1);
  }
}

// ─── Silent fail — hook not found or bash unavailable ───
// Plugin still works; hooks are best-effort enforcement, not hard gates.
process.exit(0);
