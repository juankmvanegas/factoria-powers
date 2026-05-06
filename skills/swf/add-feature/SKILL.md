---
name: swf-add-feature
description: "Add a new feature following the strict MVVM layer execution order for iOS/Swift"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Add a new feature to the iOS/Swift project strictly following the MVVM + SPM modular architecture layer execution order. Each step must be completed before moving to the next.

## Execution Flow — 8 Strict Steps

### Step 1: API Models

Create in `Sources/DatosFeature/ModelosApi/`:

1. **Request models** — Codable structs for API requests
2. **Response models** — Codable structs for API responses
3. **Domain models** — Mapped models for the presentation layer
4. Use `CodingKeys` when JSON keys differ from Swift naming
5. Never expose raw API models to the UI layer

### Step 2: ApiImplementacion

Create in `Sources/DatosFeature/`:

1. **Protocol** — `FeatureApiProtocol` with Combine publisher return types
   ```swift
   protocol FeatureApiProtocol {
       func obtenerDatos() -> AnyPublisher<FeatureModel, Error>
   }
   ```
2. **Implementation** — `FeatureApiImplementacion` conforming to the protocol
   - Use Alamofire for network requests
   - Return `AnyPublisher<T, Error>` for all methods
   - Map API response models to domain models
   - Handle errors with typed error mapping

### Step 3: EnrutadorApi

Create in `Sources/DatosFeature/`:

1. **EnrutadorApiFeature** — Route definitions for the feature's endpoints
   - Base URL from configuration
   - HTTP method, path, parameters, headers
   - Follow existing `EnrutadorApi` pattern in the project

### Step 4: ViewModel (@MainActor, @Published)

Create in `Sources/PresentacionFeature/ViewModels/`:

1. Annotate class with `@MainActor`
2. Conform to `ObservableObject`
3. Declare `@Published` properties for all view state:
   - `isLoading: Bool`
   - `response: FeatureModel?`
   - `errorMessage: String?`
4. Inject dependencies via `init` parameter (protocol-typed)
5. Use `@Injected(\.dependency)` for Coordinator access
6. Store Combine subscriptions in `cancellables: Set<AnyCancellable>`
7. Use `[weak self]` in all closures
8. Receive values on `DispatchQueue.main`

### Step 5: SwiftUI View

Create in `Sources/PresentacionFeature/Vistas/`:

1. Use `@StateObject` for the owning ViewModel (created here)
2. Use `@ObservedObject` if ViewModel is passed from parent
3. Keep Views stateless — all logic in ViewModel
4. Use CoreUI components (Atomos, Moleculas, Organismos) where available
5. Handle loading, error, and empty states
6. Follow Atomic Design principles for new UI components

### Step 6: Coordinator Connection

Create or update in `Sources/PresentacionFeature/Coordinadores/`:

1. Create `FeatureCoordinador` conforming to navigation protocol
2. Register navigation routes
3. Handle deep linking if applicable
4. Connect to parent Coordinator flow
5. Never navigate directly from Views — always through Coordinator

### Step 7: Factory DI Registration (Proveedor)

Create or update `Sources/PresentacionFeature/ProveedorFeature.swift`:

1. Register API implementation: `Container.shared.featureApi.register { FeatureApiImplementacion() }`
2. Register ViewModel factory if needed
3. Register Coordinator
4. Follow existing `Proveedor` pattern in the project
5. Never use singletons outside Factory container

### Step 8: Tests

Create in `Tests/FeatureTests/`:

1. **ViewModelTests** — Full coverage of ViewModel methods
2. **MockApi** — Mock with `Result<T, Error>` return control
3. **MockCoordinador** — Spy for navigation verification
4. **Factory setUp/tearDown** — Register mocks, reset container
5. Use XCTestExpectation for Combine publisher assertions
6. Follow AAA pattern with comments
7. Coverage targets: 80% ViewModel, 70% Api

## Auto-Shielding

- **ABORT** if the feature introduces a dependency not in the Golden Path — propose ADR first
- **ABORT** if the ViewModel does not use @MainActor — mandatory per ADR
- **ABORT** if navigation is done directly from View without Coordinator
- **WARN** if a step is attempted out of order
- **WARN** if more than 8 @Published properties in a single ViewModel — suggest decomposition

## Rules

1. Strictly follow step order: Models → Api → Router → ViewModel → View → Coordinator → DI → Tests
2. Each step must compile before moving to the next
3. Never skip the test step
4. All API calls return `AnyPublisher<T, Error>`
5. All ViewModels use `@MainActor` and `ObservableObject`
6. All dependencies injected via protocols (never concrete types)
7. All navigation through Coordinator pattern
8. DTOs never reach the UI — map to domain models in the data layer
9. Use `[weak self]` in all Combine sink closures
10. Run SwiftLint after all changes
