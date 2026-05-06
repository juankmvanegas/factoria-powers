---
name: swf-calidad
description: "Quality gates — testing and automatic validation for iOS/Swift"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Quality — Testing and Automatic Validation

This skill is automatically activated when writing tests, validations, or quality checks after code changes.

## Quality Gates

All gates must pass before code is considered complete:

| Gate | Threshold | Tool |
|------|-----------|------|
| ViewModel test coverage | ≥ 80% | Xcode Coverage |
| Api test coverage | ≥ 70% | Xcode Coverage |
| Utils test coverage | ≥ 90% | Xcode Coverage |
| SwiftLint warnings | 0 | SwiftLint |
| Build succeeds | No errors | swift build / xcodebuild |
| All tests pass | 100% | swift test / xcodebuild test |
| Architecture compliance | No violations | Module dependency check |

## Mandatory AAA Pattern

All tests must follow the **Arrange-Act-Assert** pattern explicitly:

1. **Arrange** — Prepare the initial state: create objects, configure mocks, register in Factory container.
2. **Act** — Execute the action under test: invoke the ViewModel method.
3. **Assert** — Verify the result: check @Published values, Coordinator calls, error states.

Separate each section with a `// Arrange`, `// Act`, `// Assert` comment for readability.

## Naming Convention

Name each test method with the format:

```
test_method_scenario_expectedResult
```

Examples:
- `test_cargarDatos_success_updatesResponse`
- `test_cargarDatos_networkError_setsErrorMessage`
- `test_navegarADetalle_validId_callsCoordinator`

## @MainActor Test Classes

All ViewModel test classes MUST be annotated with `@MainActor`:

```swift
@MainActor
final class FeatureViewModelTests: XCTestCase {
    // ...
}
```

## Factory DI in Tests

- Register mocks in `setUp()`:
  ```swift
  Container.shared.featureApi.register { self.mockApi }
  ```
- Reset container in `tearDown()`:
  ```swift
  Container.shared.manager.reset()
  ```

## Combine Testing with XCTestExpectation

For testing @Published property changes:

```swift
func test_cargarDatos_success_updatesResponse() {
    // Arrange
    let expected = FeatureModel.mock
    mockApi.resultToReturn = .success(expected)
    let expectation = expectation(description: "Response updated")
    
    sut.$response
        .dropFirst()
        .sink { value in
            if value != nil { expectation.fulfill() }
        }
        .store(in: &cancellables)
    
    // Act
    sut.cargarDatos()
    
    // Assert
    wait(for: [expectation], timeout: 2.0)
    XCTAssertEqual(sut.response, expected)
}
```

## Mock Patterns

### MockApi with Result Control
```swift
final class MockFeatureApi: FeatureApiProtocol {
    var resultToReturn: Result<FeatureModel, Error> = .success(.mock)
    
    func obtenerDatos() -> AnyPublisher<FeatureModel, Error> {
        resultToReturn.publisher.eraseToAnyPublisher()
    }
}
```

### MockCoordinator Spy
```swift
final class MockCoordinador: NavegacionBaseProtocol {
    var navegarACalled = false
    var ultimaRuta: String?
    
    func navegarA(_ ruta: String) {
        navegarACalled = true
        ultimaRuta = ruta
    }
}
```

## One Behavior per Test

- Each test verifies **one single behavior** or scenario.
- Do not combine multiple assertions testing different behaviors in the same test.
- If a test needs multiple asserts, they must all verify facets of the **same** result.

## CI Execution Order

1. `swift build` — compile all SPM modules
2. `swift test` — run all unit tests
3. `swiftlint` — lint check
4. Coverage report generation
5. Architecture dependency validation

## Auto-Shielding

- **ABORT** if `swift build` fails — fix compilation before running tests
- **ABORT** if test coverage drops below thresholds — add missing tests
- **WARN** if SwiftLint reports more than 5 warnings — clean up before proceeding

## Rules

1. Quality gates are non-negotiable — all must pass
2. Never skip tests to "move faster"
3. Coverage thresholds apply to new and modified code
4. SwiftLint configuration is the project's `.swiftlint.yml` — do not override
5. Architecture tests validate Package.swift dependency rules
6. Record quality gate results in audit trail
