#!/usr/bin/env node
/**
 * guard-secrets.js — Hook PreToolUse (Edit/Write)
 *
 * Detects hardcoded secrets in code: connection strings, API keys,
 * passwords, tokens, private keys. Enforces Azure Key Vault policy.
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

    // Skip non-code files and config locations
    if (
      filePath.includes("/Factoria/") ||
      filePath.includes("/node_modules/") ||
      filePath.includes("/.claude/") ||
      filePath.includes("/.git/") ||
      filePath.includes("/.cloud/") ||
      filePath.endsWith(".md") ||
      filePath.endsWith(".sample")
    ) {
      process.exit(0);
    }

    // Only check source code files
    const codeExtensions = [
      ".cs",
      ".ts",
      ".js",
      ".json",
      ".yaml",
      ".yml",
      ".xml",
      ".config",
      ".env",
    ];
    const ext = "." + (filePath.split(".").pop() || "").toLowerCase();
    if (!codeExtensions.includes(ext)) {
      process.exit(0);
    }

    // Allow test configuration files with in-memory DB
    const pathLower = filePath.toLowerCase();
    if (
      pathLower.includes("/tests/") ||
      pathLower.includes(".tests/") ||
      pathLower.includes(".spec.")
    ) {
      process.exit(0);
    }

    const violations = [];

    // ════════════════════════════════════════════
    // Connection Strings
    // ════════════════════════════════════════════
    const connStringPatterns = [
      /Server\s*=\s*[^;{}\s]+;.*(?:Database|Initial Catalog)\s*=/i,
      /Data\s+Source\s*=\s*[^;{}\s]+/i,
      /mongodb(\+srv)?:\/\/[^"'\s{}<>]+/i,
      /postgres(?:ql)?:\/\/[^"'\s{}<>]+/i,
      /mysql:\/\/[^"'\s{}<>]+/i,
    ];

    // Don't flag placeholder/template connection strings
    const isPlaceholder = (match) =>
      /\{.*\}|\$\(|%\w+%|<.*>|TODO|PLACEHOLDER|example\.com|localhost/i.test(
        match
      );

    for (const pattern of connStringPatterns) {
      const match = content.match(pattern);
      if (match && !isPlaceholder(match[0])) {
        // Allow appsettings.Development.json with localhost
        if (
          pathLower.includes("appsettings") &&
          /localhost|127\.0\.0\.1|\(localdb\)/i.test(match[0])
        ) {
          continue;
        }
        violations.push(
          `[Secrets] Hardcoded connection string detected.\n` +
            `  File: ${filePath}\n` +
            `  Match: ${match[0].substring(0, 80)}...\n` +
            `  Rule: Use Azure Key Vault or User Secrets — NEVER hardcode (Security Policy)`
        );
      }
    }

    // ════════════════════════════════════════════
    // API Keys & Tokens
    // ════════════════════════════════════════════
    const secretPatterns = [
      {
        name: "API Key assignment",
        regex:
          /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["'][A-Za-z0-9+/=_-]{16,}["']/i,
      },
      {
        name: "Bearer token",
        regex: /["']Bearer\s+[A-Za-z0-9._-]{20,}["']/i,
      },
      {
        name: "Private key (PEM)",
        regex: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/,
      },
      {
        name: "AWS access key",
        regex: /AKIA[0-9A-Z]{16}/,
      },
      {
        name: "Azure storage key",
        regex:
          /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{44,}/,
      },
      {
        name: "Password assignment",
        regex:
          /(?:password|passwd|pwd|secret)\s*[:=]\s*["'][^"'{$<%\s]{8,}["']/i,
      },
      {
        name: "Subscription key header",
        regex:
          /["'](?:Ocp-Apim-Subscription-Key|x-api-key)["']\s*[:=,]\s*["'][A-Za-z0-9]{16,}["']/i,
      },
    ];

    for (const { name, regex } of secretPatterns) {
      const match = content.match(regex);
      if (match && !isPlaceholder(match[0])) {
        violations.push(
          `[Secrets] ${name} detected.\n` +
            `  File: ${filePath}\n` +
            `  Match: ${match[0].substring(0, 60)}...\n` +
            `  Rule: Use Azure Key Vault for secrets — NEVER in code (Security Policy)`
        );
      }
    }

    // ════════════════════════════════════════════
    // .env files should not be created
    // ════════════════════════════════════════════
    if (filePath.endsWith(".env") && input.tool_name === "Write") {
      violations.push(
        `[Secrets] Creating .env files is discouraged.\n` +
          `  File: ${filePath}\n` +
          `  Rule: Use Azure Key Vault or User Secrets for configuration`
      );
    }

    // — Result —
    if (violations.length > 0) {
      process.stderr.write(
        `SECRETS DETECTION — BLOCKED\n\n${violations.join("\n\n")}\n\n` +
          `Fix: Move secrets to Azure Key Vault, User Secrets, or environment variables.\n` +
          `Use configuration["Key"] or IConfiguration to read secrets at runtime.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
