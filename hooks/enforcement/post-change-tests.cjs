#!/usr/bin/env node
/**
 * post-change-tests.js — Hook PostToolUse (Edit/Write)
 *
 * After code changes, outputs reminders about what tests/validations
 * need to run. stdout is shown as guidance to Claude.
 *
 * This hook does NOT block — it provides actionable guidance.
 */

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
      filePath.endsWith(".md")
    ) {
      process.exit(0);
    }

    const reminders = [];
    const pathLower = filePath.toLowerCase();

    // ════════════════════════════════════════════
    // .NET code changes
    // ════════════════════════════════════════════
    if (filePath.endsWith(".cs")) {
      // Always run architecture tests after .NET changes
      reminders.push(
        "Run Architecture Tests: dotnet test on Tests/Architecture.Tests/"
      );

      if (pathLower.includes("/application/") && pathLower.includes("/services/")) {
        reminders.push(
          "Run Unit Tests for the affected service in Tests/Unit.Tests/Application/"
        );
      }

      if (pathLower.includes("/infrastructure/")) {
        reminders.push(
          "Run Integration Tests if available in Tests/Integration.Tests/"
        );
      }

      if (pathLower.includes("/controllers/") || pathLower.includes("/validators/")) {
        reminders.push(
          "Verify FluentValidation rules match the controller's expected input"
        );
      }

      if (
        pathLower.includes("dependencyinjection.cs") ||
        pathLower.includes("servicesconfiguration.cs")
      ) {
        reminders.push(
          "Verify DI registration: all new services/adapters must be registered"
        );
      }
    }

    // ════════════════════════════════════════════
    // Angular code changes
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts")) {
      if (pathLower.includes("/application/") && pathLower.includes("/services/")) {
        reminders.push(
          "Run tests: ng test --watch=false for the affected service spec"
        );
      }

      if (pathLower.includes("/infrastructure/")) {
        reminders.push(
          "Run tests for the affected adapter spec file"
        );
      }

      if (
        pathLower.includes("/presentation/") &&
        (pathLower.includes("/views/") || pathLower.includes("/pages/"))
      ) {
        reminders.push(
          "Consider visual validation with /playwright-cli if UI changed"
        );
      }

      if (pathLower.includes(".module.ts")) {
        reminders.push(
          "Verify module declarations and imports are correct: ng build"
        );
      }

      if (pathLower.includes("/styles/") || filePath.endsWith(".scss") || filePath.endsWith(".css")) {
        reminders.push(
          "ITCSS change: verify correct layer (_settings, _tools, _generic, _elements, _objects, _components, _trumps)"
        );
      }
    }

    // ════════════════════════════════════════════
    // Configuration changes
    // ════════════════════════════════════════════
    if (filePath.endsWith(".csproj") || filePath.endsWith(".props")) {
      reminders.push(
        "Package change: run dotnet restore && dotnet build to verify compatibility"
      );
    }

    if (filePath.endsWith("package.json")) {
      reminders.push(
        "Package change: run npm install && ng build to verify compatibility"
      );
    }

    if (filePath.endsWith("angular.json") || filePath.endsWith("tsconfig.json")) {
      reminders.push(
        "Config change: run ng build --configuration production to verify"
      );
    }

    // ════════════════════════════════════════════
    // Universal reminders
    // ════════════════════════════════════════════
    if (reminders.length > 0) {
      // Always remind about CHANGELOG
      reminders.push(
        "Update CHANGELOG.md if this change adds, modifies, or fixes a feature"
      );

      const output =
        `[post-change-tests] Code changed: ${filePath.split("/").pop()}\n` +
        `Pending validations:\n` +
        reminders.map((r) => `  - ${r}`).join("\n");

      process.stdout.write(output);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
