# Testing Policy

> **Mandatory**: All production code must have tests. No code is delivered without tests. This policy is not optional and cannot be skipped by user request.

Applicable to iOS applications built with Swift 5.10+, SwiftUI, MVVM, SPM Modules, Factory DI, XCTest, Combine.

## 1. Testing Strategy

### Test Pyramid

| Level | Framework | Scope | Speed |
|-------|-----------|-------|-------|
| **Unit Tests** | XCTest | ViewModels, ApiImplementacion, Utils, Coordinators | Fast (< 0.1s each) |
| **Integration Tests** | XCTest | API + Realm, Coordinator flows, DI container | Medium (< 1s each) |
| **UI Tests** | XCUITest | Critical user journeys, navigation flows | Slow (< 10s each) |
| **Snapshot Tests** | Swift Snapshot Testing (if adopted) | Visual regression for CoreUI components | Fast |

### Test Scope per Layer

| Layer | What to Test | What NOT to Test |
|-------|-------------|-----------------|
| **ViewModel** | State transitions, Combine publisher emissions, error handling, coordinator calls | Private methods directly |
| **ApiImplementacion** | Request construction, response parsing, error mapping | Actual network calls (mock) |
| **Coordinador** | Navigation decisions, screen presentation logic | UIKit/SwiftUI framework internals |
| **Utils/Extensions** | All public functions, edge cases, boundary values | Trivial getters/setters |
| **Views** | Only via UI tests for critical flows | Layout details, pixel-perfect positioning |

## 2. Test Structure

### Project Organization

```
Feature/
├── Sources/
│   ├── DatosFeature/
│   └── PresentacionFeature/
└── Tests/
    └── FeatureTests/
        ├── ViewModelTests/
        │   ├── NotasViewModelTests.swift
        │   └── DetalleNotaViewModelTests.swift
        ├── ApiTests/
        │   ├── NotasApiImplementacionTests.swift
        │   └── EnrutadorApiNotasTests.swift
        ├── CoordinadorTests/
        │   └── CoordinadorNotasTests.swift
        └── Mocks/
            ├── MockNotasApi.swift
            ├── MockCoordinadorNotas.swift
            └── MockAlmacenamientoNotas.swift
```

### Rules
- Tests live in `Tests/[Module]Tests/` — **never** inside `Sources/`
- Mirror the source directory structure inside the test directory
- One test file per source file being tested
- Mocks shared within the module live in `Tests/[Module]Tests/Mocks/`
- Mocks shared across modules live in `Core/Tests/CoreTests/Mocks/`

## 3. Naming Convention

### Format: `test_<method>_<condition>_<result>`

Since domain code uses Spanish naming, test method names reflect that:

```swift
// ViewModel tests
func test_cargarDatos_cuandoApiExitosa_actualizaRespuesta()
func test_cargarDatos_cuandoApiFalla_actualizaMensajeError()
func test_eliminarNota_cuandoNoExiste_noLlamaApi()
func test_iniciarSesion_cuandoTokenExpirado_refrescaToken()

// API tests
func test_obtenerNotas_cuandoRespuesta200_decodificaCorrectamente()
func test_obtenerNotas_cuandoRespuesta401_retornaErrorNoAutorizado()
func test_crearNota_cuandoDatosInvalidos_retornaErrorValidacion()

// Coordinator tests
func test_navegar_cuandoSeleccionaNota_presentaDetalle()
func test_navegar_cuandoCierraSesion_regresaALogin()
```

### Prohibited Naming
- `testExample()`, `test1()`, `testSuccess()` — meaningless names
- Names without the three parts (method, condition, result)
- English-only names when the method under test uses Spanish naming

## 4. XCTestCase Base Patterns

### Standard Test Class Structure

```swift
import XCTest
import Combine
import Factory
@testable import PresentacionFeature

@MainActor
final class NotasViewModelTests: XCTestCase {
    
    // MARK: - Properties
    private var sut: NotasViewModel!
    private var mockApi: MockNotasApi!
    private var mockCoordinador: MockCoordinadorNotas!
    private var cancellables: Set<AnyCancellable>!
    
    // MARK: - Lifecycle
    override func setUp() {
        super.setUp()
        cancellables = Set<AnyCancellable>()
        mockApi = MockNotasApi()
        mockCoordinador = MockCoordinadorNotas()
        
        // Register mocks in Factory DI
        Container.shared.notasApi.register { self.mockApi }
        Container.shared.coordinadorNotas.register { self.mockCoordinador }
        
        sut = NotasViewModel()
    }
    
    override func tearDown() {
        sut = nil
        mockApi = nil
        mockCoordinador = nil
        cancellables = nil
        Container.shared.reset()
        super.tearDown()
    }
}
```

