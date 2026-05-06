# Coding Standards

Applicable to iOS applications built with Swift 5.10+, SwiftUI, MVVM, SPM Modules, Factory DI, Alamofire, Realm, MSAL, Firebase, SimpleKeychain, CryptoSwift.

## 1. Swift Style

### SwiftLint Rules (Enforced)

```yaml
# .swiftlint.yml
disabled_rules:
  - trailing_whitespace
opt_in_rules:
  - empty_count
  - closure_spacing
  - explicit_init
  - fatal_error_message
  - force_unwrapping
  - implicitly_unwrapped_optional
  - overridden_super_call
  - private_action
  - private_outlet
  - redundant_nil_coalescing
  - sorted_imports
  - vertical_parameter_alignment_on_call
included:
  - Sources
excluded:
  - Tests
  - Packages
line_length:
  warning: 150
  error: 200
type_body_length:
  warning: 300
  error: 500
file_length:
  warning: 500
  error: 800
function_body_length:
  warning: 40
  error: 80
cyclomatic_complexity:
  warning: 10
  error: 20
```

### Formatting Rules
- **Indentation**: 4 spaces (no tabs)
- **Line length**: 150 characters warning, 200 error
- **Braces**: opening brace on the same line as the declaration
- **Imports**: sorted alphabetically, grouped by: system → third-party → project modules
- **Trailing commas**: required in multi-line arrays and dictionaries
- **Self**: omit `self.` unless required for disambiguation or closures

### File Organization Order
```swift
// 1. Import statements (sorted)
import Combine
import Factory
import SwiftUI

// 2. Protocol declarations
protocol FeatureProtocol { }

// 3. Main type declaration
final class FeatureViewModel: ObservableObject {
    // 3a. Type properties / nested types
    // 3b. Static properties
    // 3c. @Published properties
    // 3d. Private properties
    // 3e. Injected dependencies
    // 3f. Initializer
    // 3g. Public methods
    // 3h. Private methods
}

// 4. Extensions (protocol conformances, each in its own extension)
extension FeatureViewModel: FeatureProtocol { }

// 5. Preview providers (#Preview)
```

### MARK Comments
- Use `// MARK: -` to separate sections within a file
- Required sections: `Properties`, `Lifecycle`, `Public Methods`, `Private Methods`

## 2. Naming Conventions

### Language Policy
- **Domain code** (business logic, entities, UI labels): **Spanish**
- **Technical terms** (architecture, framework, patterns): **English**
- **Comments**: **Spanish**

### Naming Table

| Category | Language | Convention | Example |
|----------|----------|-----------|---------|
| Classes / Structs | Spanish | PascalCase, domain noun | `ListaNotas`, `DetalleCompra` |
| Protocols | Spanish | PascalCase + Protocol suffix | `NotasApiProtocol`, `CoordinadorProtocol` |
| Enums | Spanish | PascalCase | `EstadoNota`, `TipoTransaccion` |
| Enum cases | Spanish | camelCase | `.enProceso`, `.completado`, `.fallido` |
| Functions / Methods | Spanish | camelCase, verb-first | `obtenerNotas()`, `guardarDatos()` |
| Variables / Properties | Spanish | camelCase | `listaNotas`, `estaActivo`, `mensajeError` |
| Constants | Spanish | camelCase | `longitudMaxima`, `tiempoEspera` |
| Closures | Spanish | camelCase | `alCompletar`, `alFallar` |
| Type aliases | Spanish | PascalCase | `typealias ManejadorCompletado = (Result<Void, Error>) -> Void` |
| Generics | English | Single uppercase letter or PascalCase | `<T>`, `<Element>`, `<Response>` |
| Test methods | Spanish | snake_case with prefix `test_` | `test_cargarDatos_cuandoExitosa_retornaNotas` |
| SwiftUI Modifiers | English | camelCase | `.padding()`, `.frame()` |
| SPM Packages | English + Spanish | PascalCase | `PresentacionNotas`, `DatosCompras` |

### Boolean Naming
- Prefix with `es` / `esta` / `tiene` / `puede` / `debe`:
  - `estaActivo`, `esValido`, `tienePermisos`, `puedeEditar`, `debeMostrarAlerta`

## 3. Access Modifiers

### Rules
- **Always explicit** — never rely on Swift's default `internal`
- Apply the most restrictive modifier possible

### Decision Guide

