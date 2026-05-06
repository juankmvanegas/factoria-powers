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

    // Collect case facts from .cloud/ planning files
    const caseFacts = [];
    caseFacts.push(`## Case Facts (Immutable — preserve across compaction)`);
    caseFacts.push(``);

    // Extract work mode if orchestrate was run
    const planningDir = path.join(cwd, ".cloud", "planning");
    if (fs.existsSync(planningDir)) {
      const planFiles = fs.readdirSync(planningDir).filter(f => f.endsWith(".md"));
      for (const pf of planFiles) {
        const content = fs.readFileSync(path.join(planningDir, pf), "utf8");
        // Extract key decisions (mode, paths, OpenAPI, template choice)
        const modeMatch = content.match(/Mode:\s*(.+)/i);
        const pathMatch = content.match(/(?:Project|Working)\s*(?:path|directory):\s*(.+)/i);
        const openapiMatch = content.match(/OpenAPI:\s*(.+)/i);
        if (modeMatch) caseFacts.push(`- **Work mode**: ${modeMatch[1].trim()}`);
        if (pathMatch) caseFacts.push(`- **Project path**: ${pathMatch[1].trim()}`);
        if (openapiMatch) caseFacts.push(`- **OpenAPI**: ${openapiMatch[1].trim()}`);
      }
    }

    // Extract factory from CLAUDE.md
    const claudeMd = path.join(cwd, "CLAUDE.md");
    if (fs.existsSync(claudeMd)) {
      const claude = fs.readFileSync(claudeMd, "utf8");
      const factoryMatch = claude.match(/Primary factory:\s*\*\*(\w+)\*\*/);
      const modeMatch = claude.match(/Mode:\s*\*\*([^*]+)\*\*/);
      if (factoryMatch) caseFacts.push(`- **Factory**: ${factoryMatch[1]}`);
      if (modeMatch) caseFacts.push(`- **Mode**: ${modeMatch[1]}`);
    }

    caseFacts.push(``);
    lines.push(...caseFacts);

    // Write snapshot
    fs.writeFileSync(snapshotFile, lines.join("\n"));

    // Output case facts block as FIRST thing — positioned at prompt start
    // so it survives compaction as immutable context
    process.stdout.write(
      `[pre-compact] Context is about to be compressed.\n` +
        `  Snapshot saved to: ${snapshotFile}\n\n` +
        `  ═══ CASE FACTS (IMMUTABLE — DO NOT SUMMARIZE) ═══\n` +
        caseFacts.filter(l => l.startsWith("- ")).map(l => `  ${l}`).join("\n") + `\n` +
        `  ═══════════════════════════════════════════════════\n\n` +
        `  After compaction, the CASE FACTS block above MUST be preserved\n` +
        `  verbatim at the START of the conversation. These are transactional\n` +
        `  facts (IDs, paths, modes, decisions) that cannot be lost.\n\n` +
        `  Also remember:\n` +
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
