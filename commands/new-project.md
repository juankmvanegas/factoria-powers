# /new-project

Scaffolds a new .NET 8.0 Clean Architecture project following the blueprint.

## What it does
Creates the full 4-layer solution structure with all required projects, DI classes, configuration files, and test projects.

## Instructions
1. Activate the **orchestrator-agent** (`.ai/agents/orchestrator-agent.md`)
2. The orchestrator will delegate to the **execution-agent** (`.ai/agents/execution-agent.md`)
3. Follow the architecture defined in `.cloud/architecture/current.md`
4. Create the solution with each layer in its own folder under `src/`:
   - `src/Core/Core.csproj` (zero dependencies)
   - `src/Application/Application.csproj` (depends on Core)
   - `src/Infrastructure/Infrastructure.csproj` (depends on Application + Core)
   - `src/Initialization/[Type]Service.[Name]/` — ALL init types inside ONE Initialization/ folder
   - `Directory.Build.props` and `Directory.Packages.props`
   - Test projects: `Architecture.Tests`, `Unit.Tests`, `Double.Tests`, `Integration.Tests`
5. Generate architecture tests in `CheckArchitectureRules.cs`
6. Initialize `CHANGELOG.md`

## Usage
```
/new-project [ServiceName] [InitializationType: REST|gRPC|Messaging|CronJob]
```