| Modifier | When to Use |
|----------|------------|
| `public` | API exposed to other SPM modules |
| `internal` | Shared within the same SPM module (explicitly stated) |
| `fileprivate` | Shared between types in the same file only |
| `private` | Used only within the declaring type |
| `private(set)` | Readable externally, writable only internally (e.g., `@Published private(set) var`) |
| `open` | Only for classes designed for subclassing across modules (rare) |

### Prohibited
- Leaving access modifiers implicit — always write them
- Using `open` without documented justification
- Exposing implementation details as `public` when `internal` suffices

## 4. Optionals

### Required Patterns

```swift
// guard let — preferred for early exit
guard let usuario = sesion.usuarioActual else {
    mostrarError("Sesión no válida")
    return
}

// if let — for conditional branching
if let mensaje = respuesta.mensaje {
    mostrarNotificacion(mensaje)
}

// Nil coalescing — for defaults
let nombre = usuario.nombre ?? "Usuario"

// Optional chaining — for safe property access
let ciudad = usuario.direccion?.ciudad?.nombre

// map / flatMap — for transformations
let textoFormateado = respuesta.datos.map { formatear($0) }
```

### Prohibited
- `value!` (force unwrap) — **except** in test files for test assertions
- `as!` (force cast) — use `as?` with guard/if let
- Implicitly unwrapped optionals (`Type!`) — **except** `@IBOutlet` (legacy) and test properties in `setUp`/`tearDown`
- Ignoring optional results: `let _ = try? operation()` — handle or log the error

## 5. Protocol-Oriented Design

### Rules
- Every dependency must be defined as a **protocol**
- Protocols define capabilities, not identity — prefer small, focused protocols
- Use protocol extensions for default implementations shared across conformers
- Prefer composition of multiple protocols over one large protocol

### Pattern

```swift
// Protocol definition
internal protocol NotasApiProtocol {
    func obtenerNotas() -> AnyPublisher<[NotaModelo], Error>
    func crearNota(input: CrearNotaInput) -> AnyPublisher<NotaModelo, Error>
    func eliminarNota(id: String) -> AnyPublisher<Void, Error>
}

// Implementation
internal final class NotasApiImplementacion: NotasApiProtocol {
    private let sesion: Session
    
    internal init(sesion: Session) {
        self.sesion = sesion
    }
    
    internal func obtenerNotas() -> AnyPublisher<[NotaModelo], Error> {
        // Implementation
    }
}

// DI registration
extension Container {
    var notasApi: Factory<NotasApiProtocol> {
        self { NotasApiImplementacion(sesion: self.sesionAlamofire()) }
    }
}
```

### Prohibited
- Depending on concrete types instead of protocols (except value types and ViewModels)
- Protocols with more than 7 methods — split into focused protocols
- Protocol names without the `Protocol` suffix for dependency abstractions

## 6. MVVM Enforcement

### ViewModel Rules
- **Must** be a `final class` conforming to `ObservableObject`
- **Must** be annotated with `@MainActor`
- **Must** expose state only through `@Published` properties
- **Must** receive all dependencies via initializer or `@Injected`
- **Must** handle all business logic — Views are passive
- **Must** use Combine or async/await for asynchronous operations
- **Must** communicate with views only through `@Published` properties and methods

### View Rules
- **Must** be a `struct` conforming to `View`
- **Must** use `@StateObject` for owning a ViewModel, `@ObservedObject` for received ones
- **Must not** contain business logic, network calls, or data transformations
- **Must not** directly access data layer types (ApiImplementacion, Realm, etc.)
- **Must** delegate all actions to the ViewModel
- **Must** use `@Environment`, `@EnvironmentObject`, or `@Injected` for shared dependencies
- **Should** keep `body` computation lightweight — extract subviews for complex layouts

### Model Rules
- Domain models are `struct` with `Codable` conformance when needed
- DTOs are separate from domain models — never expose DTOs to the presentation layer
- Mapping between DTOs and domain models lives in the data layer

## 7. SPM Module Organization

### Package.swift Conventions

```swift
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "Notas",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "DatosNotas", targets: ["DatosNotas"]),
        .library(name: "PresentacionNotas", targets: ["PresentacionNotas"]),
    ],
    dependencies: [
        .package(path: "../Core"),
        .package(path: "../CoreUI"),
        .package(path: "../Dependencias"),
    ],
    targets: [
        .target(
            name: "DatosNotas",
            dependencies: [
                .product(name: "Core", package: "Core"),
            ]
        ),
        .target(
            name: "PresentacionNotas",
            dependencies: [
                "DatosNotas",
                .product(name: "Core", package: "Core"),
                .product(name: "CoreUI", package: "CoreUI"),
            ]
        ),
        .testTarget(
            name: "NotasTests",
            dependencies: ["PresentacionNotas", "DatosNotas"]
        ),
    ]
)
```

