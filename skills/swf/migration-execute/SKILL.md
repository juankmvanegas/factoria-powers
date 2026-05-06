---
name: swf-migration-execute
description: "Migration step 3 — execute migration for one module at a time, UIKit to SwiftUI"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Purpose

Migration Step 3: Execute the migration of a single module following the migration plan. Converts UIKit → SwiftUI, callbacks → Combine, manual init → Factory DI, Storyboard → Coordinator. One module at a time to minimize risk.

## Execution Flow — 8 Strict Steps

### Step 1: Load Migration Plan

1. Read `.cloud/migration/migration-plan.md` for the current plan
2. Identify the next module to migrate (or accept user override)
3. Read the module's discovery data from `.cloud/migration/discovery-report.md`
4. Verify prerequisites for this module are met (dependencies already migrated)

### Step 2: Create Target SPM Module

1. Create the new SPM module in `Sources/` following naming conventions
2. Set up module dependencies in `Package.swift`
3. Create folder structure: `ModelosApi/`, `ViewModels/`, `Vistas/`, `Coordinadores/`
4. Configure module exports

### Step 3: Migrate Data Layer

| Legacy | Target |
|--------|--------|
| URLSession / raw Alamofire | `EnrutadorApi` + `ApiImplementacion` |
| Completion handlers | `AnyPublisher<T, Error>` |
| Manual error mapping | Typed error enum |
| Raw JSON parsing | `Codable` models with `CodingKeys` |

```swift
// BEFORE: Callback-based
func fetchData(completion: @escaping (Result<Model, Error>) -> Void) {
    URLSession.shared.dataTask(with: url) { data, _, error in
        // ...
    }.resume()
}

// AFTER: Combine publisher
func obtenerDatos() -> AnyPublisher<Model, Error> {
    return session.request(EnrutadorApi.obtenerDatos)
        .publishDecodable(type: ApiResponse.self)
        .value()
        .map { $0.toDomain() }
        .eraseToAnyPublisher()
}
```

### Step 4: Migrate ViewModel

| Legacy | Target |
|--------|--------|
| No architecture | `@MainActor class ViewModel: ObservableObject` |
| Manual state | `@Published` properties |
| Delegate callbacks | Combine subscriptions |
| Direct navigation | Coordinator injection via `@Injected` |

```swift
@MainActor
final class FeatureViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var response: FeatureModel?
    @Published var errorMessage: String?

    @Injected(\.featureApi) private var api
    @Injected(\.coordinador) private var coordinador

    private var cancellables = Set<AnyCancellable>()
}
```

### Step 5: Migrate UI (UIKit → SwiftUI)

| Legacy | Target |
|--------|--------|
| `UIViewController` | SwiftUI `View` |
| `UITableView` | `List` / `LazyVStack` |
| `UICollectionView` | `LazyVGrid` / `LazyHGrid` |
| AutoLayout constraints | SwiftUI modifiers |
| `@IBOutlet` / `@IBAction` | `@StateObject` / actions |
| Storyboard segues | Coordinator navigation |
| XIB views | CoreUI components (Atomos, Moleculas) |

### Step 6: Migrate Navigation

| Legacy | Target |
|--------|--------|
| Storyboard segues | `CoordinadorProtocol.navegarA()` |
| `performSegue(withIdentifier:)` | Coordinator method call |
| `UINavigationController.push` | `NavegacionBase` configuration |
| Deep link handling | Coordinator deep link resolver |

### Step 7: Register in Factory DI

1. Create protocol for the new Api in `Dependencias` module
2. Register implementation in `Container` extension:
   ```swift
   extension Container {
       var featureApi: Factory<FeatureApiProtocol> {
           self { FeatureApiImplementacion() }
       }
   }
   ```
3. Register Coordinator if new
4. Verify registration with Proveedor pattern

### Step 8: Generate Tests

1. Invoke `generate-tests` skill for the migrated module
2. Ensure all legacy test cases are ported
3. Add regression tests for legacy behavior
4. Verify coverage meets thresholds

## Auto-Shielding

- **ABORT** if migration plan does not exist — run `migration-plan` first
- **ABORT** if module dependencies have not been migrated yet
- **ABORT** if the module has active PRs or uncommitted changes
- **WARN** if migrated module introduces new third-party dependency
- **WARN** if legacy code deletion would break other modules

## Rules

1. Migrate ONE module at a time — never batch multiple modules
2. Keep legacy code intact until migration is verified by tests
3. Create a bridge layer if other modules still depend on legacy interfaces
4. Run full test suite after each module migration
5. Update `.cloud/migration/migration-plan.md` with completion status
6. Record `MODULE_MIGRATED` event in audit trail
7. Do not delete legacy files until all dependent modules are migrated
8. Preserve all business logic exactly — no refactoring during migration
9. Use `@available(iOS 15.0, *)` guards where needed
