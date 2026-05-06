#!/usr/bin/env node
/**
 * guard-di-registration.cjs — Hook PostToolUse (Write)
 *
 * When a new Service or Adapter file is created, warns if the
 * corresponding DI registration file hasn't been updated.
 * This is the #1 runtime error: services not registered in DI.
 *
 * Outputs guidance (does not block — the DI file may be updated next).
 */

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);

    // Only check new file creation
    if (input.tool_name !== "Write") {
      process.exit(0);
    }

    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");
    const content = input.tool_input.content || "";

    // Skip non-project files
    if (
      filePath.includes("/Factoria/") ||
      filePath.includes("/node_modules/") ||
      filePath.includes("/.claude/") ||
      filePath.includes("/.git/") ||
      filePath.includes("/Tests/") ||
      filePath.includes(".Tests/")
    ) {
      process.exit(0);
    }

    const fileName = filePath.split("/").pop() || "";
    const pathLower = filePath.toLowerCase();
    const reminders = [];

    // ════════════════════════════════════════════
    // .NET — New Service or Adapter
    // ════════════════════════════════════════════
    if (filePath.endsWith(".cs")) {
      // New Application Service → needs ApplicationDependencyInjection.cs
      if (
        pathLower.includes("/application/") &&
        pathLower.includes("/services/") &&
        (content.includes(": I") || content.includes("class "))
      ) {
        const classMatch = content.match(
          /public\s+class\s+(\w+)\s*:\s*(I\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[DI Registration] New service "${classMatch[1]}" implements "${classMatch[2]}".\n` +
              `  Register in: ApplicationDependencyInjection.cs\n` +
              `  Example: services.AddScoped<${classMatch[2]}, ${classMatch[1]}>();`
          );
        }
      }

      // New Infrastructure Adapter → needs InfrastructureDependencyInjection.cs
      if (
        pathLower.includes("/infrastructure/") &&
        pathLower.includes("/services/") &&
        (content.includes(": I") || content.includes("class "))
      ) {
        const classMatch = content.match(
          /public\s+class\s+(\w+)\s*:\s*(I\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[DI Registration] New adapter "${classMatch[1]}" implements "${classMatch[2]}".\n` +
              `  Register in: InfrastructureDependencyInjection.cs\n` +
              `  Example: services.AddScoped<${classMatch[2]}, ${classMatch[1]}>();`
          );
        }
      }
    }

    // ════════════════════════════════════════════
    // Angular — New Service or Adapter
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) {
      // New Application service → needs application.module.ts provider
      if (
        pathLower.includes("/application/") &&
        pathLower.includes("/services/") &&
        content.includes("extends") &&
        content.includes("class ")
      ) {
        const classMatch = content.match(
          /export\s+class\s+(\w+)\s+extends\s+(\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[DI Registration] New Angular service "${classMatch[1]}" extends "${classMatch[2]}".\n` +
              `  Register in: application.module.ts providers\n` +
              `  Example: { provide: ${classMatch[2]}, useClass: ${classMatch[1]} }`
          );
        }
      }

      // New Infrastructure adapter → needs infraestructure.module.ts or providers file
      if (
        pathLower.includes("/infrastructure/") &&
        pathLower.includes("/services/") &&
        content.includes("extends") &&
        content.includes("class ")
      ) {
        const classMatch = content.match(
          /export\s+class\s+(\w+)\s+extends\s+(\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[DI Registration] New Angular adapter "${classMatch[1]}" extends "${classMatch[2]}".\n` +
              `  Register in: corresponding .providers.ts file or infraestructure.module.ts\n` +
              `  Example: { provide: ${classMatch[2]}, useClass: ${classMatch[1]} }`
          );
        }
      }
    }

    // ════════════════════════════════════════════
    // NestJS BFF — New Service or Adapter (abstract class DI pattern)
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts") && !filePath.endsWith(".test.ts")) {
      const nestContent = content;

      // New Application Service → needs application.module.ts provider
      if (
        pathLower.includes("/application/") &&
        pathLower.includes("/services/") &&
        (nestContent.includes("@Injectable") || nestContent.includes("class "))
      ) {
        const classMatch = nestContent.match(
          /export\s+class\s+(\w+)\s+(?:implements|extends)\s+(\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[NestJS DI] New application service "${classMatch[1]}" implements "${classMatch[2]}".\n` +
              `  Register in: application.module.ts providers\n` +
              `  Example:\n` +
              `    providers: [\n` +
              `      ${classMatch[1]},\n` +
              `      { provide: ${classMatch[2]}, useExisting: ${classMatch[1]} },\n` +
              `    ]`
          );
        }
      }

      // New Infrastructure Service → needs providers file + infrastructure.module.ts
      if (
        pathLower.includes("/infrastructure/") &&
        pathLower.includes("/services/") &&
        (nestContent.includes("@Injectable") || nestContent.includes("class "))
      ) {
        const classMatch = nestContent.match(
          /export\s+class\s+(\w+)\s+(?:implements|extends)\s+(\w+)/
        );
        if (classMatch) {
          reminders.push(
            `[NestJS DI] New infrastructure adapter "${classMatch[1]}" implements "${classMatch[2]}".\n` +
              `  Register in: [service].providers.ts + infrastructure.module.ts\n` +
              `  Example provider:\n` +
              `    export const providers: Provider[] = [\n` +
              `      ${classMatch[1]},\n` +
              `      { provide: ${classMatch[2]}, useExisting: ${classMatch[1]} },\n` +
              `    ]`
          );
        }
      }

      // New abstract class in abstractions → remind about DI wiring
      if (
        pathLower.includes("/abstractions/") &&
        nestContent.includes("export abstract class")
      ) {
        const abstractMatch = nestContent.match(
          /export\s+abstract\s+class\s+(\w+)/
        );
        if (abstractMatch) {
          reminders.push(
            `[NestJS DI] New abstraction "${abstractMatch[1]}" — remember to:\n` +
              `  1. Create the concrete implementation\n` +
              `  2. Register with: { provide: ${abstractMatch[1]}, useExisting: ConcreteImpl }`
          );
        }
      }
    }

    if (reminders.length > 0) {
      process.stdout.write(
        reminders.join("\n") +
          "\n\nIMPORTANT: If you don't register this in DI, the application will fail at runtime with a missing dependency error."
      );
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
