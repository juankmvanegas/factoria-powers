#!/usr/bin/env node
/**
 * guard-branch-naming.cjs — Hook PreToolUse (Bash)
 *
 * Enforces branch naming convention on git checkout -b / git branch commands.
 * Format: type/descriptive-name
 * Types: feature, fix, hotfix, release, refactor, chore, docs, test
 *
 * Exit 0 = allow, Exit 2 = block (stderr = reason)
 */

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const command = input.tool_input.command || "";

    // Only check branch creation commands
    const isCheckoutB = command.match(
      /git\s+checkout\s+-b\s+["']?([^\s"']+)["']?/
    );
    const isBranchCreate = command.match(
      /git\s+branch\s+(?!-[dDm])["']?([^\s"']+)["']?/
    );
    const isSwitchC = command.match(
      /git\s+switch\s+-c\s+["']?([^\s"']+)["']?/
    );

    const match = isCheckoutB || isBranchCreate || isSwitchC;
    if (!match) {
      process.exit(0);
    }

    const branchName = match[1];

    // Allow special branches
    const specialBranches = [
      "main",
      "master",
      "develop",
      "integracion",
      "staging",
      "production",
    ];
    if (specialBranches.includes(branchName.toLowerCase())) {
      process.exit(0);
    }

    // Validate branch naming convention
    const validPrefixes = [
      "feature",
      "fix",
      "hotfix",
      "release",
      "refactor",
      "chore",
      "docs",
      "test",
      "bugfix",
    ];
    const pattern = new RegExp(
      `^(${validPrefixes.join("|")})/[a-z0-9][a-z0-9-]*[a-z0-9]$`
    );

    if (!pattern.test(branchName)) {
      process.stderr.write(
        `BRANCH NAMING CONVENTION — BLOCKED\n\n` +
          `Branch: "${branchName}"\n\n` +
          `Branches must follow the format: type/descriptive-name\n\n` +
          `Valid prefixes: ${validPrefixes.join(", ")}\n\n` +
          `Rules:\n` +
          `  - Lowercase only\n` +
          `  - Use hyphens to separate words\n` +
          `  - No uppercase, spaces, or special characters\n\n` +
          `Examples:\n` +
          `  feature/notes-crud-endpoints\n` +
          `  fix/auth-token-refresh\n` +
          `  hotfix/payment-null-reference\n` +
          `  refactor/services-di-cleanup\n` +
          `  release/v1.2.0`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
