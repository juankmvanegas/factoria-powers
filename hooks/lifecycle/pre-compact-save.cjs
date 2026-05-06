#!/usr/bin/env node
/**
 * pre-compact-save.cjs — Hook PreCompact
 *
 * Before context compression, saves a snapshot of decisions made
 * and current state to .cloud/audit/ so critical context survives.
 *
 * Outputs a reminder about what to preserve.
 */

const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const cwd = process.cwd();
    const auditDir = path.join(cwd, ".cloud", "audit");

    // Only proceed if .cloud/ exists (we're in a project using Factoria)
    if (!fs.existsSync(path.join(cwd, ".cloud"))) {
      process.exit(0);
    }

    // Create audit dir if needed
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const snapshotFile = path.join(auditDir, `compact-snapshot-${timestamp}.md`);

    // Collect current state
    const lines = [];
    lines.push(`# Pre-Compact Snapshot`);
    lines.push(`Date: ${new Date().toISOString()}`);
    lines.push(``);

    // Check git status for what files have been modified
    const { execSync } = require("child_process");
    try {
      const gitStatus = execSync("git diff --name-only", {
        cwd,
        encoding: "utf8",
        timeout: 5000,
      }).trim();
      if (gitStatus) {
        lines.push(`## Modified files (uncommitted)`);
        lines.push("```");
        lines.push(gitStatus);
        lines.push("```");
        lines.push(``);
      }
    } catch {}

    // Check staged files
    try {
      const staged = execSync("git diff --cached --name-only", {
        cwd,
        encoding: "utf8",
        timeout: 5000,
      }).trim();
      if (staged) {
        lines.push(`## Staged files`);
        lines.push("```");
        lines.push(staged);
        lines.push("```");
        lines.push(``);
      }
    } catch {}

    // Write snapshot
    fs.writeFileSync(snapshotFile, lines.join("\n"));

    // Output context preservation reminder
    process.stdout.write(
      `[pre-compact] Context is about to be compressed.\n` +
        `  Snapshot saved to: ${snapshotFile}\n` +
        `  IMPORTANT: After compaction, remember:\n` +
        `    - Current task and progress\n` +
        `    - Decisions already made (mode, paths, OpenAPI, etc.)\n` +
        `    - Files modified but not yet committed\n` +
        `    - Any pending gates from /orchestrate flow`
    );

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
