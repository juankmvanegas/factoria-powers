# Skill: Generate Feature Tests

## Purpose
Generate a comprehensive test suite for a new or existing feature module,
following the project's testing policy and Swift/iOS conventions. Covers
ViewModel tests with @MainActor, mock APIs with Combine publishers,
Coordinator spies, and XCTestExpectation for async flows.

## When to Use
- After creating a new ViewModel in any feature module
- When adding new methods to existing ViewModels
- When refactoring ViewModels and tests need updating
- When a feature module lacks adequate test coverage

## Inputs Required
1. **Feature module name** — The SPM module to test (e.g., `Compras`, `Creditos`)
2. **ViewModel name** — The ViewModel class to test
3. **Methods to test** — List of methods with expected behaviors
4. **Dependencies** — Protocols the ViewModel depends on (for mocking)

## Output Structure
```
Feature/Tests/FeatureTests/
├── ViewModelTests/
│   └── [ViewModel]Tests.swift       # @MainActor XCTestCase
├── ApiTests/
│   └── [Feature]ApiTests.swift      # API implementation tests
└── Mocks/
    ├── Mock[Feature]Api.swift       # MockApi with Result+Future
    └── Mock[Feature]Coordinador.swift  # Spy coordinator
```

## Process
1. Read the ViewModel source code to identify:
   - All @Published properties
   - All public methods
   - All dependencies (protocols)
   - Combine publisher subscriptions
   - Coordinator interactions
2. Generate MockApi class:
   ```swift
   final class MockFeatureApi: FeatureApiProtocol {
       var resultToReturn: Result<FeatureModel, Error> = .success(.mock)
       
       func obtenerDatos() -> AnyPublisher<FeatureModel, Error> {
           resultToReturn.publisher.eraseToAnyPublisher()
       }
   }
   ```
3. Generate MockCoordinador spy:
   ```swift
   final class MockFeatureCoordinador: NavegacionBaseProtocol {
       var navegarACalled = false
       var ultimaRuta: String?
       
       func navegarA(_ ruta: String) {
           navegarACalled = true
           ultimaRuta = ruta
       }
   }
   ```
4. Generate XCTestCase class with @MainActor:
   ```swift
   @MainActor
   final class FeatureViewModelTests: XCTestCase {
       private var sut: FeatureViewModel!
       private var mockApi: MockFeatureApi!
       private var cancellables: Set<AnyCancellable>!
       
       override func setUp() {
           super.setUp()
           mockApi = MockFeatureApi()
           sut = FeatureViewModel(api: mockApi)
           cancellables = []
           // Register mocks in Factory container
           Container.shared.featureApi.register { self.mockApi }
       }
       
       override func tearDown() {
           Container.shared.manager.reset()
           cancellables = nil
           sut = nil
           mockApi = nil
           super.tearDown()
       }
   }
   ```
5. Generate test methods using XCTestExpectation for Combine:
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
   ```
6. Verify coverage meets thresholds: 80% ViewModel, 70% Api, 90% Utils

## Auto-Shielding
- **ABORT** if ViewModel does not have @MainActor annotation — fix the ViewModel first
- **ABORT** if ViewModel dependencies are not protocol-based — cannot mock concrete types
- **WARN** if the ViewModel has more than 8 @Published properties — suggest decomposition

## Rules
1. Follow AAA pattern (Arrange-Act-Assert) with `// Arrange`, `// Act`, `// Assert` comments
2. Name tests: `test_method_scenario_expectedResult`
3. One behavior per test
4. Use XCTestExpectation for all async/Combine flows
5. Mock all protocol dependencies — never use real API or database
6. Register mocks in Factory container in setUp, reset in tearDown
7. Test both success and failure paths for every API call
8. Test @Published property updates via Combine sink + expectation
9. Verify `isLoading` transitions (true → false)
10. Verify `errorMessage` is set on failure paths
11. Test Coordinator navigation calls via spy pattern
12. Use `[weak self]` checks — verify no retain cycles by testing deallocation
13. Create `.mock` static properties on model types for test data
