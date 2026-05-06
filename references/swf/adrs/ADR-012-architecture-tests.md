# ADR-012: Architecture Validation Tests for Module Boundaries

## Status
Accepted

## Date
2025-01-15

## Context
The application is structured as a multi-module Swift Package Manager (SPM) project where feature modules, core modules, and shared libraries have explicit dependency boundaries. Without automated enforcement, developers can inadvertently introduce circular dependencies, bypass module boundaries, or couple feature modules directly to each other. Manual code review alone is insufficient to catch all architectural violations at scale. Automated architecture validation is needed to keep the dependency graph clean and maintainable.

## Decision
We implement **architecture validation tests** that programmatically verify module boundary rules. SPM provides compile-time import enforcement, and we supplement it with test-time verification for rules that SPM alone cannot catch.

### Core Rules

1. **SPM enforces import boundaries at compile time.** Each SPM module declares its dependencies explicitly in `Package.swift`. A module cannot import another module unless it is listed as a dependency:
   ```swift
   .target(
       name: "FeatureAutenticacion",
       dependencies: [
           "CoreRed",
           "CoreModelo",
           "SharedUI"
       ]
   )
   ```

2. **Tests verify no circular dependencies** exist in the module graph. A test parses `Package.swift` and builds a directed graph, then asserts there are no cycles:
   ```swift
   func testNoCircularDependencies() {
       let graph = parseDependencyGraph(from: "Package.swift")
       let cycles = detectCycles(in: graph)
       XCTAssertTrue(cycles.isEmpty, "Circular dependencies found: \(cycles)")
   }
   ```

3. **Tests verify ViewModels don't import UI modules directly.** ViewModel modules must depend only on core/domain modules, never on SwiftUI or UIKit:
   ```swift
   func testViewModelsNoImportanUI() {
       let viewModelFiles = findSwiftFiles(in: "Sources/FeatureAutenticacion/ViewModels")
       for file in viewModelFiles {
           let content = try String(contentsOfFile: file)
           XCTAssertFalse(content.contains("import SwiftUI"),
               "\(file) must not import SwiftUI — ViewModels are UI-agnostic")
           XCTAssertFalse(content.contains("import UIKit"),
               "\(file) must not import UIKit — ViewModels are UI-agnostic")
       }
   }
   ```

4. **Tests verify feature modules don't depend on other feature modules.** Feature-to-feature communication must go through the Coordinator layer or shared contracts:
   ```swift
   func testFeatureModulesIndependientes() {
       let featureModules = modules.filter { $0.hasPrefix("Feature") }
       for module in featureModules {
           let dependencies = getDependencies(for: module)
           let featureDeps = dependencies.filter { $0.hasPrefix("Feature") }
           XCTAssertTrue(featureDeps.isEmpty,
               "\(module) depends on feature modules: \(featureDeps). Feature modules must be independent.")
       }
   }
   ```

5. **Tests verify domain models have no external framework dependencies.** Core model modules must depend only on Foundation:
   ```swift
   func testModelosSinDependenciasExternas() {
       let modelFiles = findSwiftFiles(in: "Sources/CoreModelo")
       for file in modelFiles {
           let imports = extractImports(from: file)
           let allowed = Set(["Foundation", "CoreModelo"])
           let violations = imports.subtracting(allowed)
           XCTAssertTrue(violations.isEmpty,
               "\(file) has forbidden imports: \(violations)")
       }
   }
   ```

6. **Architecture tests run on every CI build** as part of the unit test suite. They are not skipped or marked as optional.

## Consequences

### Positive
- Module boundary violations are caught automatically before code review
- SPM compile-time enforcement prevents unauthorized imports at build time
- Architecture tests catch subtler violations (circular dependencies, feature coupling) that SPM allows but are architecturally wrong
- New developers get immediate feedback when they violate module boundaries
- The dependency graph remains clean and well-documented through tests

### Negative
- Architecture tests require maintenance when new modules are added — the allowed dependency lists must be updated
- Parsing `Package.swift` programmatically can be brittle if the file format changes
- Tests add a small amount of CI build time

### Risks
- **False positives:** A legitimate new dependency is flagged because the test allowlist was not updated. **Mitigation:** Architecture test failures include clear error messages with the violation and instructions to update the allowed list if the dependency is intentional.
- **Incomplete coverage:** Some architectural rules cannot be expressed as simple import checks. **Mitigation:** Code review remains the secondary enforcement layer. Architecture tests cover the most critical boundaries; code review covers nuanced cases.
- **SPM structure changes:** Major refactors to the module graph require updating multiple test assertions. **Mitigation:** Architecture tests read the module graph dynamically from `Package.swift` rather than hardcoding module names where possible.
