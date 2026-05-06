---
name: swf-mobile
description: "Auto-activated iOS core skill — SwiftUI, MVVM, Combine, Factory DI, Coordinator, BFF, SDUI, Repository"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Mobile (iOS Core — Auto-Activated)

## Purpose

Auto-activated skill that enforces iOS/Swift architectural patterns on every code change. Handles SwiftUI code, `@MainActor` ViewModels, Combine publishers, Factory DI, Coordinator navigation, BFF components, SDUI patterns, Repository pattern, and Coordinator aggregation.

## Activation Triggers

This skill activates automatically when:
- Creating or editing any `.swift` file in `Sources/` or `Tests/`
- Creating SwiftUI Views, ViewModels, Coordinators, or Api implementations
- Modifying Factory DI registrations
- Touching navigation or routing logic

## Pattern Enforcement

### ViewModel Pattern

Every ViewModel MUST:

```swift
@MainActor
final class FeatureViewModel: ObservableObject {
    // State — @Published
    @Published var isLoading = false
    @Published var response: FeatureModel?
    @Published var errorMessage: String?

    // Dependencies — Factory DI
    @Injected(\.featureApi) private var api
    @Injected(\.coordinador) private var coordinador

    // Subscriptions — Combine
    private var cancellables = Set<AnyCancellable>()

    // All closures use [weak self]
    func cargarDatos() {
        isLoading = true
        api.obtenerDatos()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] value in
                    self?.response = value
                }
            )
            .store(in: &cancellables)
    }
}
```

### SwiftUI View Pattern

```swift
struct FeatureView: View {
    @StateObject private var viewModel = FeatureViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let error = viewModel.errorMessage {
                ErrorView(message: error, retry: viewModel.cargarDatos)
            } else if let data = viewModel.response {
                ContentView(data: data)
            }
        }
        .onAppear { viewModel.cargarDatos() }
    }
}
```

### Factory DI Pattern

```swift
// Protocol in Dependencias module
protocol FeatureApiProtocol {
    func obtenerDatos() -> AnyPublisher<FeatureModel, Error>
}

// Registration in Container extension
extension Container {
    var featureApi: Factory<FeatureApiProtocol> {
        self { FeatureApiImplementacion() }
    }
}

// Usage via Proveedor
@Injected(\.featureApi) private var api
@DynamicInjected(\.coordinador) private var coordinador
```

### Coordinator Navigation Pattern

```swift
protocol CoordinadorProtocol {
    func navegarA(_ destino: Destino)
    func regresar()
}

// Coordinator uses NavegacionBase for push/present/modal
final class FeatureCoordinador: CoordinadorProtocol {
    private let navegacion: NavegacionBase

    func navegarA(_ destino: Destino) {
        switch destino {
        case .detalle(let id):
            navegacion.push(DetalleView(id: id))
        case .configuracion:
            navegacion.present(ConfiguracionView())
        }
    }
}
```

### Repository Pattern

```swift
protocol FeatureRepositoryProtocol {
    func obtenerDatos(forceRefresh: Bool) -> AnyPublisher<FeatureModel, Error>
}

final class FeatureRepository: FeatureRepositoryProtocol {
    @Injected(\.featureApi) private var api
    @Injected(\.featureCache) private var cache

    func obtenerDatos(forceRefresh: Bool) -> AnyPublisher<FeatureModel, Error> {
        if !forceRefresh, let cached = cache.obtener() {
            return Just(cached).setFailureType(to: Error.self).eraseToAnyPublisher()
        }
        return api.obtenerDatos()
            .handleEvents(receiveOutput: { [weak self] in self?.cache.guardar($0) })
            .eraseToAnyPublisher()
    }
}
```

### BFF (Backend for Frontend) Pattern

When working with BFF endpoints:
1. BFF response models may contain UI configuration
2. Map BFF responses to domain models — never pass BFF DTOs to Views
3. BFF error codes map to specific UI states

### SDUI (Server-Driven UI) Pattern

When working with server-driven components:
1. Parse component tree from JSON
2. Map component types to SwiftUI views
3. Use `@ViewBuilder` for dynamic component rendering
4. Cache rendered components for performance
5. Handle unknown component types gracefully (fallback view)

### Coordinator Aggregation

For complex flows spanning multiple features:
1. Use a parent Coordinator to aggregate child Coordinators
2. Child Coordinators report completion via Combine publishers
3. Parent Coordinator manages the overall flow state

## Auto-Shielding

- **BLOCK** any ViewModel without `@MainActor`
- **BLOCK** any direct UIKit import in SwiftUI Views
- **BLOCK** any `@Published` property set from outside the ViewModel
- **BLOCK** any navigation not going through Coordinator
- **WARN** missing `[weak self]` in closures
- **WARN** Combine subscription not stored in `cancellables`
- **WARN** hardcoded strings in UI (should use localization)

## Rules

1. Every ViewModel is `@MainActor final class` conforming to `ObservableObject`
2. All dependencies injected via Factory (`@Injected` / `@DynamicInjected`)
3. All async operations use Combine publishers
4. All navigation goes through Coordinator
5. Views are stateless — all state lives in ViewModel
6. CoreUI components from Atomic Design (Atomos, Moleculas, Organismos)
7. Error handling with user-friendly messages, never raw errors in UI
8. `[weak self]` in every closure capturing self
9. `.receive(on: DispatchQueue.main)` before UI-bound sinks
10. Store all subscriptions in `cancellables: Set<AnyCancellable>`