### Required Patterns
- `@MainActor` on all test classes that test ViewModels (ViewModels are `@MainActor`)
- `cancellables` set initialized in `setUp`, nilled in `tearDown`
- `sut` (System Under Test) naming for the object being tested
- `super.setUp()` called first, `super.tearDown()` called last
- All properties declared as implicitly unwrapped optionals (`!`) and nilled in `tearDown`

## 5. Factory DI in Tests

### Registration Pattern

```swift
override func setUp() {
    super.setUp()
    // Register all dependencies as mocks
    Container.shared.notasApi.register { MockNotasApi() }
    Container.shared.coordinadorNotas.register { MockCoordinadorNotas() }
    Container.shared.almacenamientoDatos.register { MockAlmacenamientoDatos() }
}

override func tearDown() {
    // ALWAYS reset the container to prevent test pollution
    Container.shared.reset()
    super.tearDown()
}
```

### Rules
- **Always** call `Container.shared.reset()` in `tearDown` — never leave mock registrations active
- Register mocks for **all** dependencies the SUT uses — never rely on production registrations
- Use `.register { }` (factory closure) — never `.register(MockApi())` (retained instance) unless intentional
- For scoped dependencies, register `.scope(.cached)` only when testing caching behavior
- Test that DI container resolves correctly in integration tests

## 6. Spy Pattern

### MockCoordinador with Enum Invocaciones

```swift
@MainActor
final class MockCoordinadorNotas: CoordinadorNotasProtocol {
    
    enum Invocaciones: Equatable {
        case navegarADetalle(id: String)
        case navegarACrear
        case cerrarPantalla
        case mostrarError(mensaje: String)
    }
    
    private(set) var invocaciones: [Invocaciones] = []
    
    func navegarADetalle(id: String) {
        invocaciones.append(.navegarADetalle(id: id))
    }
    
    func navegarACrear() {
        invocaciones.append(.navegarACrear)
    }
    
    func cerrarPantalla() {
        invocaciones.append(.cerrarPantalla)
    }
    
    func mostrarError(mensaje: String) {
        invocaciones.append(.mostrarError(mensaje: mensaje))
    }
}
```

### Usage in Tests

```swift
func test_seleccionarNota_cuandoExiste_navegaADetalle() {
    // Arrange
    let notaId = "nota-123"
    
    // Act
    sut.seleccionarNota(id: notaId)
    
    // Assert
    XCTAssertEqual(mockCoordinador.invocaciones, [.navegarADetalle(id: notaId)])
}

func test_eliminarNota_cuandoConfirmado_cierraPantallaYRecarga() {
    // Arrange
    mockApi.resultadoEliminar = .success(())
    
    // Act
    sut.confirmarEliminacion(id: "nota-123")
    
    // Assert
    XCTAssertTrue(mockCoordinador.invocaciones.contains(.cerrarPantalla))
}
```

### Rules
- Invocaciones enum must conform to `Equatable` for assertion support
- Store invocations in an array — order matters for verifying call sequences
- Each mock method appends to `invocaciones` — nothing else
- Use `private(set)` to prevent test manipulation of the invocation log

## 7. Mock API Pattern

### Result + Future for Combine Publishers

```swift
final class MockNotasApi: NotasApiProtocol {
    
    // Configurable results
    var resultadoObtenerNotas: Result<[NotaModelo], Error> = .success([])
    var resultadoCrearNota: Result<NotaModelo, Error> = .success(NotaModelo.mock())
    var resultadoEliminar: Result<Void, Error> = .success(())
    
    // Call tracking
    var obtenerNotasLlamado = false
    var crearNotaLlamado = false
    var ultimaNotaCreada: CrearNotaInput?
    
    func obtenerNotas() -> AnyPublisher<[NotaModelo], Error> {
        obtenerNotasLlamado = true
        return resultadoObtenerNotas.publisher.eraseToAnyPublisher()
    }
    
    func crearNota(input: CrearNotaInput) -> AnyPublisher<NotaModelo, Error> {
        crearNotaLlamado = true
        ultimaNotaCreada = input
        return resultadoCrearNota.publisher.eraseToAnyPublisher()
    }
    
    func eliminarNota(id: String) -> AnyPublisher<Void, Error> {
        return resultadoEliminar.publisher.eraseToAnyPublisher()
    }
}
```

### Alternative: Future-based Mock

```swift
func obtenerNotas() -> AnyPublisher<[NotaModelo], Error> {
    obtenerNotasLlamado = true
    return Future<[NotaModelo], Error> { promise in
        promise(self.resultadoObtenerNotas)
    }.eraseToAnyPublisher()
}
```

