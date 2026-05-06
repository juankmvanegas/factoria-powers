# ADR-011: XCTest with Spy Pattern for Unit Testing

## Status
Accepted

## Date
2025-01-15

## Context
The application follows MVVM with Coordinator navigation and Combine-based reactive state. Unit tests must verify ViewModel logic, navigation calls, and async data flows without depending on real network services, databases, or UI rendering. A consistent mocking and verification strategy is needed that works with Swift's actor isolation model, Factory DI's registration system, and Combine's asynchronous nature.

## Decision
We adopt **XCTest** with the **Spy pattern** as the standard unit testing approach. Spies record method invocations and allow tests to assert on what was called, with what arguments, and how many times.

### Core Rules

1. **MockCoordinador** uses an `enum Invocaciones` to record navigation calls for verification:
   ```swift
   final class MockCoordinador: CoordinadorPerfilProtocol {
       enum Invocaciones: Equatable {
           case navegarADetalle(id: String)
           case navegarAEdicion
           case cerrarSesion
           case volver
       }
       
       nonisolated(unsafe) var invocaciones: [Invocaciones] = []
       
       func navegarADetalle(id: String) {
           invocaciones.append(.navegarADetalle(id: id))
       }
       func navegarAEdicion() {
           invocaciones.append(.navegarAEdicion)
       }
   }
   ```

2. **MockApi** uses `Result` + `Future` to provide controllable Combine publishers:
   ```swift
   final class MockServicioUsuario: ServicioUsuarioProtocol {
       var resultadoPerfil: Result<Usuario, ErrorServicio> = .failure(.desconocido)
       
       func obtenerPerfil() -> AnyPublisher<Usuario, ErrorServicio> {
           Future { [weak self] promise in
               guard let self else { return }
               promise(self.resultadoPerfil)
           }.eraseToAnyPublisher()
       }
   }
   ```

3. **`XCTestExpectation`** is required for all Combine-based async testing:
   ```swift
   func testObtenerPerfilExitoso() {
       let mockServicio = MockServicioUsuario()
       mockServicio.resultadoPerfil = .success(Usuario.mock)
       Container.shared.servicioUsuario.register { mockServicio }
       
       let expectation = expectation(description: "perfil cargado")
       viewModel.$usuario
           .dropFirst()
           .sink { usuario in
               XCTAssertEqual(usuario?.nombre, "Juan")
               expectation.fulfill()
           }
           .store(in: &cancellables)
       
       viewModel.cargarPerfil()
       waitForExpectations(timeout: 2)
   }
   ```

4. **`nonisolated`** (or `nonisolated(unsafe)`) is used on mock properties that need cross-actor access in tests:
   ```swift
   final class MockCoordinador: CoordinadorProtocol {
       nonisolated(unsafe) var invocaciones: [Invocaciones] = []
   }
   ```

5. **Factory DI `.register` / `.reset`** in `setUp` / `tearDown` ensures test isolation:
   ```swift
   class PerfilViewModelTests: XCTestCase {
       var viewModel: PerfilViewModel!
       var cancellables = Set<AnyCancellable>()
       
       override func setUp() {
           super.setUp()
           Container.shared.servicioUsuario.register { MockServicioUsuario() }
           Container.shared.coordinadorPerfil.register { MockCoordinador() }
           viewModel = PerfilViewModel()
       }
       
       override func tearDown() {
           cancellables.removeAll()
           Container.shared.reset()
           viewModel = nil
           super.tearDown()
       }
   }
   ```

6. **One assertion focus per test.** Each test method verifies a single behavior, even if multiple `@Published` properties change. Split into separate tests for each property.

7. **Naming convention:** Test methods follow `test[Method]_[Scenario]_[ExpectedResult]`:
   ```swift
   func testCargarPerfil_servicioRetornaExito_actualizaUsuario()
   func testCargarPerfil_servicioRetornaError_muestraError()
   func testSeleccionarItem_navegaADetalle()
   ```

## Consequences

### Positive
- Spy pattern makes navigation verification explicit and readable
- `Result` + `Future` mocks give full control over async Combine responses
- Factory DI `.register` / `.reset` provides hermetic test isolation with minimal boilerplate
- `enum Invocaciones` with `Equatable` enables precise assertion on navigation sequences
- Tests run without network, database, or UI dependencies

### Negative
- Each protocol requires a manual mock/spy class — no code generation is used
- `nonisolated(unsafe)` is a pragmatic workaround for Swift concurrency strictness in tests and must not leak into production code
- Combine-based tests with `XCTestExpectation` can be timing-sensitive if timeouts are too short

### Risks
- **Mock drift:** Mocks can fall out of sync when protocols change. **Mitigation:** Compiler enforces protocol conformance — missing methods cause build errors in test targets.
- **Forgotten `.reset()`:** Test state leaks across test cases if `tearDown` is not implemented correctly. **Mitigation:** `PruebaBase` base class handles `Container.shared.reset()` automatically; all test classes inherit from it.
- **Flaky async tests:** Race conditions in Combine pipelines may cause intermittent failures. **Mitigation:** Default timeout is 2 seconds. Tests that require longer use explicit justification. `waitForExpectations` is always preferred over `sleep`.
