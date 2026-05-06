---
name: swf-coordinator-pattern
description: "Auto-activated for Coordinator navigation patterns — CoordinadorProtocol, NavegacionBase, deep linking, flow correctness"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Coordinator Pattern (Auto-Activated)

## Purpose

Auto-activated skill that enforces correct Coordinator navigation patterns. Validates `CoordinadorProtocol` usage, `NavegacionBase` configuration, deep linking support, navigation flow correctness, and Coordinator aggregation for complex flows.

## Activation Triggers

This skill activates automatically when:
- Creating or editing Coordinator files (`*Coordinador*.swift`)
- Modifying navigation logic in any file
- Creating new SwiftUI Views that trigger navigation
- Changing Factory DI registrations for Coordinators

## Pattern Enforcement

### Coordinator Structure

Every Coordinator MUST follow:

```swift
protocol FeatureCoordinadorProtocol: CoordinadorProtocol {
    func navegarADetalle(id: String)
    func navegarAEdicion(modelo: FeatureModel)
    func regresar()
}

final class FeatureCoordinador: FeatureCoordinadorProtocol {
    private let navegacion: NavegacionBase

    init(navegacion: NavegacionBase) {
        self.navegacion = navegacion
    }

    func navegarADetalle(id: String) {
        let vista = DetalleView(id: id)
        navegacion.push(vista)
    }

    func navegarAEdicion(modelo: FeatureModel) {
        let vista = EdicionView(modelo: modelo)
        navegacion.present(vista)
    }

    func regresar() {
        navegacion.pop()
    }
}
```

### NavegacionBase Configuration

```swift
final class NavegacionBase {
    func push<V: View>(_ view: V)
    func present<V: View>(_ view: V, style: PresentationStyle = .sheet)
    func pop()
    func popToRoot()
    func dismiss()
}
```

### Deep Linking

Every Coordinator should support deep links:

```swift
protocol DeepLinkableCoordinator {
    func handleDeepLink(_ url: URL) -> Bool
}

extension FeatureCoordinador: DeepLinkableCoordinator {
    func handleDeepLink(_ url: URL) -> Bool {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return false
        }
        switch components.path {
        case "/feature/detalle":
            if let id = components.queryItems?.first(where: { $0.name == "id" })?.value {
                navegarADetalle(id: id)
                return true
            }
        default:
            break
        }
        return false
    }
}
```

### Coordinator Aggregation

For multi-feature flows, use a parent Coordinator:

```swift
final class FlowCoordinador: CoordinadorProtocol {
    @Injected(\.featureACoordinador) private var featureA
    @Injected(\.featureBCoordinador) private var featureB

    private var cancellables = Set<AnyCancellable>()

    func iniciarFlujo() {
        featureA.onCompletion
            .sink { [weak self] result in
                self?.featureB.iniciar(con: result)
            }
            .store(in: &cancellables)

        featureA.iniciar()
    }
}
```

## Validation Checks

### Check 1: No Direct Navigation

- **BLOCK** `NavigationLink(destination:)` in Views — use Coordinator
- **BLOCK** `UINavigationController.pushViewController` — use NavegacionBase
- **BLOCK** `UIApplication.shared.open` for internal routes — use Coordinator
- **ALLOW** `NavigationLink` only inside NavegacionBase implementation

### Check 2: Coordinator Registration

- Every Coordinator protocol has a Factory registration
- Registration uses correct scope (singleton for app-level, transient for feature-level)
- ViewModel accesses Coordinator via `@Injected` or `@DynamicInjected`

### Check 3: Navigation Flow Completeness

- Every screen reachable from at least one Coordinator
- Every "back" action handled (pop, dismiss, popToRoot)
- Modal presentations have dismiss handlers
- Tab bar items have corresponding Coordinators

### Check 4: Memory Management

- Coordinator does not retain Views strongly
- `[weak self]` in Coordinator closures
- Child Coordinators properly deallocated when flow completes
- No retain cycles between Coordinator and NavegacionBase

## Auto-Shielding

- **BLOCK** any direct `NavigationLink`, `push`, or `present` outside Coordinator
- **BLOCK** Coordinator without `NavegacionBase` dependency
- **WARN** Coordinator with more than 8 navigation methods — suggest splitting
- **WARN** missing deep link support on Coordinator

## Rules

1. ALL navigation goes through Coordinators — no exceptions
2. Coordinators are registered in Factory DI
3. ViewModels access Coordinators via `@Injected`
4. Deep linking handled at Coordinator level
5. Parent Coordinators aggregate child Coordinators for complex flows
6. Navigation state managed by NavegacionBase, not by Views
7. `[weak self]` in all Coordinator closures
8. Modal presentations must have explicit dismiss handlers