### Module Boundary Rules
- **Core** has no dependency on feature modules
- **CoreUI** depends only on Core
- **Feature modules** depend on Core and CoreUI — never on other feature modules
- **Dependencias** re-exports all third-party packages (Alamofire, Factory, Realm, etc.)
- Inter-feature communication goes through Coordinator pattern or shared Core protocols
- Each module must compile independently

## 8. Factory DI Patterns

### Container Extension Pattern

```swift
// ProveedorNotas.swift
import Factory

extension Container {
    
    // API
    var notasApi: Factory<NotasApiProtocol> {
        self { NotasApiImplementacion(sesion: self.sesionAlamofire()) }
    }
    
    // ViewModel
    var notasViewModel: Factory<NotasViewModel> {
        self { NotasViewModel() }
    }
    
    // Coordinator
    var coordinadorNotas: Factory<CoordinadorNotasProtocol> {
        self { CoordinadorNotas() }
    }
}
```

### Injection in Production Code

```swift
// Property injection (preferred for ViewModels)
@MainActor
final class NotasViewModel: ObservableObject {
    @Injected(\.notasApi) private var api
    @Injected(\.coordinadorNotas) private var coordinador
}

// Dynamic injection (for lazy/conditional resolution)
@MainActor
final class AppCoordinador: ObservableObject {
    @DynamicInjected(\.notasViewModel) private var notasVM
}
```

### Rules
- One `Proveedor[Feature].swift` file per feature module — registers all module dependencies
- Use `@Injected` for standard property injection
- Use `@DynamicInjected` only when lazy resolution is required
- Never call `Container.shared.resolve()` directly — use property wrappers
- Never use singletons — use Factory's `.scope(.singleton)` or `.scope(.cached)` when needed
- Register protocols to implementations — never concrete to concrete

## 9. Combine Patterns

### Publisher Chain Best Practices

```swift
// Standard publisher chain with error handling
internal func obtenerNotas() {
    isLoading = true
    api.obtenerNotas()
        .receive(on: DispatchQueue.main)
        .sink(
            receiveCompletion: { [weak self] completion in
                self?.isLoading = false
                if case .failure(let error) = completion {
                    self?.errorMessage = error.localizedDescription
                }
            },
            receiveValue: { [weak self] notas in
                self?.notas = notas
            }
        )
        .store(in: &cancellables)
}
```

### Memory Management Rules
- **Always** use `[weak self]` in `sink` closures on ViewModels
- **Always** store subscriptions in `cancellables: Set<AnyCancellable>`
- **Always** cancel subscriptions by nilling the cancellables set or the object holding it
- **Never** create retain cycles by capturing `self` strongly in long-lived publishers
- Use `.receive(on: DispatchQueue.main)` before updating `@Published` properties

### Error Handling in Combine
- Use `.mapError` to transform errors to domain-specific types
- Use `.replaceError(with:)` only for non-critical defaults
- Never use `.assertNoFailure()` in production code
- Use `.catch` to recover from errors with fallback publishers

### Prohibited
- `.sink {}` with empty closures — always handle emissions
- Assigning to `@Published` from background threads without `.receive(on: .main)`
- Creating publishers that never complete or error without cancellation support
- Nested `sink` calls — compose publishers with `flatMap` instead

## 10. SwiftUI Patterns

### ViewModifier Pattern

```swift
internal struct EstiloPrimario: ViewModifier {
    internal func body(content: Content) -> some View {
        content
            .font(.headline)
            .foregroundColor(.primary)
            .padding()
    }
}

extension View {
    internal func estiloPrimario() -> some View {
        modifier(EstiloPrimario())
    }
}
```

### Environment and PreferenceKey

```swift
// Environment key for shared state
private struct TemaActualKey: EnvironmentKey {
    static let defaultValue: TemaApp = .claro
}

extension EnvironmentValues {
    var temaActual: TemaApp {
        get { self[TemaActualKey.self] }
        set { self[TemaActualKey.self] = newValue }
    }
}

// PreferenceKey for child-to-parent communication
private struct AlturaContenidoKey: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}
```