### Rules
- Default mock results to `.success` with sensible defaults — tests override only what they need
- Track both _whether_ a method was called (boolean) and _what_ was passed (captured parameters)
- Use `Result<T, Error>` properties for configurable outcomes
- All publishers must return `AnyPublisher` (same as production protocols)
- Create `.mock()` static factory methods on models for test data

## 8. Combine Testing

### @Published + dropFirst() + sink Pattern

```swift
func test_cargarDatos_cuandoApiExitosa_actualizaRespuesta() {
    // Arrange
    let notasEsperadas = [NotaModelo.mock()]
    mockApi.resultadoObtenerNotas = .success(notasEsperadas)
    let expectation = expectation(description: "Respuesta actualizada")
    
    sut.$response
        .dropFirst()  // Skip initial nil value
        .sink { response in
            XCTAssertEqual(response, notasEsperadas)
            expectation.fulfill()
        }
        .store(in: &cancellables)
    
    // Act
    sut.cargarDatos()
    
    // Assert
    wait(for: [expectation], timeout: 2.0)
}
```

### Multiple Emissions Pattern

```swift
func test_cargarDatos_emiteCargandoYLuegoResultado() {
    // Arrange
    mockApi.resultadoObtenerNotas = .success([NotaModelo.mock()])
    var estados: [Bool] = []
    let expectation = expectation(description: "Loading states")
    expectation.expectedFulfillmentCount = 2
    
    sut.$isLoading
        .dropFirst()
        .sink { isLoading in
            estados.append(isLoading)
            expectation.fulfill()
        }
        .store(in: &cancellables)
    
    // Act
    sut.cargarDatos()
    
    // Assert
    wait(for: [expectation], timeout: 2.0)
    XCTAssertEqual(estados, [true, false])
}
```

### Error Handling Pattern

```swift
func test_cargarDatos_cuandoApiFalla_actualizaMensajeError() {
    // Arrange
    let errorEsperado = NSError(domain: "test", code: 500, userInfo: [NSLocalizedDescriptionKey: "Server error"])
    mockApi.resultadoObtenerNotas = .failure(errorEsperado)
    let expectation = expectation(description: "Error message set")
    
    sut.$errorMessage
        .dropFirst()
        .sink { message in
            XCTAssertEqual(message, "Server error")
            expectation.fulfill()
        }
        .store(in: &cancellables)
    
    // Act
    sut.cargarDatos()
    
    // Assert
    wait(for: [expectation], timeout: 2.0)
}
```

### Rules
- **Standard timeout: 2.0 seconds** for all `wait(for:timeout:)` calls
- Always use `.dropFirst()` on `@Published` subscriptions to skip the initial value
- Use `expectation.expectedFulfillmentCount` when expecting multiple emissions
- Store subscriptions in `cancellables` — never let them go out of scope
- One expectation per behavior — do not assert multiple unrelated behaviors in one test
- Use `XCTAssertEqual` on collected arrays for ordered emission testing

## 9. Async Testing

### Testing async/await Methods

```swift
func test_cargarDatosAsync_cuandoExitoso_actualizaEstado() async {
    // Arrange
    mockApi.resultadoObtenerNotas = .success([NotaModelo.mock()])
    
    // Act
    await sut.cargarDatosAsync()
    
    // Assert
    XCTAssertFalse(sut.isLoading)
    XCTAssertNotNil(sut.response)
    XCTAssertNil(sut.errorMessage)
}
```

### Testing Internal Task{} Patterns

When the production code spawns `Task {}` internally (not async method signature):

```swift
func test_inicializar_cuandoTieneToken_cargaDatosEnSegundoPlano() {
    // Arrange
    mockApi.resultadoObtenerNotas = .success([NotaModelo.mock()])
    let expectation = expectation(description: "Datos cargados")
    
    sut.$response
        .dropFirst()
        .sink { _ in expectation.fulfill() }
        .store(in: &cancellables)
    
    // Act
    sut.inicializar()  // Internally creates Task {}
    
    // Assert
    wait(for: [expectation], timeout: 2.0)
    XCTAssertNotNil(sut.response)
}
```

### Rules
- Prefer `async` test functions when the SUT exposes `async` methods directly
- Use `XCTestExpectation` + `wait(for:timeout:)` when testing code that internally spawns `Task {}`
- Never use `Task.sleep` in tests to wait for results — use expectations instead
- For `@MainActor` test classes, `async` test methods execute on the main actor automatically
- Test both success and failure paths for every async operation

## 10. Coverage Policy

### Minimum Coverage Thresholds

