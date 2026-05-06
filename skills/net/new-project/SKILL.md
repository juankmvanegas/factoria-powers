---
name: net-new-project
description: "Use when initializing a brand-new project from scratch following the factory template"
---

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
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── RestApiService.{ServiceName}.csproj
│       ├── GrpcApiService.{ServiceName}/        ← (if chosen — inside same Initialization/)
│       │   ├── Services/
│       │   ├── Interceptors/
│       │   ├── Validators/
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── GrpcApiService.{ServiceName}.csproj
│       ├── MessagingService.{ServiceName}/      ← (if chosen — inside same Initialization/)
│       │   ├── Subscriptions/
│       │   ├── Program.cs
│       │   ├── ServicesConfiguration.cs
│       │   └── MessagingService.{ServiceName}.csproj
│       └── CronJobService.{ServiceName}/        ← (if chosen — inside same Initialization/)
│           ├── Jobs/
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
