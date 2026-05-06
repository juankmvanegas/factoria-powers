---
name: swf-generate-tests
description: "Generate test suite for any iOS/Swift component — ViewModel, Api, Coordinator — with Factory DI and Combine patterns"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate a comprehensive test suite for any iOS/Swift component. Detects the component type (ViewModel, Api, Coordinator, Utils) and generates the appropriate test class with `@MainActor`, MockApi/MockCoordinador, Combine expectations, and Spy pattern for coordinator navigation.

## Execution Flow — 7 Strict Steps

### Step 1: Detect Component Type

Read the target file and classify:

| Type | Detection Criteria |
|------|-------------------|
| ViewModel | Class has `@MainActor`, `ObservableObject`, `@Published` |
| Api | Class conforms to `*ApiProtocol` or uses Alamofire |
| Coordinator | Class conforms to `CoordinadorProtocol` or `NavegacionBase` |
| Utils | Pure functions, extensions, helpers |

### Step 2: Analyze Dependencies

1. List all protocol dependencies (for mocking)
2. Identify `@Injected` and `@DynamicInjected` properties
3. Map Combine publisher chains and subscriptions
4. Identify Coordinator interactions (navigation calls)
5. List all `@Published` properties and their types

### Step 3: Generate Mock Classes

For each protocol dependency, generate a mock:

```swift
final class MockFeatureApi: FeatureApiProtocol {
    // nonisolated for mock properties — required for Sendable conformance
    nonisolated(unsafe) var resultToReturn: Result<FeatureModel, Error> = .success(.mock)
    nonisolated(unsafe) var callCount = 0

    func obtenerDatos() -> AnyPublisher<FeatureModel, Error> {
        callCount += 1
        return resultToReturn.publisher.eraseToAnyPublisher()
    }
}
```

For Coordinator spies:

```swift
final class SpyCoordinador: CoordinadorProtocol {
    nonisolated(unsafe) var navegarACalled = false
    nonisolated(unsafe) var ultimaRuta: String?
    nonisolated(unsafe) var navegarACallCount = 0

    func navegarA(_ ruta: String) {
        navegarACalled = true
        ultimaRuta = ruta
        navegarACallCount += 1
    }
}
```

### Step 4: Generate Test Class Structure

```swift
@MainActor
final class FeatureViewModelTests: XCTestCase {
    private var sut: FeatureViewModel!
    private var mockApi: MockFeatureApi!
    private var spyCoordinador: SpyCoordinador!
    private var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        mockApi = MockFeatureApi()
        spyCoordinador = SpyCoordinador()
        cancellables = []
        // Register mocks in Factory container
        Container.shared.featureApi.register { self.mockApi }
        Container.shared.coordinador.register { self.spyCoordinador }
        sut = FeatureViewModel()
    }

    override func tearDown() {
        Container.shared.manager.reset()
        cancellables = nil
        sut = nil
        mockApi = nil
        spyCoordinador = nil
        super.tearDown()
    }
}
```

### Step 5: Generate Test Methods

For each public method in the component, generate tests using AAA pattern:

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
    XCTAssertFalse(sut.isLoading)
    XCTAssertNil(sut.errorMessage)
}

func test_cargarDatos_failure_setsErrorMessage() {
    // Arrange
    mockApi.resultToReturn = .failure(NSError(domain: "", code: -1))
    let expectation = expectation(description: "Error set")

    sut.$errorMessage
        .dropFirst()
        .sink { value in
            if value != nil { expectation.fulfill() }
        }
        .store(in: &cancellables)

    // Act
    sut.cargarDatos()

    // Assert
    wait(for: [expectation], timeout: 2.0)
    XCTAssertNotNil(sut.errorMessage)
    XCTAssertFalse(sut.isLoading)
}
```

For Coordinator navigation tests (Spy pattern):

```swift
func test_navegarADetalle_validId_callsCoordinator() {
    // Arrange
    let itemId = "123"

    // Act
    sut.navegarADetalle(id: itemId)

    // Assert
    XCTAssertTrue(spyCoordinador.navegarACalled)
    XCTAssertEqual(spyCoordinador.ultimaRuta, "detalle/123")
    XCTAssertEqual(spyCoordinador.navegarACallCount, 1)
}
```

### Step 6: Generate Edge Case Tests

For every method, also generate:

1. Empty/nil input tests
2. Multiple consecutive call tests
3. Race condition tests (call while loading)
4. Error state reset tests (retry after failure)

### Step 7: Validate Coverage

1. Verify every `@Published` property has at least one test
2. Verify every public method has success + failure tests
3. Verify Coordinator navigation paths are covered
4. Check coverage meets thresholds: 80% ViewModel, 70% Api, 90% Utils

## Auto-Shielding

- **ABORT** if ViewModel does not have `@MainActor` annotation — fix the ViewModel first
- **ABORT** if dependencies are not protocol-based — cannot mock concrete types
- **WARN** if ViewModel has more than 8 `@Published` properties — suggest decomposition before testing
- **WARN** if no mock `.mock` static property exists on model types — suggest creating it

## Rules

1. All test classes annotated with `@MainActor`
2. Use `nonisolated(unsafe)` for mock stored properties to avoid Sendable warnings
3. Always register mocks in Factory `Container.shared` in `setUp()`
4. Always call `Container.shared.manager.reset()` in `tearDown()`
5. Use `.dropFirst().sink` for `@Published` property observation to skip initial value
6. Use `timeout: 2.0` for all `wait(for:timeout:)` calls
7. Follow naming convention: `test_method_scenario_expectedResult`
8. Separate Arrange/Act/Assert with comments
9. One assertion concept per test method
10. Use Spy pattern for Coordinator — track calls, arguments, and call count
11. Never use `sleep()` or `Thread.sleep()` in tests — use XCTestExpectation
12. Generate `.mock` static properties on model types if they don't exist
