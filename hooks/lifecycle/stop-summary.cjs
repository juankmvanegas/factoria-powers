#!/usr/bin/env node
/**
 * stop-summary.cjs — Hook Stop
 *
 * When Claude stops (session end, clear, etc.), generates a summary
 * of work done and pending items in .cloud/audit/.
 */

const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const cwd = process.cwd();

    // Only proceed if .cloud/ exists
    if (!fs.existsSync(path.join(cwd, ".cloud"))) {
      process.exit(0);
    }

    const auditDir = path.join(cwd, ".cloud", "audit");
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const summaryFile = path.join(auditDir, `session-end-${timestamp}.md`);

    const lines = [];
    lines.push(`# Session End Summary`);
    lines.push(`Date: ${new Date().toISOString()}`);
    lines.push(``);

    // Collect uncommitted changes
    const { execSync } = require("child_process");

    try {
      const status = execSync("git status --porcelain", {
        cwd,
        encoding: "utf8",
        timeout: 5000,
      }).trim();

      if (status) {
        lines.push(`## Uncommitted changes`);
        lines.push("```");
        lines.push(status);
        lines.push("```");
        lines.push(``);
        lines.push(
          `**Action needed**: Review and commit these changes, or discard if incomplete.`
        );
      } else {
        lines.push(`## Status: Clean working tree`);
        lines.push(`All changes have been committed.`);
      }
    } catch {}

    // Check recent commits in this session (last hour)
    try {
      const recentCommits = execSync(
        'git log --oneline --since="1 hour ago" 2>/dev/null',
        { cwd, encoding: "utf8", timeout: 5000 }
      ).trim();
      if (recentCommits) {
        lines.push(``);
        lines.push(`## Commits this session`);
        lines.push("```");
        lines.push(recentCommits);
        lines.push("```");
      }
    } catch {}

    // Check changelog tracker for pending updates
    const os = require("os");
    const trackerPath = path.join(
      os.tmpdir(),
      "factoria-changelog-tracker.json"
    );
    try {
      const tracker = JSON.parse(fs.readFileSync(trackerPath, "utf8"));
      if (tracker.codeChanged && !tracker.changelogUpdated) {
        lines.push(``);
        lines.push(`## Pending: CHANGELOG update`);
        lines.push(
          `Code was modified (${tracker.files.length} files) but CHANGELOG.md was not updated.`
        );
        lines.push(`Files: ${tracker.files.join(", ")}`);
      }
      // Clean up tracker
      fs.unlinkSync(trackerPath);
    } catch {}

    fs.writeFileSync(summaryFile, lines.join("\n"));

    process.stdout.write(
      JSON.stringify({
        systemMessage: `Session summary saved to .cloud/audit/session-end-${timestamp}.md`,
      })
    );

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
