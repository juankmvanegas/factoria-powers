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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function hasDep(deps, name) {
  return deps && (deps[name] !== undefined);
}

// Detect factory from cwd — mirrors hooks/session-start detection order
function detectProject(cwd) {
  const files = (() => {
    try { return fs.readdirSync(cwd); } catch { return []; }
  })();

  const has = (name) => files.includes(name);
  const hasExt = (ext) => files.some((f) => f.endsWith(ext));

  // .NET
  if (hasExt(".sln") || hasExt(".csproj") || has("Program.cs")) {
    const hasAngular = has("angular.json");
    if (hasAngular) return "net+ang";
    return "net";
  }

  // Databricks / DataEng (before pytml/pyt to avoid false positives)
  if (has("databricks.yml") || has("dlt.yml")) return "dataeng";

  // MLOps (pytml) before plain pyt
  if (has("dvc.yaml")) return "pytml";

  // Python packages — check pyproject.toml and requirements.txt
  const pyproject = readJson(path.join(cwd, "pyproject.toml"));
  const reqs = (() => {
    try { return fs.readFileSync(path.join(cwd, "requirements.txt"), "utf8"); } catch { return ""; }
  })();
  if (pyproject || reqs) {
    const allText = JSON.stringify(pyproject || {}) + reqs;
    if (allText.includes("mlflow") || allText.includes("dvc")) return "pytml";
    if (allText.includes("pyspark") || allText.includes("delta-spark")) return "dataeng";
    if (allText.includes("fastapi") || has("main.py")) return "pyt";
  }
  if (has("main.py")) return "pyt";

  // NestJS
  const pkg = readJson(path.join(cwd, "package.json"));
  if (hasDep(pkg?.dependencies, "@nestjs/core") || hasDep(pkg?.devDependencies, "@nestjs/core")) return "nest";

  // Angular
  if (has("angular.json")) return "ang";
  if (hasDep(pkg?.dependencies, "@angular/core") || hasDep(pkg?.devDependencies, "@angular/core")) return "ang";

  // iOS / Swift
  if (hasExt(".swift") || has("Package.swift") || hasExt(".xcodeproj") || hasExt(".xcworkspace")) return "swf";

  // WordPress
  if ((has("theme.json") && has("functions.php") && has("style.css")) || has("wp-content")) return "wps";

  // Kotlin / Android
  if (has("build.gradle.kts") || has("AndroidManifest.xml") || hasExt(".kt")) return "kot";

  return "unknown";
}

const FACTORY_LABEL = {
  net:    ".NET / C# — Clean Architecture",
  ang:    "Angular — Clean Architecture",
  "net+ang": "Full Stack — .NET + Angular",
  nest:   "NestJS BFF — Clean Architecture",
  pyt:    "Python FastAPI — Clean Architecture",
  pytml:  "Python MLOps — FastAPI + DVC + MLflow",
  dataeng:"Databricks / PySpark / Delta / Medallion",
  kot:    "Android / Kotlin — MVVM",
  swf:    "iOS / Swift — MVVM + SPM",
  wps:    "WordPress — Block Theme / FSE / Gutenberg",
  unknown:"Unknown — factory context not yet loaded",
};

function findOpenAPI(cwd) {
  const candidates = [
    ".cloud/contracts/openapi.yaml",
    ".cloud/contracts/openapi.yml",
    ".cloud/contracts/openapi.json",
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(cwd, c))) return c;
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
    const factory = detectProject(cwd);
    const openapi = findOpenAPI(cwd);
    const changelog = findChangelog(cwd);

    const lines = [];
    lines.push(`[Factoria Auto-Primer] Session started`);
    lines.push(`  Working directory: ${cwd}`);
    lines.push(`  Detected factory: ${factory}`);
    lines.push(`  Stack: ${FACTORY_LABEL[factory] || factory}`);

    if (openapi) {
      lines.push(`  OpenAPI contract: ${openapi}`);
    }

    if (changelog) {
      lines.push(`  CHANGELOG: ${changelog}`);
    }

    // Check for active migration
    const migrationPlan = path.join(cwd, ".cloud", "planning", "migration-plan.md");
    if (fs.existsSync(migrationPlan)) {
      lines.push(`  Active migration plan detected at .cloud/planning/migration-plan.md`);
    }

    lines.push(``);
    lines.push(`  Factory context will be loaded via the using-factoria skill.`);

    process.stdout.write(lines.join("\n"));
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
