#!/usr/bin/env node
/**
 * guard-golden-path.js — Hook PreToolUse (Edit/Write)
 *
 * Ensures no packages outside the approved Golden Path stack
 * are introduced without an ADR. Checks .csproj and package.json.
 *
 * Exit 0 = allow, Exit 2 = block (stderr = reason)
 */

// ════════════════════════════════════════════
// Approved packages — Golden Path
// ════════════════════════════════════════════

const DOTNET_APPROVED = new Set([
  // Framework & Core
  "microsoft.aspnetcore",
  "microsoft.extensions",
  "microsoft.entityframeworkcore",
  "microsoft.entityframeworkcore.sqlserver",
  "microsoft.entityframeworkcore.design",
  "microsoft.entityframeworkcore.tools",
  "microsoft.entityframeworkcore.inmemory",
  "microsoft.entityframeworkcore.relational",
  "microsoft.entityframeworkcore.proxies",
  // Dapper
  "dapper",
  // MongoDB
  "mongodb.driver",
  // gRPC
  "grpc.aspnetcore",
  "grpc.tools",
  "google.protobuf",
  // Azure Service Bus
  "azure.messaging.servicebus",
  // Azure Key Vault
  "azure.extensions.aspnetcore.configuration.secrets",
  "azure.identity",
  "azure.security.keyvault.secrets",
  // Validation
  "fluentvalidation",
  "fluentvalidation.aspnetcore",
  "fluentvalidation.dependencyinjectionextensions",
  // Mapping
  "automapper",
  "automapper.extensions.microsoft.dependencyinjection",
  // Observability
  "opentelemetry",
  "opentelemetry.api",
  "opentelemetry.extensions.hosting",
  "opentelemetry.instrumentation.aspnetcore",
  "opentelemetry.instrumentation.http",
  "opentelemetry.exporter.otlp",
  "opentelemetry.exporter.console",
  "serilog",
  "serilog.aspnetcore",
  "serilog.sinks.console",
  "serilog.sinks.file",
  "serilog.extensions.logging",
  // Jobs
  "hangfire",
  "hangfire.core",
  "hangfire.aspnetcore",
  "hangfire.sqlserver",
  "coravel",
  // Testing
  "xunit",
  "xunit.runner.visualstudio",
  "microsoft.net.test.sdk",
  "moq",
  "fluentassertions",
  "netarchtest.rules",
  "coverlet.collector",
  // SC Config
  "sc.configuration.provider.mongo",
  // Swagger
  "swashbuckle.aspnetcore",
  // Polly (retry policies)
  "polly",
  "microsoft.extensions.http.polly",
  // Newtonsoft (common)
  "newtonsoft.json",
  "microsoft.aspnetcore.mvc.newtonsoftjson",
]);

const ANGULAR_APPROVED = new Set([
  // Core Angular
  "@angular/core",
  "@angular/common",
  "@angular/compiler",
  "@angular/forms",
  "@angular/platform-browser",
  "@angular/platform-browser-dynamic",
  "@angular/router",
  "@angular/animations",
  "@angular/cdk",
  "@angular/material",
  "@angular/cli",
  "@angular/compiler-cli",
  "@angular-devkit/build-angular",
  // MSAL
  "@azure/msal-angular",
  "@azure/msal-browser",
  // Module Federation
  "@angular-architects/module-federation",
  "@angular-architects/module-federation-tools",
  "ngx-build-plus",
  // Testing
  "karma",
  "karma-chrome-launcher",
  "karma-coverage",
  "karma-jasmine",
  "karma-jasmine-html-reporter",
  "jasmine-core",
  "ng-mocks",
  "@types/jasmine",
  // Linting
  "eslint",
  "@angular-eslint/builder",
  "@angular-eslint/eslint-plugin",
  "@angular-eslint/eslint-plugin-template",
  "@angular-eslint/schematics",
  "@angular-eslint/template-parser",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  // TypeScript & tools
  "typescript",
  "tslib",
  "rxjs",
  "zone.js",
  // Common utilities
  "lodash",
  "moment",
  "date-fns",
]);