### Rules
- **Never** perform heavy computation or network calls in `body`
- Use `@StateObject` for ViewModels created by the View, `@ObservedObject` for passed-in ViewModels
- Extract complex subviews into separate `View` structs with descriptive names
- Use `LazyVStack` / `LazyHStack` for lists with many items
- Use `task {}` modifier for async operations tied to view lifecycle
- Use `onAppear` sparingly — prefer `task {}` for async work
- Prefer `.sheet`, `.fullScreenCover`, `.alert` modifiers driven by ViewModel state

### Prohibited
- Business logic in `body` or View methods
- Network calls in `onAppear` without ViewModel delegation
- Direct Realm/database access from Views
- Views with more than 200 lines — extract subviews

## 11. Error Handling

### Required Patterns

```swift
// do-catch with specific error types
do {
    let resultado = try await api.obtenerDatos()
    procesarResultado(resultado)
} catch let error as ErrorDeRed {
    manejarErrorRed(error)
} catch let error as ErrorDeNegocio {
    manejarErrorNegocio(error)
} catch {
    manejarErrorGeneral(error)
}

// Result type for callbacks
func procesar(completar: @escaping (Result<DatosModelo, ErrorDominio>) -> Void)

// Combine error mapping
api.obtenerDatos()
    .mapError { error -> ErrorDominio in
        switch error {
        case let networkError as AFError:
            return .errorRed(networkError.localizedDescription)
        default:
            return .desconocido(error.localizedDescription)
        }
    }
```

### Error Domain Types

```swift
internal enum ErrorDominio: Error, LocalizedError {
    case errorRed(String)
    case errorAutenticacion
    case errorValidacion(String)
    case noEncontrado
    case desconocido(String)
    
    var errorDescription: String? {
        switch self {
        case .errorRed(let mensaje): return mensaje
        case .errorAutenticacion: return "Sesión no válida"
        case .errorValidacion(let detalle): return detalle
        case .noEncontrado: return "Recurso no encontrado"
        case .desconocido(let mensaje): return mensaje
        }
    }
}
```

### Rules
- Every module defines its own `Error` enum for domain-specific errors
- Never silently ignore errors — at minimum log them
- Never expose raw system errors to the user — map to user-friendly messages
- Use `LocalizedError` conformance for user-facing error descriptions
- Centralize error presentation in the ViewModel — Views only display what the ViewModel provides

### Prohibited
- `try!` in production code
- Empty `catch {}` blocks
- `try?` without handling the nil case meaningfully
- Exposing raw `AFError`, `RealmError`, or system errors to the UI

## 12. Layer Structure per Module

### Naming Convention Table

| Type | Convention | Example |
|------|-----------|---------|
| Protocol | `[Entity]Protocol` | `NotasApiProtocol` |
| API Implementation | `[Entity]ApiImplementacion` | `NotasApiImplementacion` |
| Router | `EnrutadorApi[Feature]` | `EnrutadorApiNotas` |
| ViewModel | `[Feature]ViewModel` | `NotasViewModel` |
| View | `[Feature]Vista` | `NotasVista` |
| Coordinator | `Coordinador[Feature]` | `CoordinadorNotas` |
| Coordinator Protocol | `Coordinador[Feature]Protocol` | `CoordinadorNotasProtocol` |
| DI Provider | `Proveedor[Feature]` | `ProveedorNotas` |
| Mock | `Mock[Entity]` | `MockNotasApi` |
| Test Class | `[Entity]Tests` | `NotasViewModelTests` |
| Domain Model | Domain noun (singular/plural) | `Nota`, `ListaNotas` |
| DTO (API response) | `[Entity]Respuesta` | `NotaRespuesta` |
| DTO (API request) | `[Entity]Solicitud` | `CrearNotaSolicitud` |
| Data Source | `[Feature]FuenteDatos` | `NotasFuenteDatos` |
| UI Entity | `[Entity]UI` | `NotaUI` |
| Realm Object | `[Entity]RealmObjeto` | `NotaRealmObjeto` |
| BFF Component | `FabricaDe[...]` | `FabricaDeComponentes` |
| Spy Enum | `Invocaciones` | `MockCoordinador.Invocaciones` |

### Layer Flow

```
EnrutadorApi[Feature]  →  [Entity]ApiImplementacion  →  [Feature]ViewModel  →  [Feature]Vista
     (URLs)                  (network + parse)            (state + logic)       (SwiftUI)
```

### Data Layer (`DatosFeature/`)
- `EnrutadorApi[Feature].swift` — Alamofire `URLRequestConvertible` routes
- `[Entity]ApiImplementacion.swift` — implements `[Entity]Protocol`, uses Alamofire Session
- `ModelosApi/` — Codable DTOs for API request/response