| Component | Minimum Coverage | Target |
|-----------|-----------------|--------|
| **ViewModels** | 80% | 90% |
| **ApiImplementacion** | 70% | 80% |
| **Utils / Extensions** | 90% | 95% |
| **Coordinadores** | 70% | 80% |
| **Realm Repositories** | 60% | 75% |
| **Core Module** | 75% | 85% |
| **CoreUI Components** | 40% | 60% |

### What Counts Toward Coverage
- Unit tests (primary)
- Integration tests
- UI tests (minimal coverage contribution expected)

### What is Excluded from Coverage Requirements
- Generated code (protobuf, SwiftGen output)
- `@main` app entry point
- SwiftUI `PreviewProvider` / `#Preview` blocks
- Third-party dependency wrappers with trivial pass-through logic

### Rules
- Coverage is measured per SPM module using Xcode coverage reports
- New code must meet or exceed the thresholds — no regressions
- Coverage alone does not guarantee quality — tests must assert meaningful behavior
- CI pipeline fails if coverage drops below minimum thresholds

## 11. Test Assertions

| Assertion | Use Case | Example |
|-----------|----------|---------|
| `XCTAssertEqual(a, b)` | Exact value comparison | `XCTAssertEqual(sut.response?.count, 3)` |
| `XCTAssertNotEqual(a, b)` | Value inequality | `XCTAssertNotEqual(sut.errorMessage, nil)` |
| `XCTAssertTrue(expr)` | Boolean true condition | `XCTAssertTrue(mockApi.obtenerNotasLlamado)` |
| `XCTAssertFalse(expr)` | Boolean false condition | `XCTAssertFalse(sut.isLoading)` |
| `XCTAssertNil(expr)` | Value is nil | `XCTAssertNil(sut.errorMessage)` |
| `XCTAssertNotNil(expr)` | Value is not nil | `XCTAssertNotNil(sut.response)` |
| `XCTAssertThrowsError(expr)` | Expression throws | `XCTAssertThrowsError(try sut.validar(input))` |
| `XCTAssertNoThrow(expr)` | Expression does not throw | `XCTAssertNoThrow(try sut.parsear(json))` |
| `XCTAssertGreaterThan(a, b)` | Numeric comparison | `XCTAssertGreaterThan(sut.items.count, 0)` |
| `XCTAssertLessThanOrEqual(a, b)` | Upper bound check | `XCTAssertLessThanOrEqual(duration, 2.0)` |
| `XCTFail(message)` | Force test failure | `XCTFail("Should not reach this code path")` |

### Assertion Rules
- Use the most specific assertion available — `XCTAssertEqual` over `XCTAssertTrue(a == b)`
- Include descriptive messages for non-obvious assertions: `XCTAssertTrue(result, "Expected valid response after retry")`
- For collection assertions, assert both count and content when meaningful
- For Equatable types, prefer `XCTAssertEqual` — it provides better failure messages

## 12. CI/CD Integration

### Test Execution Order

```
1. Architecture Tests    → Validate module boundaries
2. Unit Tests           → ViewModels, APIs, Utils, Coordinators
3. Integration Tests    → DI container resolution, Realm persistence, API flows  
4. UI Tests             → Critical user journeys only
```

### Pipeline Rules
- **All tests must pass** before merge — no exceptions
- Test failures block deployment to any environment
- Architecture tests run first — if module boundaries are broken, stop immediately
- Unit tests run in parallel per SPM module for speed
- UI tests target only critical paths (login, main navigation, key transactions)
- Test results are published to the CI dashboard with per-module breakdown
- Flaky tests must be fixed within 24 hours or quarantined with a tracking issue

### Build Configurations for Testing
- Unit tests run against `Debug` configuration
- Integration tests run against `Debug` configuration with mock server
- UI tests run against `Debug` configuration with mock backend
- Never run tests against production endpoints

## 13. Prohibited Practices

| Practice | Reason |
|----------|--------|
| Testing private methods directly | Violates encapsulation; test through public API |
| Multiple unrelated behaviors per test | Masks failures; one behavior per test method |
| Force unwrapping (`!`) in production code | Crashes on nil; use `guard let` / `if let` |
| Tests that depend on execution order | Tests must be independently runnable |
| Tests that depend on network availability | All network calls must be mocked |
| Tests that depend on specific dates/times | Inject date providers; never use `Date()` directly |
| Shared mutable state between tests | Reset all state in `setUp` / `tearDown` |
| Tests without assertions | A test that cannot fail provides no value |
| Sleeping in tests (`Thread.sleep`, `Task.sleep`) | Slows CI; use expectations with timeout |
| Ignoring or disabling tests without a tracking issue | Dead tests are technical debt |
| Testing framework internals (SwiftUI, Combine) | Not our code; test our logic using the framework |
| Asserting on `@Published` without `.dropFirst()` | Initial value triggers false positives |
