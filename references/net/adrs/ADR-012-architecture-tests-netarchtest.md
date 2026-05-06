# ADR-012: Architecture Tests with NetArchTest

## Status
Accepted

## Date
2023-10-09 (Blueprint v2.0.1)

## Context
Architecture rules (layer dependencies, naming conventions) are easily violated
over time without automated enforcement.

## Decision
Use NetArchTest.Rules and ArchUnitNET to validate architecture rules automatically.

### Implementation
- `CheckArchitectureRules.cs` in `Tests/Architecture.Tests/`
- Runs as part of the standard test suite in CI/CD

### Rules Enforced
1. **Core** must not depend on Application, Infrastructure, or Initialization
2. **Application** must not depend on Infrastructure or Initialization
3. **Infrastructure** must not depend on Initialization
4. Naming conventions validation (suffixes, prefixes) — obligatorio
5. Package reference restrictions per layer

### Packages
- `NetArchTest.Rules` 1.3.2
- `TngTech.ArchUnitNET.xUnit` 0.10.6
- `ComplexityAnalyzer` 1.0.0

## Consequences
- Architecture violations fail the build
- New layers or cross-layer dependencies are caught automatically
- Runs in every CI/CD pipeline execution
