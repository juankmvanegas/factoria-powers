#!/usr/bin/env node
/**
 * guard-changelog.cjs — Hook PostToolUse (Edit/Write)
 *
 * After production code changes, checks if CHANGELOG.md was updated
 * in the same session. Outputs a warning (does not block).
 *
 * Uses a temp marker file to track whether code was changed
 * and whether CHANGELOG was updated.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const MARKER = path.join(os.tmpdir(), "factoria-changelog-tracker.json");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");

    // Skip non-project files
    if (
      filePath.includes("/Factoria/") ||
      filePath.includes("/node_modules/") ||
      filePath.includes("/.claude/") ||
      filePath.includes("/.git/") ||
      filePath.includes("/.cloud/") ||
      filePath.endsWith(".md") && !filePath.endsWith("CHANGELOG.md")
    ) {
      process.exit(0);
    }

    // Load tracker
    let tracker = { codeChanged: false, changelogUpdated: false, files: [] };
    try {
      tracker = JSON.parse(fs.readFileSync(MARKER, "utf8"));
    } catch {}

    const fileName = filePath.split("/").pop() || "";

    // If CHANGELOG.md was updated, mark it
    if (fileName === "CHANGELOG.md") {
      tracker.changelogUpdated = true;
      fs.writeFileSync(MARKER, JSON.stringify(tracker));
      process.exit(0);
    }

    // If production code was changed, track it
    const isProductionCode =
      filePath.endsWith(".cs") ||
      filePath.endsWith(".ts") ||
      filePath.endsWith(".csproj") ||
      filePath.endsWith(".json");

    if (isProductionCode) {
      tracker.codeChanged = true;
      if (!tracker.files.includes(fileName)) {
        tracker.files.push(fileName);
      }
      fs.writeFileSync(MARKER, JSON.stringify(tracker));

      // Warn if code changed but CHANGELOG not yet updated
      if (!tracker.changelogUpdated && tracker.files.length >= 2) {
        const output =
          `[guard-changelog] Production code modified (${tracker.files.length} files) but CHANGELOG.md has not been updated yet.\n` +
          `  Files changed: ${tracker.files.slice(-5).join(", ")}${tracker.files.length > 5 ? "..." : ""}\n` +
          `  Action: Update CHANGELOG.md before completing this task (Added/Changed/Fixed/Removed).`;
        process.stdout.write(output);
      }
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
