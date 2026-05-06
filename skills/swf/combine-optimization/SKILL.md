---
name: swf-combine-optimization
description: "Auto-activated for Combine publisher chains — subscription management, error handling, main thread dispatch, cancellable lifecycle"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Combine Optimization (Auto-Activated)

## Purpose

Auto-activated skill that optimizes Combine publisher chains. Focuses on subscription management, error handling, main thread dispatch, cancellable lifecycle, and memory safety in reactive code.

## Activation Triggers

This skill activates automatically when:
- Creating or editing code with `AnyPublisher`, `Publisher`, `Combine`
- Working with `@Published` properties in ViewModels
- Modifying `sink`, `map`, `flatMap`, `combineLatest` chains
- Touching `cancellables` or `AnyCancellable` storage

## Optimization Checks

### Check 1: Subscription Storage

Every `.sink()` call MUST store the result:

```swift
// ❌ BLOCKED — orphaned subscription
api.obtenerDatos()
    .sink(receiveCompletion: { _ in }, receiveValue: { _ in })

// ✅ CORRECT — stored in cancellables
api.obtenerDatos()
    .sink(receiveCompletion: { _ in }, receiveValue: { _ in })
    .store(in: &cancellables)
```

### Check 2: Main Thread Dispatch

All UI-bound publishers MUST receive on main thread:

```swift
// ❌ BLOCKED — may update UI from background
api.obtenerDatos()
    .sink { [weak self] value in
        self?.response = value  // @Published — must be on main
    }
    .store(in: &cancellables)

// ✅ CORRECT — explicit main thread
api.obtenerDatos()
    .receive(on: DispatchQueue.main)
    .sink { [weak self] value in
        self?.response = value
    }
    .store(in: &cancellables)
```

Note: `@MainActor` ViewModels handle this automatically in most cases, but explicit `.receive(on:)` is preferred for clarity.

### Check 3: Error Handling

Every publisher chain MUST handle errors:

```swift
// ❌ BLOCKED — ignores errors
api.obtenerDatos()
    .sink(
        receiveCompletion: { _ in },  // Empty completion handler
        receiveValue: { [weak self] value in
            self?.response = value
        }
    )
    .store(in: &cancellables)

// ✅ CORRECT — handles errors
api.obtenerDatos()
    .receive(on: DispatchQueue.main)
    .sink(
        receiveCompletion: { [weak self] completion in
            if case .failure(let error) = completion {
                self?.errorMessage = error.localizedDescription
            }
            self?.isLoading = false
        },
        receiveValue: { [weak self] value in
            self?.response = value
        }
    )
    .store(in: &cancellables)
```

### Check 4: Memory Safety

All closures in publisher chains MUST use `[weak self]`:

```swift
// ❌ BLOCKED — strong self capture
.sink { value in
    self.response = value  // Retains self
}

// ✅ CORRECT — weak self
.sink { [weak self] value in
    self?.response = value
}
```

### Check 5: Chain Complexity

Flag publisher chains with more than 5 operators:

```swift
// ⚠️ WARNING — too complex, extract to method
api.obtenerDatos()
    .map { $0.items }
    .filter { !$0.isEmpty }
    .flatMap { items in /* ... */ }
    .removeDuplicates()
    .debounce(for: 0.3, scheduler: RunLoop.main)
    .receive(on: DispatchQueue.main)
    .sink { ... }

// ✅ BETTER — extracted
private func procesarDatos() -> AnyPublisher<[Item], Error> {
    api.obtenerDatos()
        .map { $0.items }
        .filter { !$0.isEmpty }
        .flatMap { items in /* ... */ }
        .removeDuplicates()
        .eraseToAnyPublisher()
}
```

### Check 6: Cancellation Patterns

Optimize cancellation in common scenarios:

```swift
// Search with debounce — cancel previous
$searchText
    .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
    .removeDuplicates()
    .sink { [weak self] query in
        self?.buscar(query: query)
    }
    .store(in: &cancellables)

// Cancel all on deinit (via cancellables set deallocation)
// Or explicit cancel for specific operations:
private var currentRequest: AnyCancellable?

func cargarDatos() {
    currentRequest?.cancel()  // Cancel previous
    currentRequest = api.obtenerDatos()
        .receive(on: DispatchQueue.main)
        .sink(...)
}
```

### Check 7: Publisher Creation

Optimize publisher creation in Api implementations:

```swift
// ✅ Use Result.publisher for mocks
func obtenerDatos() -> AnyPublisher<Model, Error> {
    resultToReturn.publisher.eraseToAnyPublisher()
}

// ✅ Use Future for single-value async
func operacionUnica() -> AnyPublisher<Void, Error> {
    Future { promise in
        // async work
        promise(.success(()))
    }.eraseToAnyPublisher()
}

// ✅ Use CurrentValueSubject for stateful streams
let estadoActual = CurrentValueSubject<Estado, Never>(.inicial)
```

## Auto-Shielding

- **BLOCK** orphaned subscriptions (`.sink` without `.store(in:)`)
- **BLOCK** closures without `[weak self]` in publisher chains
- **BLOCK** empty `receiveCompletion` handlers on failable publishers
- **WARN** publisher chains with >5 operators — suggest extraction
- **WARN** missing `.receive(on: DispatchQueue.main)` before UI-bound sink

## Rules

1. Every `.sink()` stores in `cancellables` or a named `AnyCancellable`
2. Every closure uses `[weak self]`
3. Every failable publisher handles `receiveCompletion(.failure)`
4. UI-bound publishers use `.receive(on: DispatchQueue.main)`
5. Complex chains (>5 operators) extracted to named methods
6. Search/input publishers use `.debounce` and `.removeDuplicates`
7. `cancellables` declared as `Set<AnyCancellable>` on the ViewModel
8. Use `Result.publisher` in mock implementations
9. Use `Future` for single-value async operations
10. Cancel previous requests before starting new ones where applicable
