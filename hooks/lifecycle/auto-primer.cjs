#!/usr/bin/env node
/**
 * auto-primer.cjs — Hook SessionStart
 *
 * At session start, detects the project type and outputs context
 * so Claude has immediate awareness of what it's working on.
 *
 * Outputs project summary via stdout (injected as context).
 */

const fs = require("fs");
const path = require("path");

// Try to detect project type from common files
function detectProject(cwd) {
  const checks = {
    dotnet: [".sln", ".csproj", "Program.cs"],
    angular: ["angular.json"],
    both: [],
  };

  let hasDotnet = false;
  let hasAngular = false;

  try {
    const files = fs.readdirSync(cwd);
    hasDotnet = files.some(
      (f) =>
        f.endsWith(".sln") || f.endsWith(".csproj") || f === "Program.cs"
    );
    hasAngular = files.some((f) => f === "angular.json");
  } catch {}

  // Also check src/ subdirectory
  try {
    const srcFiles = fs.readdirSync(path.join(cwd, "src"));
    if (
      srcFiles.some(
        (f) => f === "presentation" || f === "infrastructure" || f === "application"
      )
    ) {
      hasAngular = true;
    }
  } catch {}

  if (hasDotnet && hasAngular) return "fullstack";
  if (hasDotnet) return "dotnet";
  if (hasAngular) return "angular";
  return "unknown";
}

function findOpenAPI(cwd) {
  const candidates = [
    ".cloud/contracts/openapi.yaml",
    ".cloud/contracts/openapi.yml",
    ".cloud/contracts/openapi.json",
  ];
  for (const c of candidates) {
    const p = path.join(cwd, c);
    if (fs.existsSync(p)) return c;
  }
  return null;
}

function findChangelog(cwd) {
  const p = path.join(cwd, "CHANGELOG.md");
  if (fs.existsSync(p)) {
    try {
      const content = fs.readFileSync(p, "utf8");
      const firstEntry = content.match(/^## .*/m);
      return firstEntry ? firstEntry[0] : "exists";
    } catch {}
  }
  return null;
}

// Main
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const cwd = process.cwd();
    const projectType = detectProject(cwd);
    const openapi = findOpenAPI(cwd);
    const changelog = findChangelog(cwd);

    const lines = [];
    lines.push(`[Factoria Auto-Primer] Session started`);
    lines.push(`  Working directory: ${cwd}`);

    if (projectType === "dotnet") {
      lines.push(`  Project type: .NET (Backend)`);
      lines.push(`  Factory: Factoria-Net`);
    } else if (projectType === "angular") {
      lines.push(`  Project type: Angular (Frontend)`);
      lines.push(`  Factory: Factoria-Ang`);
    } else if (projectType === "fullstack") {
      lines.push(`  Project type: Full Stack (.NET + Angular)`);
      lines.push(`  Factory: Factoria (Orchestrator)`);
    } else {
      lines.push(`  Project type: Not detected (may be the Factoria MCP server repo)`);
    }

    if (openapi) {
      lines.push(`  OpenAPI contract: ${openapi}`);
    }

    if (changelog) {
      lines.push(`  CHANGELOG: ${changelog}`);
    }

    // Check for .cloud/audit/ to see if there's history
    const auditDir = path.join(cwd, ".cloud", "audit");
    if (fs.existsSync(auditDir)) {
      try {
        const auditFiles = fs.readdirSync(auditDir);
        if (auditFiles.length > 0) {
          lines.push(`  Audit trail: ${auditFiles.length} entries in .cloud/audit/`);
        }
      } catch {}
    }

    // Check for active migration
    const migrationPlan = path.join(cwd, ".cloud", "planning", "migration-plan.md");
    if (fs.existsSync(migrationPlan)) {
      lines.push(`  Active migration plan detected at .cloud/planning/migration-plan.md`);
    }

    lines.push(``);
    lines.push(`  Reminder: Use /orchestrate for structured workflows, or ask directly for quick tasks.`);

    process.stdout.write(lines.join("\n"));
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
