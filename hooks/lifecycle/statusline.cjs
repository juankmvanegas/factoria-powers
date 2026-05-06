#!/usr/bin/env node
/**
 * statusline.cjs — StatusLine command
 *
 * Shows: project type | active branch | uncommitted files count
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  const cwd = process.cwd();
  const parts = [];

  // Detect project type
  let projectType = "";
  try {
    const files = fs.readdirSync(cwd);
    const hasDotnet = files.some(
      (f) => f.endsWith(".sln") || f.endsWith(".csproj")
    );
    const hasAngular = files.some((f) => f === "angular.json");
    const hasFactoria = files.some((f) => f === "Factoria");

    if (hasFactoria) projectType = "Factoria";
    else if (hasDotnet && hasAngular) projectType = "FullStack";
    else if (hasDotnet) projectType = ".NET";
    else if (hasAngular) projectType = "Angular";
  } catch {}

  if (projectType) parts.push(projectType);

  // Git branch
  try {
    const branch = execSync("git branch --show-current", {
      cwd,
      encoding: "utf8",
      timeout: 3000,
    }).trim();
    if (branch) parts.push(branch);
  } catch {}

  // Uncommitted changes count
  try {
    const status = execSync("git status --porcelain", {
      cwd,
      encoding: "utf8",
      timeout: 3000,
    }).trim();
    if (status) {
      const count = status.split("\n").length;
      parts.push(`${count} pending`);
    }
  } catch {}

  // OpenAPI contract exists?
  if (fs.existsSync(path.join(cwd, ".cloud", "contracts", "openapi.yaml"))) {
    parts.push("OpenAPI");
  }

  process.stdout.write(parts.join(" | "));
} catch {
  process.stdout.write("Factoria");
}
