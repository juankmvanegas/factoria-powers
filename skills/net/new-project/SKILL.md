---
name: new-project
description: "Initialize Factoria in a project — from scratch or on an existing .NET project"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Prepare a .NET 8.0 project to work with Factoria. Supports two scenarios:

- **Scenario A**: Empty folder → complete Clean Architecture 4-layer scaffold
- **Scenario B**: Existing .NET project (enterprise template) → analysis, validation, and onboarding

## Execution Flow

### Step 0: Automatic Detection

Before any questions, scan the project directory:

1. Look for `.sln`, `.csproj`, `Program.cs`, `Directory.Build.props` files
2. If they **do NOT exist** → **Scenario A** (from scratch)
3. If they **exist** → **Scenario B** (existing project)

Inform the user which scenario was detected before continuing.

---

## Scenario A: Project from Scratch

### Phase A1: Structured Interview

Ask the user the following questions, one at a time. DO NOT proceed until clear answers are obtained:

1. **Domain**: What is the business domain? (e.g., e-commerce, healthcare, finance, education)
2. **Project name**: What is the project name? (will be used as root namespace)
3. **Main entities**: What are the core domain entities? (minimum 2-3)
4. **Service types**: What types of services are needed?
   - REST API (`RestApiService`)
   - gRPC (`GrpcApiService`)
   - Messaging (`MessagingService`)
   - Scheduled jobs (`CronJobService`)
5. **Data providers**: What databases will it use?
   - SQL Server (Entity Framework Core)
   - SQL Server (Dapper)
   - MongoDB
   - Combination
6. **Authentication**: Does it need authentication? What type?
7. **External integrations**: Are there external services to integrate?
8. **Known constraints**: Are there technical or business constraints?

### Phase A2: BUSINESS_LOGIC.md Generation

With the answers, generate `BUSINESS_LOGIC.md` at the project root:

- Domain summary
- Entities and their relationships
- Known business rules
- Main flows
- Identified constraints

### Phase A2b: Integrations and Database (if provided in the prompt)

If the Task prompt includes third-party documentation or connection string:

1. **Third-party integrations**: For each documentation/OpenAPI received:
   - Save spec in `.cloud/contracts/third-party/{provider}-openapi.yaml`
   - Include in scaffold: `I{Provider}Adapter` in Application + implementation in Infrastructure
   - Generate third-party DTOs in `Application/DTOs/{Provider}/`
   - Configure base URL in `appsettings.json` under `ExternalServices:{Provider}:BaseUrl`
   - If no documentation (placeholder): create interface with TODO

2. **Connection string**: If provided:
   - Configure in user secrets for the Integration Tests project
   - Create `appsettings.Testing.json` with the connection string (add to `.gitignore`)
   - Do NOT include in `appsettings.json` or `appsettings.Development.json`

### Phase A3: Solution Scaffold

Create the 4-layer structure following Factoria standards.

**CRITICAL: Every layer MUST have its own containing folder under `src/`.** The `.csproj` lives INSIDE the layer folder — NEVER directly at `src/` level. ALL initialization types go inside ONE SINGLE `Initialization/` folder.

