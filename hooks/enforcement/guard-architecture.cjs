#!/usr/bin/env node
/**
 * guard-architecture.js — Hook PreToolUse (Edit/Write)
 *
 * Enforces layer dependency rules:
 *   .NET    → Core > Application > Infrastructure > Initialization
 *   Angular → Application > Infrastructure > Presentation
 *   NestJS  → application > infrastructure > api (Clean Architecture 3 Layers)
 *
 * Exit 0 = allow, Exit 2 = block (stderr = reason)
 */

// — Read stdin (JSON from Claude Code) —
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input.file_path || "").replace(/\\/g, "/");
    const content =
      input.tool_input.content || input.tool_input.new_string || "";

    // Skip non-project files (Factoria config, node_modules, etc.)
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
    // Layer naming: NO numeric prefixes (applies to Angular + NestJS)
    // Wrong: 1-presentation, 2-infrastructure, 3-application
    // Right: presentation, infrastructure, application
    // ════════════════════════════════════════════
    const numberedLayerMatch = filePath.match(
      /\/(\d+[-_](?:presentation|infrastructure|application|api|core))\//i
    );
    if (numberedLayerMatch) {
      const badName = numberedLayerMatch[1];
      const fixedName = badName.replace(/^\d+[-_]/, "");
      violations.push(
        `[Layer Naming] Layer directories must NOT have numeric prefixes.\n` +
          `  File: ${filePath}\n` +
          `  Found: "${badName}/"\n` +
          `  Expected: "${fixedName}/"\n` +
          `  Rule: Use presentation/, infrastructure/, application/ — not 1-presentation/, 2-infrastructure/, 3-application/`
      );
    }

    // Also check import paths for numbered layer references
    const importContent = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
    for (const imp of importContent) {
      const importPath = imp.replace(/from\s+['"]/, "").replace(/['"]/, "");
      const numberedImport = importPath.match(
        /(\d+[-_](?:presentation|infrastructure|application|api|core))/i
      );
      if (numberedImport) {
        const badRef = numberedImport[1];
        const fixedRef = badRef.replace(/^\d+[-_]/, "");
        violations.push(
          `[Layer Naming] Import paths must NOT reference numbered layer directories.\n` +
            `  File: ${filePath}\n` +
            `  Import: "${importPath}"\n` +
            `  Found: "${badRef}" → use "${fixedRef}" instead`
        );
      }
    }

    // ════════════════════════════════════════════
    // .NET — Projects must be inside their layer folder
    // ════════════════════════════════════════════
    if (filePath.endsWith(".csproj")) {
      const pathLower = filePath.toLowerCase();

      // Check for .csproj directly under src/ without a layer folder
      // Wrong: src/Core.csproj → Right: src/Core/Core.csproj
      const srcMatch = filePath.match(/(?:^|\/|\\)src\/([^/]+\.csproj)$/i);
      if (srcMatch) {
        const csprojName = srcMatch[1];
        const layerName = csprojName.replace(".csproj", "");
        violations.push(
          `[.NET Structure] Project "${csprojName}" is directly under src/ — it MUST be inside its layer folder.\n` +
            `  File: ${filePath}\n` +
            `  Expected: src/${layerName}/${csprojName}\n` +
            `  Rule: Every layer has its own containing folder under src/`
        );
      }

      // Check for initialization projects outside Initialization/ folder
      // Wrong: src/RestApiService.MyApp/ → Right: src/Initialization/RestApiService.MyApp/
      const initTypes = ["restapiservice", "grpcapiservice", "messagingservice", "cronjobservice"];
      const isInitProject = initTypes.some((t) => pathLower.includes(t));
      if (isInitProject && !pathLower.includes("/initialization/")) {
        violations.push(
          `[.NET Structure] Initialization project must be inside src/Initialization/ folder.\n` +
            `  File: ${filePath}\n` +
            `  Rule: ALL initialization types (REST, gRPC, Messaging, CronJob) go inside ONE SINGLE Initialization/ folder.\n` +
            `  Fix: Move to src/Initialization/{ProjectFolder}/`
        );
      }
    }

    // ════════════════════════════════════════════
    // .NET Clean Architecture (4 layers)
    // ════════════════════════════════════════════
    if (filePath.endsWith(".cs")) {
      const pathLower = filePath.toLowerCase();

      // Detect which layer this file belongs to
      const isCore =
        pathLower.includes("/core/") || pathLower.includes(".core/");
      const isApplication =
        pathLower.includes("/application/") ||
        pathLower.includes(".application/");
      const isInfrastructure =
        pathLower.includes("/infrastructure/") ||
        pathLower.includes(".infrastructure/");

      // Extract using statements from content
      const usings = content.match(/using\s+[\w.]+;/g) || [];
      const usingNamespaces = usings.map((u) =>
        u.replace("using ", "").replace(";", "").trim().toLowerCase()
      );

      // Helper: check if a namespace belongs to a layer
      const nsMatchesLayer = (ns, layer) =>
        ns === layer ||
        ns.startsWith(layer + ".") ||
        ns.includes("." + layer + ".") ||
        ns.includes("." + layer);

      if (isCore) {
        // Core CANNOT reference Application, Infrastructure, or Initialization
        const forbidden = usingNamespaces.filter(
          (ns) =>
            nsMatchesLayer(ns, "application") ||
            nsMatchesLayer(ns, "infrastructure") ||
            nsMatchesLayer(ns, "initialization") ||
            ns.includes("restapiservice") ||
            ns.includes("grpcapiservice") ||
            ns.includes("messagingservice") ||
            ns.includes("cronjobservice")
        );
        if (forbidden.length > 0) {
          violations.push(
            `[.NET] Core layer CANNOT reference outer layers.\n` +
              `  File: ${filePath}\n` +
              `  Forbidden usings: ${forbidden.join(", ")}\n` +
              `  Rule: Core has ZERO dependencies (ADR-001)`
          );
        }
      }

      if (isApplication) {
        // Application CANNOT reference Infrastructure or Initialization
        const forbidden = usingNamespaces.filter(
          (ns) =>
            nsMatchesLayer(ns, "infrastructure") ||
            nsMatchesLayer(ns, "initialization") ||
            ns.includes("restapiservice") ||
            ns.includes("grpcapiservice") ||
            ns.includes("messagingservice") ||
            ns.includes("cronjobservice")
        );
        if (forbidden.length > 0) {
          violations.push(
            `[.NET] Application layer CANNOT reference Infrastructure or Initialization.\n` +
              `  File: ${filePath}\n` +
              `  Forbidden usings: ${forbidden.join(", ")}\n` +
              `  Rule: Application ONLY depends on Core (ADR-001)`
          );
        }
      }

      if (isInfrastructure) {
        // Infrastructure CANNOT reference Initialization
        const forbidden = usingNamespaces.filter(
          (ns) =>
            nsMatchesLayer(ns, "initialization") ||
            ns.includes("restapiservice") ||
            ns.includes("grpcapiservice") ||
            ns.includes("messagingservice") ||
            ns.includes("cronjobservice")
        );
        if (forbidden.length > 0) {
          violations.push(
            `[.NET] Infrastructure CANNOT reference Initialization layer.\n` +
              `  File: ${filePath}\n` +
              `  Forbidden usings: ${forbidden.join(", ")}\n` +
              `  Rule: Infrastructure depends on Application + Core only (ADR-001)`
          );
        }
      }
    }

    // ════════════════════════════════════════════
    // Angular Clean Architecture (3 layers)
    // Skip if NestJS context is detected (handled by NestJS section)
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) {
      const pathLower = filePath.toLowerCase();

      // Detect NestJS context to avoid false positives
      const isNestJsContext = content.includes("@nestjs/") ||
        content.includes("@Injectable") ||
        content.includes("@Controller") ||
        content.includes("@Module") ||
        content.includes("NestFactory");

      if (!isNestJsContext) {
        const isApp3 =
          pathLower.includes("/application/") ||
          pathLower.includes("@application/");
        const isInfra2 =
          pathLower.includes("/infrastructure/") ||
          pathLower.includes("@infraestructure/");
        const isPres1 =
          pathLower.includes("/presentation/") ||
          pathLower.includes("@presentation/");

        // Extract import paths
        const imports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
        const importPaths = imports.map((i) =>
          i
            .replace(/from\s+['"]/, "")
            .replace(/['"]/, "")
            .toLowerCase()
        );

        if (isApp3) {
          // Application CANNOT import from Infrastructure or Presentation
          const forbidden = importPaths.filter(
            (p) =>
              p.includes("infrastructure") ||
              p.includes("presentation") ||
              p.includes("@infraestructure/") ||
              p.includes("@presentation/")
          );
          if (forbidden.length > 0) {
            violations.push(
              `[Angular] Application CANNOT import from Infrastructure or Presentation.\n` +
                `  File: ${filePath}\n` +
                `  Forbidden imports: ${forbidden.join(", ")}\n` +
                `  Rule: Application has ZERO concrete dependencies (ADR-001)`
            );
          }
        }

        if (isPres1) {
          // Presentation CANNOT import directly from Infrastructure
          const forbidden = importPaths.filter(
            (p) =>
              p.includes("infrastructure") || p.includes("@infraestructure/")
          );
          if (forbidden.length > 0) {
            violations.push(
              `[Angular] Presentation CANNOT import directly from Infrastructure.\n` +
                `  File: ${filePath}\n` +
                `  Forbidden imports: ${forbidden.join(", ")}\n` +
                `  Rule: Presentation ONLY consumes abstract Use Cases from Application (ADR-001)`
            );
          }
        }
      }
    }

    // ════════════════════════════════════════════
    // NestJS BFF Clean Architecture (3 layers)
    // api → infrastructure → application
    // application has ZERO dependencies on other layers
    // ════════════════════════════════════════════
    if (filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts") && !filePath.endsWith(".test.ts")) {
      const pathLower = filePath.toLowerCase();

      // Detect NestJS project by path patterns (src/api/, src/infrastructure/, src/application/)
      const isNestApi = pathLower.includes("/api/") && !pathLower.includes("/api-bff/");
      const isNestInfra = pathLower.includes("/infrastructure/");
      const isNestApp = pathLower.includes("/application/");
      const isNestLibs = pathLower.includes("/libs/");

      // Only apply NestJS rules if we detect NestJS-specific patterns
      // (presence of NestJS decorators or NestJS-style module structure)
      const hasNestPatterns = content.includes("@nestjs/") ||
        content.includes("@Injectable") ||
        content.includes("@Controller") ||
        content.includes("@Module") ||
        content.includes("NestFactory");

      if (hasNestPatterns || (isNestApi && isNestInfra === false && isNestApp === false)) {
        // Extract import paths for NestJS
        const nestImports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
        const nestImportPaths = nestImports.map((i) =>
          i.replace(/from\s+['"]/, "").replace(/['"]/, "").toLowerCase()
        );

        if (isNestApp) {
          // application CANNOT import from infrastructure or api layers
          // BUT @application/abstractions/infrastructure/ is VALID (application defines its own abstractions)
          const forbidden = nestImportPaths.filter(
            (p) =>
              (p.includes("@api/") || p.includes("/api/")) ||
              (
                (p.includes("@infrastructure/") || p.includes("/infrastructure/")) &&
                !p.includes("/abstractions/infrastructure/") &&
                !p.includes("@application/abstractions/infrastructure/")
              )
          );
          if (forbidden.length > 0) {
            violations.push(
              `[NestJS] Application layer CANNOT import from API or Infrastructure.\n` +
                `  File: ${filePath}\n` +
                `  Forbidden imports: ${forbidden.join(", ")}\n` +
                `  Rule: Application has ZERO dependencies on outer layers (ADR-001)`
            );
          }
        }

        if (isNestApi) {
          // api CANNOT import directly from infrastructure
          const forbidden = nestImportPaths.filter(
            (p) =>
              p.includes("@infrastructure/") ||
              (p.includes("/infrastructure/") && !p.includes("/node_modules/"))
          );
          if (forbidden.length > 0) {
            violations.push(
              `[NestJS] API layer CANNOT import directly from Infrastructure.\n` +
                `  File: ${filePath}\n` +
                `  Forbidden imports: ${forbidden.join(", ")}\n` +
                `  Rule: API depends ONLY on Application layer (ADR-001)`
            );
          }
        }

        // Detect Promise<T> returns in services (should be Observable<T>)
        if ((isNestApp || isNestInfra) && content.includes("async ") && content.includes("Promise<")) {
          // Only warn for service files, not module or provider files
          if (!filePath.includes(".module.ts") && !filePath.includes(".providers.ts") && !filePath.includes("main.ts")) {
            violations.push(
              `[NestJS] Services must return Observable<T>, NOT Promise<T>.\n` +
                `  File: ${filePath}\n` +
                `  Rule: The entire stack is reactive — use RxJS Observables (ADR-001)`
            );
          }
        }

        // Detect TypeScript interface used for DI abstractions (should be abstract class)
        if (isNestApp && pathLower.includes("/abstractions/")) {
          if (content.includes("export interface ") && !content.includes("// grpc") && !content.includes("grpc-interfaces")) {
            violations.push(
              `[NestJS] Abstractions must use 'abstract class', NOT 'interface'.\n` +
                `  File: ${filePath}\n` +
                `  Rule: NestJS DI needs runtime tokens — TypeScript interfaces are erased at compile time.\n` +
                `  Fix: Replace 'export interface' with 'export abstract class'`
            );
          }
        }

        // Detect direct DB access in BFF (no ORM, no repositories)
        if (content.includes("TypeORM") || content.includes("@Entity") ||
            content.includes("getRepository") || content.includes("createConnection") ||
            content.includes("mongoose") || content.includes("@InjectModel") ||
            content.includes("PrismaClient") || content.includes("@prisma/")) {
          violations.push(
            `[NestJS BFF] BFF cannot access databases directly.\n` +
              `  File: ${filePath}\n` +
              `  Rule: BFF is aggregation/orchestration ONLY — no ORM, no direct DB access.\n` +
              `  Fix: Use infrastructure adapters to call backend microservices instead.`
          );
        }
      }
    }

    // — Result —
    if (violations.length > 0) {
      process.stderr.write(
        `ARCHITECTURE VIOLATION BLOCKED\n\n${violations.join("\n\n")}\n\n` +
          `Fix: Move the dependency through the proper layer or use an interface/abstraction.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (e) {
    // Hook errors should not block work — fail open
    process.exit(0);
  }
});
