---
name: pytml-health-check
description: "Full project diagnostic against Factoria standards (0-100)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Purpose

A single command that says "your project meets X% of Factoria standards". Like a full medical checkup: reviews architecture, code standards, security, testing, documentation, and package management.

Does not modify anything. Only reads, analyzes, and reports. The result is an objective score from 0 to 100.

---

## Execution Flow

### Phase 1: Architecture Verification (20 points)

Verify the project follows Factoria's 4-layer structure:

| Check | Points | Criterion |
|-------|--------|----------|
| 4-layer structure | 5 | Core, Application, Infrastructure, Initialization projects exist (or equivalents) |
| Core without NuGet deps | 4 | Core .csproj has no `<PackageReference>` (except pure abstractions) |
| Application only references Core | 3 | Application .csproj only has `<ProjectReference>` to Core |
| Infrastructure does not reference Initialization | 3 | Infrastructure does not depend on presentation layer |
| No circular dependencies | 3 | No cycles in the dependency graph between projects |
| Separation of concerns | 2 | Entities in Core, Services in Application, Repositories in Infrastructure, Controllers in Initialization |

### Phase 2: Standards Verification (20 points)

| Check | Points | Criterion |
|-------|--------|----------|
| Entity naming | 3 | Entities in PascalCase, no "Entity" suffix, in Entities/ or Domain/ |
| Service naming | 3 | Interfaces IXxxService, implementations XxxService |
| DTO naming | 2 | DTOs with Dto or Request/Response suffix |
| Controller naming | 2 | Controllers with Controller suffix, in Controllers/ |
| Validator naming | 2 | Validators with Validator suffix |
| DI registration classes | 2 | Extension classes for per-layer DI registration exist |
| BusinessException | 2 | BusinessException (or Factoria equivalent) used instead of raw exceptions |
| IManageLogs | 2 | IManageLogs used for logging, not static loggers or `Console.Write` |
| AutoMapper profiles | 1 | AutoMapper profiles exist for DTOs |
| FluentValidation | 1 | FluentValidation used at API boundaries |

### Phase 3: Security Verification (25 points)

The highest-weight category — security is critical:

| Check | Points | Criterion |
|-------|--------|----------|
| No secrets in code | 8 | No passwords, API keys, connection strings with credentials in committed .cs or .json files |
| No hardcoded credentials | 5 | No patterns like `password = "..."`, `apiKey = "..."` |
| Azure Key Vault configured | 4 | Azure Key Vault reference exists in Program.cs or configuration |
| No system details in errors | 4 | Exception middleware does not expose stack traces or internal details to clients |
| Input validation | 4 | All controllers with POST/PUT endpoints have input validation |

### Phase 4: Testing Verification (20 points)

| Check | Points | Criterion |
|-------|--------|----------|
| Architecture.Tests exists | 4 | Architecture test project (ArchUnit or similar) |
| Double.Tests exists | 3 | Test project with mocks/stubs |
| Unit.Tests exists | 4 | Unit test project |
| Test naming | 3 | Tests follow `Method_Scenario_ExpectedResult` pattern or consistent similar |
| AAA pattern | 3 | Tests use Arrange-Act-Assert |
| Service coverage | 3 | Each Application service has at least one corresponding test class |

### Phase 5: Documentation Verification (10 points)

| Check | Points | Criterion |
|-------|--------|----------|
| CHANGELOG.md exists | 3 | Exists and has recent entries (not empty or outdated) |
| Architecture documentation | 3 | Documentation exists describing the project architecture |
| ADRs exist | 2 | Architecture Decision Records exist for key decisions |
| README.md exists | 2 | README exists with basic project information |

### Phase 6: Package Management Verification (5 points)

| Check | Points | Criterion |
|-------|--------|----------|
| Directory.Build.props exists | 1.5 | Centralized build properties file |
| Directory.Packages.props exists | 1.5 | Central Package Management enabled |
| Target framework .NET 8.0 | 1 | All projects target net8.0 (or current standard version) |
| No unauthorized packages | 1 | No blacklisted or unapproved packages |

### Phase 7: Report Generation

Generate complete report in `.cloud/planning/health-check/[project]-health.md`.

---

## Strict Rules

1. **Score objectively** — do not inflate scores, do not be generous with partial checks
2. **Security issues are CRITICAL** — weight of 25/100, the highest category
3. **Can be run at any time**, on any project
4. **Non-destructive** — only reads, NEVER modifies project files
5. **If score < 70**: recommend immediate remediation with action plan
6. **If score >= 90**: the project is Factoria-compliant, congratulate the team
7. **If score 70-89**: acceptable but with clear improvement areas
8. **Be specific in recommendations** — "add tests for ItemService" not "improve testing"
9. **Include evidence** — for each failed check, show exactly WHICH file/line has the problem
10. **Register in audit-trail** — each health check execution is recorded
11. **If a previous health check exists**, show comparison and trend
12. **Do not penalize for non-applicable features** — if a project doesn't use gRPC, don't penalize for no .proto
