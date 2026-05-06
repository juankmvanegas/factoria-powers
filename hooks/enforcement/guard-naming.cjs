#!/usr/bin/env node
/**
 * guard-naming.js — Hook PreToolUse (Write only — new files)
 *
 * Enforces naming conventions for .NET, Angular, and NestJS files.
 * Only triggers on Write (new file creation), not Edit.
 *
 * Exit 0 = allow, Exit 2 = block (stderr = reason)
 */

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);

    // Only enforce on Write (new file creation)
    if (input.tool_name !== "Write") {
      process.exit(0);
    }

    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");
    const content = input.tool_input.content || "";
    const fileName = filePath.split("/").pop() || "";

    // Skip non-project files
    if (
      filePath.includes("/Factoria/") ||
      filePath.includes("/node_modules/") ||
      filePath.includes("/.claude/") ||
      filePath.includes("/.git/") ||
      filePath.includes("/.cloud/")
    ) {
      process.exit(0);
    }

    const violations = [];

    // ════════════════════════════════════════════
    // Layer directory naming: NO numeric prefixes
    // Applies to all technologies (Angular, NestJS)
    // ════════════════════════════════════════════
    const numberedLayerMatch = filePath.match(
      /\/(\d+[-_](?:presentation|infrastructure|application|api|core))\//i
    );
    if (numberedLayerMatch) {
      const badName = numberedLayerMatch[1];
      const fixedName = badName.replace(/^\d+[-_]/, "");
      violations.push(
        `[Layer Naming] Cannot create files inside numbered layer directories.\n` +
          `  File: ${filePath}\n` +
          `  Found: "${badName}/"\n` +
          `  Expected: "${fixedName}/"\n` +
          `  Rule: Layers are presentation/, infrastructure/, application/ — never with numeric prefixes`
      );
    }

    // ════════════════════════════════════════════
    // .NET Naming Conventions
    // ════════════════════════════════════════════
    if (filePath.endsWith(".cs")) {
      const pathLower = filePath.toLowerCase();

      // Controllers must end with "Controller"
      if (pathLower.includes("/controllers/")) {
        if (!fileName.endsWith("Controller.cs")) {
          violations.push(
            `[.NET Naming] Controllers must end with "Controller".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *Controller.cs`
          );
        }
      }

      // Validators must end with "InputValidation"
      if (pathLower.includes("/validators/") || pathLower.includes("/validation/")) {
        if (!fileName.endsWith("InputValidation.cs") && !fileName.endsWith("Validation.cs")) {
          violations.push(
            `[.NET Naming] Validators must end with "InputValidation" or "Validation".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *InputValidation.cs`
          );
        }
      }

      // Interfaces must start with "I"
      if (pathLower.includes("/interfaces/")) {
        if (!fileName.startsWith("I")) {
          violations.push(
            `[.NET Naming] Interfaces must start with "I".\n` +
              `  File: ${fileName}\n` +
              `  Expected: I*.cs`
          );
        }
      }

      // DTOs: must end with Input or Output
      if (pathLower.includes("/dtos/")) {
        if (
          !fileName.endsWith("Input.cs") &&
          !fileName.endsWith("Output.cs") &&
          !fileName.endsWith("Dto.cs")
        ) {
          violations.push(
            `[.NET Naming] DTOs must end with "Input" or "Output".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *Input.cs or *Output.cs`
          );
        }
      }

      // Services must end with "Service"
      if (pathLower.includes("/services/") && pathLower.includes("/application/")) {
        if (
          !fileName.endsWith("Service.cs") &&
          !fileName.endsWith("DependencyInjection.cs")
        ) {
          violations.push(
            `[.NET Naming] Application services must end with "Service".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *Service.cs`
          );
        }
      }

      // Adapters in Infrastructure must end with "Adapter"
      if (pathLower.includes("/infrastructure/") && pathLower.includes("/services/")) {
        if (
          !fileName.endsWith("Adapter.cs") &&
          !fileName.endsWith("Service.cs") &&
          !fileName.endsWith("DependencyInjection.cs")
        ) {
          violations.push(
            `[.NET Naming] Infrastructure adapters should end with "Adapter".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *Adapter.cs`
          );
        }
      }

      // Filters/Attributes must end with "Attribute"
      if (pathLower.includes("/filters/")) {
        if (!fileName.endsWith("Attribute.cs")) {
          violations.push(
            `[.NET Naming] Filters must end with "Attribute".\n` +
              `  File: ${fileName}\n` +
              `  Expected: *Attribute.cs`
          );
        }
      }

      // Check class naming matches file naming
      const classMatch = content.match(/public\s+(?:abstract\s+)?class\s+(\w+)/);
      if (classMatch) {
        const className = classMatch[1];
        const expectedFileName = className + ".cs";
        if (fileName !== expectedFileName) {
          violations.push(
            `[.NET Naming] File name must match class name.\n` +
              `  File: ${fileName}\n` +
              `  Class: ${className}\n` +
              `  Expected file: ${expectedFileName}`
          );
        }
      }
    }

    // ════════════════════════════════════════════
    // Angular Naming Conventions
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) {
      const pathLower = filePath.toLowerCase();

      // DTOs must be .input.ts or .output.ts
      if (pathLower.includes("/dtos/")) {
        if (
          !fileName.endsWith(".input.ts") &&
          !fileName.endsWith(".output.ts") &&
          !fileName.endsWith(".enum.ts") &&
          !fileName.endsWith(".module.ts") &&
          !fileName.endsWith(".index.ts")
        ) {
          violations.push(
            `[Angular Naming] DTOs must be *.input.ts or *.output.ts.\n` +
              `  File: ${fileName}\n` +
              `  Expected: {entity}.input.ts or {entity}.output.ts`
          );
        }
      }

      // View containers must be .container.ts
      if (pathLower.includes("/views/") && fileName.includes("container")) {
        if (!fileName.endsWith(".container.ts")) {
          violations.push(
            `[Angular Naming] View containers must be *.container.ts.\n` +
              `  File: ${fileName}`
          );
        }
      }

      // View modules must be .module.ts
      if (pathLower.includes("/views/") && fileName.includes("module")) {
        if (!fileName.endsWith(".module.ts")) {
          violations.push(
            `[Angular Naming] View modules must be *.module.ts.\n` +
              `  File: ${fileName}`
          );
        }
      }

      // View routers must be .router.ts
      if (pathLower.includes("/views/") && fileName.includes("router")) {
        if (!fileName.endsWith(".router.ts")) {
          violations.push(
            `[Angular Naming] View routers must be *.router.ts.\n` +
              `  File: ${fileName}`
          );
        }
      }

      // HTTP adapters must be api-bff-*.service.ts
      if (pathLower.includes("/api-bff/") && !fileName.includes("providers")) {
        if (!fileName.startsWith("api-bff-") || !fileName.endsWith(".service.ts")) {
          violations.push(
            `[Angular Naming] HTTP adapters must be api-bff-{entity}.service.ts.\n` +
              `  File: ${fileName}\n` +
              `  Expected: api-bff-{entity}.service.ts`
          );
        }
      }

      // Pages must be .page.ts
      if (pathLower.includes("/pages/")) {
        if (!fileName.endsWith(".page.ts") && !fileName.endsWith(".ts")) {
          // Soft check — pages should ideally end with .page.ts
        }
      }

      // Providers file must be .providers.ts
      if (fileName.includes("provider") && !fileName.endsWith(".providers.ts")) {
        violations.push(
          `[Angular Naming] Provider files must be *.providers.ts.\n` +
            `  File: ${fileName}\n` +
            `  Expected: {name}.providers.ts`
        );
      }

      // Enums must be .enum.ts
      if (pathLower.includes("/_enumerations/") || pathLower.includes("/enums/")) {
        if (!fileName.endsWith(".enum.ts")) {
          violations.push(
            `[Angular Naming] Enumerations must be *.enum.ts.\n` +
              `  File: ${fileName}`
          );
        }
      }

      // Check for templateUrl (must use inline templates)
      if (
        content.includes("templateUrl") &&
        (pathLower.includes("/presentation/") ||
          pathLower.includes("/views/"))
      ) {
        violations.push(
          `[Angular] Components must use inline templates (template literal), NOT templateUrl.\n` +
            `  File: ${fileName}\n` +
            `  Rule: ADR-008 — Inline Templates`
        );
      }
    }

    // ════════════════════════════════════════════
    // NestJS BFF Naming Conventions
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts") && !filePath.endsWith(".test.ts")) {
      const pathLower = filePath.toLowerCase();
      const content_lower = content.toLowerCase();

      // Detect NestJS context: check for NestJS imports or NestJS-style paths
      const isNestContext = content.includes("@nestjs/") ||
        content.includes("@Injectable") ||
        content.includes("@Controller") ||
        content.includes("@Module") ||
        pathLower.includes("/api/controllers/") ||
        (pathLower.includes("/api/") && pathLower.includes(".module.ts"));

      if (isNestContext) {
        // Controllers must end with .controller.ts
        if (pathLower.includes("/controllers/") || content.includes("@Controller")) {
          if (!fileName.endsWith(".controller.ts") && !fileName.endsWith(".module.ts")) {
            violations.push(
              `[NestJS Naming] Controllers must end with ".controller.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [feature].controller.ts`
            );
          }
        }

        // Application services must end with .service.ts
        if (pathLower.includes("/application/") && pathLower.includes("/services/")) {
          if (!fileName.endsWith(".service.ts") && !fileName.endsWith(".module.ts")) {
            violations.push(
              `[NestJS Naming] Application services must end with ".service.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [feature].service.ts`
            );
          }
        }

        // Infrastructure services must end with .service.ts
        if (pathLower.includes("/infrastructure/") && pathLower.includes("/services/")) {
          if (!fileName.endsWith(".service.ts") && !fileName.endsWith(".providers.ts") && !fileName.endsWith(".module.ts")) {
            violations.push(
              `[NestJS Naming] Infrastructure services must end with ".service.ts" or ".providers.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [backend]-[service].service.ts or [service].providers.ts`
            );
          }
        }

        // DTOs: input must be .input.ts, output must be .output.ts
        if (pathLower.includes("/dtos/")) {
          if (
            !fileName.endsWith(".input.ts") &&
            !fileName.endsWith(".output.ts") &&
            !fileName.endsWith(".enum.ts") &&
            !fileName.endsWith(".module.ts") &&
            !fileName.endsWith("index.ts")
          ) {
            violations.push(
              `[NestJS Naming] DTOs must be *.input.ts or *.output.ts.\n` +
                `  File: ${fileName}\n` +
                `  Expected: [feature]-[action].input.ts or [feature].output.ts`
            );
          }
        }

        // Abstractions: use-cases must be .interface.ts, infra adapters must be .adapter.ts
        if (pathLower.includes("/abstractions/use-cases/")) {
          if (!fileName.endsWith(".interface.ts") && !fileName.endsWith(".ts")) {
            // Soft check — .ts without suffix is allowed (blueprint convention)
          }
        }
        if (pathLower.includes("/abstractions/infrastructure/")) {
          if (!fileName.endsWith(".adapter.ts") && !fileName.endsWith(".ts") && !pathLower.includes("grpc-interfaces")) {
            violations.push(
              `[NestJS Naming] Infrastructure abstractions must end with ".adapter.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [feature].adapter.ts`
            );
          }
        }

        // Modules must end with .module.ts
        if (content.includes("@Module(") && !fileName.endsWith(".module.ts")) {
          violations.push(
            `[NestJS Naming] NestJS modules must end with ".module.ts".\n` +
              `  File: ${fileName}\n` +
              `  Expected: [layer].module.ts`
          );
        }

        // Filters must end with .filter.ts
        if (pathLower.includes("/filters/") || content.includes("@Catch(")) {
          if (!fileName.endsWith(".filter.ts")) {
            violations.push(
              `[NestJS Naming] Exception filters must end with ".filter.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [name].filter.ts`
            );
          }
        }

        // Interceptors must end with .interceptor.ts
        if (content.includes("implements NestInterceptor") || content.includes("@Injectable") && pathLower.includes("/interceptor")) {
          if (!fileName.endsWith(".interceptor.ts")) {
            violations.push(
              `[NestJS Naming] Interceptors must end with ".interceptor.ts".\n` +
                `  File: ${fileName}\n` +
                `  Expected: [name].interceptor.ts`
            );
          }
        }

        // Provider files must end with .providers.ts
        if (fileName.includes("provider") && !fileName.endsWith(".providers.ts")) {
          violations.push(
            `[NestJS Naming] Provider files must end with ".providers.ts".\n` +
              `  File: ${fileName}\n` +
              `  Expected: [service].providers.ts`
          );
        }

        // Tests must end with .test.ts (not .spec.ts for NestJS BFF)
        if (pathLower.includes("/unit-testing/") || pathLower.includes("/test/")) {
          if (fileName.endsWith(".spec.ts")) {
            violations.push(
              `[NestJS Naming] Tests must use ".test.ts" convention (not ".spec.ts").\n` +
                `  File: ${fileName}\n` +
                `  Expected: [feature].test.ts`
            );
          }
        }
      }
    }

    // — Result —
    if (violations.length > 0) {
      process.stderr.write(
        `NAMING CONVENTION VIOLATION\n\n${violations.join("\n\n")}\n\n` +
          `Fix: Rename the file following the naming conventions in CLAUDE.md.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
