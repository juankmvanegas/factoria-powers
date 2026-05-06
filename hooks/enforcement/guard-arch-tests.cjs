#!/usr/bin/env node
/**
 * guard-arch-tests.cjs — Hook PreToolUse (Edit/Write)
 *
 * Blocks modifications to Architecture.Tests files.
 * Architecture tests are the CI/CD pipeline gates — they are immutable.
 * When they fail, the production code must be fixed, NEVER the tests.
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

    // Block edits to Architecture.Tests files
    if (
      pathLower.includes("/architecture.tests/") ||
      pathLower.includes("/architecturetests/") ||
      pathLower.includes("/architecture tests/")
    ) {
      process.stderr.write(
        `ARCHITECTURE TESTS ARE IMMUTABLE — BLOCKED\n\n` +
          `You are trying to modify: ${filePath}\n\n` +
          `Architecture tests represent the CI/CD pipeline gates.\n` +
          `They validate that the code complies with Clean Architecture rules (ADR-001, ADR-012).\n\n` +
          `If an architecture test fails:\n` +
          `  1. Read the test to understand which rule is being violated\n` +
          `  2. Fix the PRODUCTION CODE to comply with the rule\n` +
          `  3. Re-run the tests to verify\n\n` +
          `NEVER modify, weaken, or delete architecture tests to make them pass.\n` +
          `These tests exist because the pipeline enforces them — changing them here\n` +
          `will only cause the build to fail in CI/CD.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
