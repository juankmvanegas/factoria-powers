# ADR-009: Factory DI Container for Dependency Injection

## Status
Accepted

## Date
2025-01-15

## Context
The iOS application requires a robust dependency injection strategy to support testability, modularity, and clean separation of concerns across SPM feature modules. Traditional constructor injection alone becomes unwieldy as the dependency graph grows across multiple modules. A lightweight, Swift-native DI container is needed that integrates well with SwiftUI's lifecycle, supports scoped registrations per feature module, and enables straightforward test mocking without compromising compile-time safety.

## Decision
We adopt **Factory** (hmlongco) as the sole dependency injection framework for the application.

### Core Rules

1. **`Container.shared`** is the single source of truth for all dependency registrations. No other containers are created at runtime.

2. **`@Injected`** is used for standard property injection in ViewModels and services:
   ```swift
   final class PerfilViewModel: ObservableObject {
       @Injected(\.servicioUsuario) private var servicioUsuario
       @Injected(\.coordinador) private var coordinador
   }
   ```

3. **`@DynamicInjected`** is reserved for lazy or scoped dependencies that must be resolved at access time rather than at init:
   ```swift
   final class DetalleViewModel: ObservableObject {
       @DynamicInjected(\.sesionActiva) private var sesion
   }
   ```

4. **Per-module registration files** follow the naming convention `Proveedor[Feature].swift` and extend `Container`:
   ```swift
   // ProveedorAutenticacion.swift
   extension Container {
       var servicioAutenticacion: Factory<ServicioAutenticacionProtocol> {
           self { ServicioAutenticacion() }
       }
       var validadorBiometrico: Factory<ValidadorBiometricoProtocol> {
           self { ValidadorBiometrico() }
       }
   }
   ```

5. **Test mocking** uses `.register` to override and `.reset` to restore:
   ```swift
   override func setUp() {
       super.setUp()
       Container.shared.servicioUsuario.register { MockServicioUsuario() }
   }
   override func tearDown() {
       Container.shared.reset()
       super.tearDown()
   }
   ```

6. **No singletons outside the container.** All shared instances must be managed via Factory's `.singleton` scope, never via static `shared` properties on the type itself.

7. **No service locator anti-pattern.** Dependencies are never resolved by passing `Container.shared` as a parameter or calling `Container.shared.resolve()` inline. All injection points use `@Injected` or `@DynamicInjected`.

## Consequences

### Positive
- Consistent, declarative injection across all feature modules
- Test mocking is trivial via `.register` / `.reset` — no manual mock wiring
- SPM module boundaries are respected; each module registers its own dependencies
- Scopes (`.singleton`, `.cached`, `.shared`) are managed centrally in Factory
- Compile-time safety: missing registrations cause build errors, not runtime crashes

### Negative
- Team must learn Factory-specific API and property wrapper semantics
- Debugging resolution order can be non-obvious for deeply nested dependency graphs
- `@DynamicInjected` introduces a slight runtime cost on each access

### Risks
- **Over-registration:** Registering too many dependencies as `.singleton` can cause memory bloat. **Mitigation:** Default scope is transient; singletons require explicit justification in code review.
- **Container pollution in tests:** Forgetting `.reset()` in `tearDown` can leak state between test cases. **Mitigation:** Base test class (`PruebaBase`) calls `Container.shared.reset()` automatically.
