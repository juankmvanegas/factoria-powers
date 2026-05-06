# ADR-010: Combine + @Published for Reactive State Management

## Status
Accepted

## Date
2025-01-15

## Context
SwiftUI views re-render based on observable state changes. The application needs a consistent reactive data flow pattern that works well with SwiftUI's rendering cycle, supports async operations (network calls, database queries), and remains testable. Raw callbacks, delegate chains, and NotificationCenter lead to fragmented state management and make it difficult to reason about data flow. A unified reactive approach is required that the entire team can follow without ambiguity.

## Decision
We adopt **Combine** with **`@Published`** properties as the standard reactive state management pattern for all ViewModels.

### Core Rules

1. **`@MainActor`** is required on all ViewModels to guarantee UI state mutations happen on the main thread:
   ```swift
   @MainActor
   final class ListadoViewModel: ObservableObject {
       @Published var items: [Elemento] = []
       @Published var estaCargando: Bool = false
       @Published var error: ErrorPresentable?
   }
   ```

2. **`@Published`** is the only mechanism for exposing observable state from ViewModels to Views. No manual `objectWillChange.send()` calls.

3. **`.dropFirst().sink`** is the standard pattern for testing `@Published` property changes, avoiding the initial value emission:
   ```swift
   func testCargaItems() {
       let expectation = expectation(description: "items cargados")
       viewModel.$items
           .dropFirst()
           .sink { items in
               XCTAssertEqual(items.count, 3)
               expectation.fulfill()
           }
           .store(in: &cancellables)
       
       viewModel.cargarItems()
       waitForExpectations(timeout: 2)
   }
   ```

4. **`AnyCancellable` sets** with `store(in:)` manage subscription lifetimes. Every ViewModel declares a private set:
   ```swift
   private var cancellables = Set<AnyCancellable>()
   ```

5. **No raw callbacks** for async data flow. Network services and repositories return Combine publishers:
   ```swift
   protocol ServicioUsuarioProtocol {
       func obtenerPerfil() -> AnyPublisher<Usuario, ErrorServicio>
   }
   ```

6. **`eraseToAnyPublisher()`** is mandatory on all public API returns to hide implementation details:
   ```swift
   func obtenerItems() -> AnyPublisher<[Elemento], ErrorServicio> {
       return urlSession.dataTaskPublisher(for: request)
           .map(\.data)
           .decode(type: [Elemento].self, decoder: JSONDecoder())
           .mapError { ErrorServicio.red($0) }
           .eraseToAnyPublisher()
   }
   ```

7. **Combine operators** are preferred over imperative state management. Use `.map`, `.flatMap`, `.combineLatest`, `.debounce`, `.removeDuplicates` to compose reactive pipelines.

8. **Error handling** in Combine chains uses `.catch` or `.replaceError` to map failures into presentable error states on `@Published` properties rather than letting errors terminate the pipeline.

## Consequences

### Positive
- Single reactive model across the entire codebase — no mixing of callbacks, delegates, and publishers
- `@MainActor` eliminates data race issues for UI state
- `@Published` integrates natively with SwiftUI's observation system — zero boilerplate
- Combine pipelines are composable and declarative, improving readability
- Testing is straightforward with `.dropFirst().sink` and `XCTestExpectation`

### Negative
- Combine has a steep learning curve for developers unfamiliar with reactive programming
- Debugging Combine chains (especially long `flatMap` sequences) can be difficult
- `@MainActor` requires `nonisolated` annotations on certain mock properties in tests

### Risks
- **Retain cycles:** Forgetting `[weak self]` in `.sink` closures causes memory leaks. **Mitigation:** SwiftLint rule enforces `[weak self]` in escaping closures. Code review checklist includes cancellable lifecycle verification.
- **Pipeline termination:** An unhandled error kills the subscription permanently. **Mitigation:** All Combine chains must include explicit error handling (`.catch`, `.retry`, or `.replaceError`). Pipeline termination is flagged as a bug.
- **Over-composition:** Deeply nested Combine chains become unreadable. **Mitigation:** Extract intermediate publishers into named computed properties. No chain exceeds 6 operators without extraction.
