#!/usr/bin/env node
/**
 * guard-import-aliases.cjs — Hook PreToolUse (Edit/Write)
 *
 * Blocks relative imports in Angular and NestJS projects when path aliases exist.
 * Angular: @application/, @infraestructure/, @presentation/, @libs/
 * NestJS:  @api/, @infrastructure/, @application/, @libs/
 *
 * Exit 0 = allow, Exit 2 = block (stderr = reason)
 */

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");
    const content =
      input.tool_input.content || input.tool_input.new_string || "";

    // Only check Angular TypeScript files
    if (!filePath.endsWith(".ts") || filePath.endsWith(".spec.ts")) {
      process.exit(0);
    }

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

    // Only enforce in Angular or NestJS layer directories
    const isAngularLayer =
      pathLower.includes("/presentation/") ||
      pathLower.includes("/infrastructure/") ||
      pathLower.includes("/application/");

    // Detect NestJS context
    const isNestLayer =
      pathLower.includes("/api/") ||
      pathLower.includes("/infrastructure/") ||
      pathLower.includes("/application/");

    const isNestContext = content.includes("@nestjs/") ||
      content.includes("@Injectable") ||
      content.includes("@Controller") ||
      content.includes("@Module");

    if (!isAngularLayer && !isNestLayer) {
      process.exit(0);
    }

    // Extract import paths
    const imports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
    const violations = [];

    for (const imp of imports) {
      const importPath = imp
        .replace(/from\s+['"]/, "")
        .replace(/['"]/, "");

      // Skip node_modules imports (no dot prefix)
      if (!importPath.startsWith(".")) continue;

      // Allow relative imports within the SAME directory (./sibling)
      if (importPath.startsWith("./") && !importPath.includes("/..")) continue;

      // Block ../ imports that cross layer boundaries
      if (importPath.includes("..")) {
        // Check if crossing into another layer
        const crossesLayer =
          importPath.includes("../presentation") ||
          importPath.includes("../infrastructure") ||
          importPath.includes("../application") ||
          importPath.includes("../api") ||
          importPath.includes("../libs") ||
          importPath.includes("../../") || // 2+ levels up likely crosses layers
          importPath.includes("../../../");

        if (crossesLayer) {
          // Suggest the correct alias based on context
          let suggestion = importPath;
          if (importPath.includes("application"))
            suggestion = importPath.replace(/.*application/, isNestContext ? "@application" : "@application");
          else if (importPath.includes("infrastructure"))
            suggestion = importPath.replace(
              /.*infrastructure/,
              isNestContext ? "@infrastructure" : "@infraestructure"
            );
          else if (importPath.includes("presentation"))
            suggestion = importPath.replace(/.*presentation/, "@presentation");
          else if (importPath.includes("api"))
            suggestion = importPath.replace(/.*api/, "@api");
          else if (importPath.includes("libs"))
            suggestion = importPath.replace(/.*libs/, "@libs");

          violations.push(
            `  "${importPath}" → use "${suggestion}" instead`
          );
        }
      }
    }

    if (violations.length > 0) {
      const aliasesHelp = isNestContext
        ? `Available aliases (NestJS):\n` +
          `  @api/*            → src/api/*\n` +
          `  @infrastructure/* → src/infrastructure/*\n` +
          `  @application/*    → src/application/*\n` +
          `  @libs/*           → src/libs/*`
        : `Available aliases (Angular):\n` +
          `  @application/*    → src/application/*\n` +
          `  @infraestructure/* → src/infrastructure/*\n` +
          `  @presentation/*   → src/presentation/*\n` +
          `  @libs/*           → src/libs/*`;

      process.stderr.write(
        `IMPORT ALIAS VIOLATION — BLOCKED\n\n` +
          `File: ${filePath}\n\n` +
          `Relative imports that cross layer boundaries are not allowed.\n` +
          `Use path aliases instead:\n\n` +
          violations.join("\n") +
          `\n\n` +
          aliasesHelp
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
