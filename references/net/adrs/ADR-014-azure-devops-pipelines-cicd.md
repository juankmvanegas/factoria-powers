# ADR-014: Azure DevOps Pipelines for CI/CD

## Status
Accepted

## Date
2023-04-19

## Context
The organization uses Azure DevOps for source control and needs automated
build, test, and deployment pipelines.

## Decision
Use Azure DevOps Pipelines with YAML definitions per service type.

### Pipeline Definitions
| File | Service Type |
|---|---|
| `azure-pipelines.yaml` | REST API service |
| `azure-pipelines-grpc.yaml` | gRPC service |
| `azure-pipelines-mesaaging.yaml` | Messaging service |

### Pipeline Stages
1. **Build** - `dotnet restore`, `dotnet build --configuration Release`
2. **Test** - Unit tests, Architecture tests, Integration tests
3. **Publish** - `dotnet publish`
4. **Deploy** - Per environment (Dev, QA, Prod)

### GitHub Actions Alternative
A GitHub Actions agent (`cicd-deploy-net.agent.md`) provides equivalent
workflow generation for GitHub-hosted repositories using the same patterns.

### Environment Strategy
- **Development** - Auto-deploy from `develop` branch
- **QA** - Auto-deploy from `main`/`master`, requires approval
- **Production** - Manual deploy with version tag, requires approval

## Consequences
- Pipeline files in `.azuredevops/` directory
- Each service type has its own pipeline
- Tests are mandatory gates before deployment
- Secrets injected from Azure Key Vault via pipeline variables