```
{ProjectName}/
├── src/
│   ├── Core/                                    ← Layer folder (MANDATORY)
│   │   ├── Entities/
│   │   ├── Enumerations/
│   │   └── Core.csproj                          ← INSIDE Core/ — Zero NuGet deps
│   │
│   ├── Application/                             ← Layer folder (MANDATORY)
│   │   ├── Services/
│   │   │   ├── Simple/
│   │   │   └── Compound/
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   │   ├── Services/
│   │   │   └── Infrastructure/
│   │   ├── Common/
│   │   │   ├── Helpers/
│   │   │   └── Utilities/
│   │   ├── ApplicationDependencyInjection.cs
│   │   └── Application.csproj                   ← INSIDE Application/ — Depends only on Core
│   │
│   ├── Infrastructure/                          ← Layer folder (MANDATORY)
│   │   ├── Services/
│   │   │   ├── MSQLServer/                      ← EF Core (if applicable)
│   │   │   ├── DapperOrm/                       ← Dapper (if applicable)
│   │   │   └── MongoDB/                         ← MongoDB (if applicable)
│   │   ├── InfrastructureDependencyInjection.cs
│   │   └── Infrastructure.csproj                ← INSIDE Infrastructure/ — Depends on Application + Core
│   │
│   └── Initialization/                          ← ONE SINGLE folder for ALL init types
│       ├── RestApiService.{ServiceName}/        ← Each init type in its own subfolder
│       │   ├── Controllers/
│       │   ├── Filters/
│       │   ├── Middleware/
│       │   ├── Validators/
│       │   ├── ConfigurationExtensions.cs
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── RestApiService.{ServiceName}.csproj
│       ├── GrpcApiService.{ServiceName}/        ← (if chosen — inside same Initialization/)
│       │   ├── Services/
│       │   ├── Interceptors/
│       │   ├── Validators/
│       │   ├── ConfigurationExtensions.cs
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── GrpcApiService.{ServiceName}.csproj
│       ├── MessagingService.{ServiceName}/      ← (if chosen — inside same Initialization/)
│       │   ├── Subscriptions/
│       │   ├── ConfigurationExtensions.cs
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── MessagingService.{ServiceName}.csproj
│       └── CronJobService.{ServiceName}/        ← (if chosen — inside same Initialization/)
│           ├── Jobs/
│           ├── ConfigurationExtensions.cs
│           ├── Program.cs
│           ├── ServicesConfiguration.cs
│           └── CronJobService.{ServiceName}.csproj
│
├── tests/
│   ├── Architecture.Tests/
│   │   ├── CheckArchitectureRules.cs
│   │   └── Architecture.Tests.csproj
│   ├── Double.Tests/
│   │   ├── Stubs/
│   │   ├── Mocks/
│   │   ├── Fakes/
│   │   ├── Dummies/
│   │   ├── Spies/
│   │   └── Double.Tests.csproj
│   └── Unit.Tests/
│       └── Application/
│           └── Services/
│               ├── Simple/
│               └── Compound/
│
├── {ProjectName}.sln
├── Directory.Build.props
├── Directory.Packages.props
├── BUSINESS_LOGIC.md
├── CHANGELOG.md
├── .azuredevops/
│   ├── azure-pipelines.yaml                  ← REST pipeline (if REST is selected)
│   ├── azure-pipelines-grpc.yaml             ← gRPC pipeline (if gRPC is selected)
│   ├── azure-pipelines-messaging.yaml        ← Messaging pipeline (if Messaging is selected)
│   └── azure-pipelines-cronjob.yaml          ← CronJob pipeline (if CronJob is selected)
└── .cloud/
    └── architecture/
        └── decisions/
            └── ADR-001-clean-architecture.md
```

**Common mistakes to AVOID:**
- ❌ `src/Core.csproj` — WRONG (project outside layer folder)
- ✅ `src/Core/Core.csproj` — CORRECT (project inside layer folder)
- ❌ `src/RestApiService.MyApp/` — WRONG (init type outside Initialization folder)
- ✅ `src/Initialization/RestApiService.MyApp/` — CORRECT (init type inside Initialization folder)
- ❌ Multiple `Initialization-REST/`, `Initialization-gRPC/` folders — WRONG
- ✅ Single `Initialization/` with subfolders per type — CORRECT

### Phase A4: Configuration Files

**Directory.Build.props**: .NET 8.0, nullable enable, implicit usings.

**Directory.Packages.props**: Central Package Management with the Golden Path versions defined in CLAUDE.md.

