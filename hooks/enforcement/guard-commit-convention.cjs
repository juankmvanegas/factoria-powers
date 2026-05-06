#!/usr/bin/env node
/**
 * guard-commit-convention.cjs — Hook PreToolUse (Bash)
 *
 * Enforces Conventional Commits format on git commit commands.
 * Format: type(scope): description
 * Types: feat, fix, refactor, docs, test, chore, build, ci, perf, style
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

    // Only check git commit commands
    if (!command.includes("git commit")) {
      process.exit(0);
    }

    // Skip amend, merge commits, and commands without -m
    if (
      command.includes("--amend") ||
      command.includes("merge") ||
      !command.includes("-m")
    ) {
      process.exit(0);
    }

    // Extract commit message — handle both -m "msg" and HEREDOC patterns
    let message = "";

    // Pattern: -m "message" or -m 'message'
    const simpleMatch = command.match(/-m\s+["']([^"']*?)["']/);
    if (simpleMatch) {
      message = simpleMatch[1];
    }

    // Pattern: HEREDOC with cat <<'EOF'
    const heredocMatch = command.match(
      /cat\s+<<\s*'?EOF'?\s*\n([\s\S]*?)\nEOF/
    );
    if (heredocMatch) {
      message = heredocMatch[1].trim().split("\n")[0]; // First line
    }

    if (!message) {
      process.exit(0); // Can't parse, allow
    }

    // Get first line of message
    const firstLine = message.split("\n")[0].trim();

    // Conventional Commits regex
    const validTypes = [
      "feat",
      "fix",
      "refactor",
      "docs",
      "test",
      "chore",
      "build",
      "ci",
      "perf",
      "style",
      "revert",
    ];
    const pattern = new RegExp(
      `^(${validTypes.join("|")})(\\([a-z0-9-]+\\))?(!)?:\\s.+`,
      "i"
    );

    if (!pattern.test(firstLine)) {
      process.stderr.write(
        `COMMIT MESSAGE CONVENTION — BLOCKED\n\n` +
          `Message: "${firstLine}"\n\n` +
          `Commits must follow Conventional Commits format:\n` +
          `  type(scope): description\n\n` +
          `Valid types: ${validTypes.join(", ")}\n\n` +
          `Examples:\n` +
          `  feat(notes): add CRUD endpoints for notes entity\n` +
          `  fix(auth): resolve token refresh race condition\n` +
          `  refactor(services): extract common validation logic\n` +
          `  docs(changelog): update for v1.2.0 release\n` +
          `  test(notes): add unit tests for NotesService\n\n` +
          `Breaking changes: add ! before colon → feat(api)!: remove deprecated endpoint`
      );
      process.exit(2);
    }

    // Warn if message is too short
    const descPart = firstLine.replace(/^[^:]+:\s*/, "");
    if (descPart.length < 10) {
      process.stderr.write(
        `COMMIT MESSAGE TOO SHORT — BLOCKED\n\n` +
          `Message: "${firstLine}"\n` +
          `Description "${descPart}" is too short (${descPart.length} chars, minimum 10).\n\n` +
          `Write a meaningful description of WHAT changed and WHY.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