### Presentation Layer (`PresentacionFeature/`)
- `ViewModels/[Feature]ViewModel.swift` — `@MainActor`, `ObservableObject`
- `Vistas/[Feature]Vista.swift` — SwiftUI views
- `Coordinadores/Coordinador[Feature].swift` — navigation logic
- `Proveedor[Feature].swift` — Factory DI registrations for the module

## 13. CoreUI Atomic Design

### Structure

```
CoreUI/
├── Sources/
│   ├── Atomos/              → Smallest reusable components
│   │   ├── BotonPrimario.swift
│   │   ├── CampoTexto.swift
│   │   ├── IconoEstado.swift
│   │   └── EtiquetaMoneda.swift
│   ├── Moleculas/           → Composed from Atomos
│   │   ├── BarraNavegacion.swift
│   │   ├── SelectorFecha.swift
│   │   ├── TarjetaResumen.swift
│   │   └── FilaListaConIcono.swift
│   ├── Organismos/          → Complex composed layouts
│   │   ├── AlertaPersonalizada.swift
│   │   ├── FormularioGenerico.swift
│   │   └── Components/     → BFF sub-components
│   │       ├── TituladoComponente.swift
│   │       └── ContenedorGrilla.swift
│   ├── Plantillas/          → Full-screen layout templates
│   │   ├── PlantillaListado.swift
│   │   ├── PlantillaDetalle.swift
│   │   └── PlantillaCarga.swift
│   ├── Utilidades/          → UI helpers
│   │   ├── ColorHex.swift
│   │   ├── SkeletonModifier.swift
│   │   └── AnimacionTransicion.swift
│   └── EntidadesUI/         → UI-specific models
│       ├── ColorTema.swift
│       ├── IconoModelo.swift
│       └── TipoAlerta.swift
```

### Rules
- **Atomos**: no external dependencies beyond SwiftUI; single visual element
- **Moleculas**: compose Atomos; no business logic; configurable via parameters
- **Organismos**: compose Moleculas and Atomos; may manage internal UI state
- **Plantillas**: define page layouts; receive content as parameters or ViewBuilder closures
- **Utilidades**: ViewModifiers, extensions, color/font utilities
- **EntidadesUI**: models used exclusively in the UI layer — separate from domain models
- All CoreUI components must have `#Preview` blocks
- All CoreUI components must accept Spanish-labeled parameters

### Prohibited
- Business logic in any CoreUI component
- Direct API calls from CoreUI
- Feature-specific logic in CoreUI — it must remain generic and reusable
- Navigation logic in CoreUI components (handled by Coordinators)

## 14. Prohibited Patterns

| Pattern | Reason | Alternative |
|---------|--------|-------------|
| `value!` (force unwrap) | Runtime crash on nil | `guard let` / `if let` |
| `as!` (force cast) | Runtime crash on type mismatch | `as?` with guard |
| `try!` | Crash on error | `do-catch` |
| Singletons outside Factory DI | Untestable, hidden dependency | `Container.shared` registration |
| `UserDefaults` for sensitive data | Unencrypted plist | SimpleKeychain / Encrypted Realm |
| Business logic in Views | Violates MVVM | Move to ViewModel |
| Direct navigation from Views | Violates Coordinator pattern | Delegate to Coordinator |
| Multiple responsibilities per class | Violates SRP | Split into focused types |
| Raw strings for keys | Typo-prone, no compiler check | Enums or constants |
| Nested closures deeper than 2 levels | Unreadable | Combine operators / async-await |
| `DispatchQueue.main.async` in ViewModel | Prefer Combine/structured | `.receive(on: DispatchQueue.main)` |
| `Any` / `AnyObject` as parameter types | Loss of type safety | Generics or specific protocols |
| Global mutable state | Race conditions, untestable | Factory scoped dependencies |
| Magic numbers / strings | Unclear intent | Named constants |
| Files longer than 500 lines | Difficult to maintain | Extract types / extensions |
| Functions longer than 40 lines | Too complex | Extract helper methods |
| Cyclomatic complexity > 10 per function | Untestable | Simplify control flow |
| Importing entire modules when unused | Increases compile time | Import only what is needed |
| `@ObservedObject` for owned ViewModels | VM recreated on redraw | `@StateObject` for owners |
| Empty `catch {}` blocks | Silent failures | Log or handle the error |
