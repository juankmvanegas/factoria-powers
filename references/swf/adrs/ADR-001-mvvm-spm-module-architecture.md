# ADR-001: MVVM + SPM Modular Architecture

## Status
Accepted

## Date
2025-01-15

## Context
The iOS application requires a scalable, maintainable architecture that supports team collaboration, independent module development, and clear separation of concerns. A monolithic codebase would lead to long build times, merge conflicts, and tightly coupled components. The team needs a modular approach where features can be developed, tested, and deployed independently while sharing common infrastructure.

## Decision
We adopt **MVVM (Model-View-ViewModel)** as the presentation pattern combined with **Swift Package Manager (SPM)** for modular architecture. The dependency graph follows a strict layered hierarchy:

```
Dependencias → Core → CoreUI → Feature Modules
```

### Module Structure

Each module is an independent SPM package with its own `Package.swift`:

- **Dependencias**: Re-exports all third-party dependencies (Alamofire, Realm, MSAL, Firebase, etc.). No internal code — only dependency declarations.
- **Core**: Shared infrastructure — networking (Alamofire wrappers), models, navigation (Coordinator pattern), database (Realm), authentication (MSAL/Azure B2C), keychain (SimpleKeychain), crypto (CryptoSwift). Depends on Dependencias.
- **CoreUI**: Shared UI components following **Atomic Design** (Atoms → Molecules → Organisms → Templates). SwiftUI views, modifiers, design tokens, theme management. Depends on Core.
- **Feature Modules** (e.g., `FeatureHome`, `FeatureProfile`, `FeatureSettings`): Each feature module contains its own Data and Presentation layers. Depends on Core and CoreUI.

### Feature Module Internal Structure

```
FeatureXxx/
  Sources/
    Data/
      Repositories/
      DataSources/
      DTOs/
    Presentation/
      Views/
      ViewModels/
      Components/
  Tests/
    DataTests/
    PresentationTests/
```

### MVVM Contract

- **View** (SwiftUI): Declarative UI, observes ViewModel via `@StateObject` or `@ObservedObject`.
- **ViewModel**: Conforms to `ObservableObject`. Contains `@Published` properties. Calls repository methods. Never imports SwiftUI.
- **Model**: Plain structs/classes. Domain entities live in Core; DTOs live in each feature's Data layer.

### Navigation

Navigation uses the **Coordinator pattern** defined in Core. Each feature module exposes a `Coordinator` that manages its internal navigation flow. The app-level coordinator composes feature coordinators.

## Consequences

### Positive
- Independent module compilation reduces build times significantly.
- Feature teams can work in isolation without merge conflicts on shared files.
- Clear dependency direction prevents circular dependencies.
- Each module can be unit-tested independently with mock dependencies.
- Atomic Design in CoreUI ensures consistent UI across features.
- MVVM with SwiftUI provides reactive, testable presentation logic.

### Negative
- Initial setup overhead for creating SPM packages and configuring dependencies.
- Developers must understand the layered architecture to place code correctly.
- Cross-module refactoring requires coordinated changes across packages.
- Module boundaries may feel rigid for small features that span multiple domains.

### Risks
- **Risk**: Feature modules accumulate technical debt by duplicating logic instead of extracting to Core. **Mitigation**: Code reviews enforce extraction of shared logic to Core/CoreUI.
- **Risk**: Circular dependency between feature modules. **Mitigation**: Feature modules must never depend on each other; shared contracts go through Core.
- **Risk**: Over-modularization leading to too many small packages. **Mitigation**: Features are grouped logically; a module must justify its existence by representing a distinct business domain.