**.azuredevops/**: create one Azure DevOps YAML pipeline per selected initialization type, following ADR-014. Pipelines must run restore, build, Architecture.Tests, Unit.Tests, Integration.Tests when configured, publish, and deploy per environment. Secret variables must be Key Vault references or secure variable-group references only; never write secret values in YAML.

### Phase A4b: Initialization Startup Template

For every selected initialization type, generate `Program.cs`, `ConfigurationExtensions.cs`, and `ServicesConfiguration.cs` using the mandatory startup contract from ADR-004 and ADR-008.

Required `Program.cs` order:

1. Create the builder.
2. Load non-secret configuration.
3. Add dynamic providers (`AddMongoProvider`) when applicable.
4. Call `ResolveSecrets` before DI.
5. Register Application DI.
6. Register Infrastructure DI with resolved configuration.
7. Register initializer-specific services.
8. Build.
9. Configure middleware/endpoints/subscriptions/jobs.
10. Run asynchronously with `await app.RunAsync()` or `await host.RunAsync()`.

REST template baseline:

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.AddCustomConfiguration();
builder.Configuration.ResolveSecrets();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddCustomServices(builder.Configuration);

WebApplication app = builder.Build();

app.UseCustomMiddlewares();
app.MapControllers();

await app.RunAsync();
```

Messaging and CronJob services may use `Host.CreateApplicationBuilder(args)` or `Host.CreateDefaultBuilder(args)`, but the same order is mandatory.

`Program.cs` MUST NOT include business logic, hardcoded secrets, hardcoded connection strings, provider implementation details, direct registrations that belong to Application or Infrastructure, synchronous `Run()`, or a global `try/catch` wrapping the startup sequence.

### Phase A5: Initial Architecture Tests

Create `CheckArchitectureRules.cs` with base NetArchTest rules:
1. Core does not reference Application, Infrastructure, or Initialization
2. Application does not reference Infrastructure or Initialization
3. Infrastructure does not reference Initialization
4. Core has zero NuGet dependencies

### Phase A6: CHANGELOG and Initial ADR

- `CHANGELOG.md` with initial entry
- `ADR-001-clean-architecture.md` documenting the decision

### Phase A7: Confirmation

Show the user a summary of everything created and confirm that the project is ready to receive features.

---

## Scenario B: Existing .NET Project

### Phase B1: Project Analysis

Scan the complete project and map:

1. **Solution structure**: `.sln`, `.csproj` files, folders
2. **Identified layers**: Does it have Core? Application? Infrastructure? Initialization?
3. **Namespaces**: Do they follow Factoria conventions?
4. **Dependencies**: Read `Directory.Packages.props` or each `.csproj`
5. **Existing entities**: Search in Core/Entities
6. **Existing services**: Search in Application/Services
7. **Repositories/Adapters**: Search in Infrastructure
8. **Controllers/Endpoints**: Search in Initialization
9. **Existing tests**: Search for test projects
10. **Configuration**: `appsettings.json`, `Program.cs`, DI registration
11. **Initialization startup**: verify `Program.cs` follows ADR-004/ADR-008 startup order, including `ResolveSecrets` before Infrastructure DI

### Phase B2: Validation Against Factoria Standards

Compare findings against Factoria rules and generate a report:

```
FACTORIA COMPATIBILITY REPORT
═══════════════════════════════

✅ Compliant:
  - [list what complies]

⚠️ Warnings (recommendations):
  - [list what could be improved but does not block]

❌ Non-compliant (action required):
  - [list what must be corrected]
```

Specifically verify:
- [ ] Correct 4-layer architecture
- [ ] Inter-layer dependencies respected
- [ ] Core without NuGet dependencies
- [ ] Application only depends on Core
- [ ] Naming conventions followed
- [ ] Central Package Management present
- [ ] .NET 8.0 as target framework
- [ ] Test structure present
- [ ] DI registration in each layer
- [ ] Error handling patterns (BusinessException)
- [ ] Initialization projects are under `src/Initialization/[Type]Service.[Name]/`
- [ ] Every initializer has `Program.cs`, `ConfigurationExtensions.cs`, and `ServicesConfiguration.cs`
- [ ] `Program.cs` calls `ResolveSecrets` before infrastructure/provider registrations
- [ ] `Program.cs` delegates Application and Infrastructure registrations to their layer DI extensions
- [ ] `Program.cs` runs the initializer asynchronously with `await app.RunAsync()` or `await host.RunAsync()`
- [ ] `Program.cs` does not wrap builder/DI/build/run in a global `try/catch`
- [ ] No secrets, connection strings, or provider credentials in versioned `appsettings*.json`
- [ ] `.azuredevops/` exists with one pipeline YAML per initializer type present in `src/Initialization/`
- [ ] Pipeline YAML uses Key Vault/secure variable-group references for secrets and runs architecture/unit/integration gates

### Phase B3: BUSINESS_LOGIC.md Generation

Based on the analysis, generate `BUSINESS_LOGIC.md` with:

- Domain inferred from code
- Entities found and their relationships
- Existing services and their purpose
- Available endpoints/APIs
- Data providers in use

Ask the user if the summary is correct and if they want to add or correct anything.

### Phase B4: Factoria Onboarding

If they do not exist, create Factoria support files:

- `.cloud/architecture/current.md` — Document the current architecture found
- `.cloud/architecture/decisions/` — Create ADRs for decisions already made in the project
- `CHANGELOG.md` — If it does not exist, create it with the current state as starting point
- `README.md` — If it does not exist, create it with:
  - Project purpose (domain and main objective)
  - Folder structure (layers and their contents)
  - How to run the project (build, run, test)
  - Main endpoints (if applicable — list available REST/gRPC routes)

**Do NOT modify existing code** in this phase. Only add support files.

### Phase B5: Recommendations

If warnings or non-compliance were found in Phase B2:

- Ask the user if they want Factoria to fix the non-compliance items
- If accepted, execute corrections one by one with confirmation
- If not, document the deviations as technical debt

### Phase B6: Confirmation

Show the user:

```
FACTORIA READY
══════════════

Project: {name}
Domain: {inferred domain}
Layers: {layers found}
Entities: {N entities}
Services: {N services}
Endpoints: {N endpoints}
Tests: {status}

The project is ready to receive instructions.
Use /prp [feature] to plan or /sprint for quick tasks.
```

---

## General Rules (both scenarios)

- NEVER generate code without confirming with the user first
- ALWAYS use .NET 8.0
- ALWAYS follow the naming conventions defined in CLAUDE.md
- ALWAYS respect the 4-layer architecture
- In Scenario B, **NEVER** modify existing code without explicit approval
- In Scenario B, **NEVER** assume something is wrong — validate against the rules and report
- Namespaces must follow the folder structure
- Each layer only references the layers it is allowed to
