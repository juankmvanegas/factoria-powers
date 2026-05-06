#!/usr/bin/env node
/**
 * guard-openapi-drift.cjs — Hook PostToolUse (Edit/Write)
 *
 * After modifying Controllers, DTOs, or Adapters, warns about
 * potential OpenAPI contract drift. Reminds to run /sync-contracts.
 *
 * Outputs guidance (does not block).
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
      filePath.includes("/.git/")
    ) {
      process.exit(0);
    }

    const pathLower = filePath.toLowerCase();
    const fileName = filePath.split("/").pop() || "";
    const warnings = [];

    // ════════════════════════════════════════════
    // .NET — Controller or DTO changes
    // ════════════════════════════════════════════
    if (filePath.endsWith(".cs")) {
      if (pathLower.includes("/controllers/")) {
        warnings.push(
          `[OpenAPI Drift] Controller modified: ${fileName}\n` +
            `  Changes to controllers (routes, parameters, response types) may cause OpenAPI drift.\n` +
            `  Action: Run /sync-contracts to verify alignment with openapi.yaml`
        );
      }

      if (pathLower.includes("/dtos/")) {
        warnings.push(
          `[OpenAPI Drift] DTO modified: ${fileName}\n` +
            `  Changes to DTOs (Input/Output) may cause contract drift with frontend.\n` +
            `  Action: Run /sync-contracts to verify alignment with openapi.yaml`
        );
      }
    }

    // ════════════════════════════════════════════
    // Angular — Adapter or DTO changes
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) {
      if (pathLower.includes("/api-bff/")) {
        warnings.push(
          `[OpenAPI Drift] HTTP adapter modified: ${fileName}\n` +
            `  Changes to API adapters (endpoints, methods, params) may cause contract drift with backend.\n` +
            `  Action: Run /sync-contracts to verify alignment with openapi.yaml`
        );
      }

      if (pathLower.includes("/dtos/")) {
        const isInput = fileName.includes(".input.");
        const isOutput = fileName.includes(".output.");
        if (isInput || isOutput) {
          warnings.push(
            `[OpenAPI Drift] DTO modified: ${fileName}\n` +
              `  Changes to ${isInput ? "input" : "output"} DTOs may cause contract drift.\n` +
              `  Action: Run /sync-contracts to verify alignment with openapi.yaml`
          );
        }
      }
    }

    // ════════════════════════════════════════════
    // OpenAPI spec itself changed
    // ════════════════════════════════════════════
    if (
      fileName === "openapi.yaml" ||
      fileName === "openapi.json" ||
      fileName === "openapi.yml"
    ) {
      warnings.push(
        `[OpenAPI Contract] The OpenAPI spec was modified: ${fileName}\n` +
          `  CRITICAL: Both backend and frontend must be updated to match.\n` +
          `  Actions:\n` +
          `    1. Run /sync-contracts to check what code needs updating\n` +
          `    2. Version the change in openapi-history/\n` +
          `    3. Get user approval for contract changes`
      );
    }

    if (warnings.length > 0) {
      process.stdout.write(warnings.join("\n\n"));
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