const NESTJS_APPROVED = new Set([
  // NestJS Core
  "@nestjs/core",
  "@nestjs/common",
  "@nestjs/platform-express",
  "@nestjs/swagger",
  "@nestjs/config",
  "@nestjs/axios",
  "@nestjs/microservices",
  "@nestjs/testing",
  // gRPC
  "@grpc/grpc-js",
  "@grpc/proto-loader",
  // Validation
  "class-validator",
  "class-transformer",
  // HTTP Client
  "axios",
  // Azure
  "@azure/keyvault-secrets",
  "@azure/identity",
  // Observability
  "@opentelemetry/sdk-node",
  "@opentelemetry/api",
  "@opentelemetry/sdk-trace-node",
  "@opentelemetry/sdk-metrics",
  "@opentelemetry/exporter-trace-otlp-http",
  "@opentelemetry/exporter-metrics-otlp-http",
  "@opentelemetry/instrumentation-http",
  "@opentelemetry/instrumentation-nestjs-core",
  "@opentelemetry/resources",
  "@opentelemetry/semantic-conventions",
  // Documentation
  "@compodoc/compodoc",
  // Swagger
  "js-yaml",
  // Reactive
  "rxjs",
  // Testing
  "jest",
  "@types/jest",
  "ts-jest",
  "@golevelup/ts-jest",
  "@nestjs/cli",
  "@nestjs/schematics",
  // Linting & Formatting
  "eslint",
  "prettier",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  // TypeScript & tools
  "typescript",
  "tslib",
  "ts-node",
  "ts-loader",
  // Node types
  "@types/node",
  "@types/express",
  // Reflect metadata
  "reflect-metadata",
  // Source maps
  "source-map-support",
]);

const NESTJS_ALLOWED_PREFIXES = [
  "@nestjs/",
  "@opentelemetry/",
  "@azure/",
  "@types/",
  "@grpc/",
];

function isNestjsApproved(pkg) {
  const lower = pkg.toLowerCase();
  if (NESTJS_APPROVED.has(lower)) return true;
  return NESTJS_ALLOWED_PREFIXES.some((p) => lower.startsWith(p));
}

// Prefixes that are always allowed (Microsoft.*, System.*, etc.)
const DOTNET_ALLOWED_PREFIXES = [
  "microsoft.",
  "system.",
  "azure.",
];

const ANGULAR_ALLOWED_PREFIXES = [
  "@angular/",
  "@angular-devkit/",
  "@types/",
];

function isDotnetApproved(pkg) {
  const lower = pkg.toLowerCase();
  if (DOTNET_APPROVED.has(lower)) return true;
  return DOTNET_ALLOWED_PREFIXES.some((p) => lower.startsWith(p));
}

function isAngularApproved(pkg) {
  const lower = pkg.toLowerCase();
  if (ANGULAR_APPROVED.has(lower)) return true;
  return ANGULAR_ALLOWED_PREFIXES.some((p) => lower.startsWith(p));
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");
    const content =
      input.tool_input.content || input.tool_input.new_string || "";

    // Skip non-project files
    if (
      filePath.includes("/Factoria/") ||
      filePath.includes("/node_modules/") ||
      filePath.includes("/.claude/") ||
      filePath.includes("/.git/")
    ) {
      process.exit(0);
    }

    const violations = [];

    // ════════════════════════════════════════════
    // .NET — Check .csproj for unapproved PackageReferences
    // ════════════════════════════════════════════
    if (filePath.endsWith(".csproj") || filePath.endsWith(".props")) {
      const packageRefs =
        content.match(/PackageReference\s+Include="([^"]+)"/gi) || [];
      for (const ref of packageRefs) {
        const match = ref.match(/Include="([^"]+)"/i);
        if (match) {
          const pkg = match[1];
          if (!isDotnetApproved(pkg)) {
            violations.push(
              `[Golden Path] Unapproved NuGet package: "${pkg}".\n` +
                `  File: ${filePath}\n` +
                `  Rule: No packages outside the Golden Path without an approved ADR.\n` +
                `  Action: Create an ADR with /generate-adr to justify this dependency.`
            );
          }
        }
      }
    }

    // ════════════════════════════════════════════
    // Angular / NestJS — Check package.json for unapproved dependencies
    // ════════════════════════════════════════════
    if (filePath.endsWith("package.json") && !filePath.includes("/node_modules/")) {
      try {
        const pkg = JSON.parse(content);
        const allDeps = {
          ...pkg.dependencies,
          ...pkg.devDependencies,
        };

        // Detect if this is a NestJS project
        const isNestProject = allDeps["@nestjs/core"] !== undefined ||
          allDeps["@nestjs/common"] !== undefined;

        const approvalFn = isNestProject ? isNestjsApproved : isAngularApproved;
        const projectType = isNestProject ? "NestJS" : "Angular";

        for (const dep of Object.keys(allDeps)) {
          if (!approvalFn(dep)) {
            violations.push(
              `[Golden Path] Unapproved npm package: "${dep}" (${projectType} project).\n` +
                `  File: ${filePath}\n` +
                `  Rule: No packages outside the Golden Path without an approved ADR.\n` +
                `  Action: Create an ADR with /generate-adr to justify this dependency.`
            );
          }
        }
      } catch {
        // Invalid JSON — not our problem
      }
    }

    // — Result —
    if (violations.length > 0) {
      process.stderr.write(
        `GOLDEN PATH VIOLATION — BLOCKED\n\n${violations.join("\n\n")}\n\n` +
          `To add a new package, first create an ADR:\n` +
          `  .NET: /generate-adr "Use {package} for {purpose}"\n` +
          `  Angular: /generate-adr "Use {package} for {purpose}"\n` +
          `Then add the package to the approved list in this hook.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
