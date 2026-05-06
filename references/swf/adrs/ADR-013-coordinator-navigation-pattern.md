# ADR-013: Coordinator Pattern for Navigation

## Status
Accepted

## Date
2025-01-15

## Context
SwiftUI's built-in navigation (NavigationLink, NavigationStack) tightly couples views to their destinations, making it difficult to test navigation logic, compose complex flows, and support deep linking. In a modular MVVM architecture with SPM feature modules, views should not know about other views or modules. A centralized, testable navigation abstraction is needed that decouples view presentation from navigation decisions and supports flow composition across feature boundaries.

## Decision
We adopt the **Coordinator pattern** as the exclusive navigation mechanism for the application. All screen transitions are routed through Coordinators, never initiated directly from Views.

### Core Rules

1. **`CoordinadorProtocol`** defines the base navigation contract that all Coordinators implement:
   ```swift
   protocol CoordinadorProtocol: AnyObject {
       var navigationController: UINavigationController { get }
       func iniciar()
   }
   ```

2. **Each feature module has its own Coordinador** that manages navigation within that feature:
   ```swift
   final class CoordinadorAutenticacion: CoordinadorProtocol {
       var navigationController: UINavigationController
       var hijoCoordinadores: [CoordinadorProtocol] = []
       
       func iniciar() {
           let vista = LoginView(viewModel: LoginViewModel())
           navigationController.pushViewController(
               UIHostingController(rootView: vista), animated: true
           )
       }
       
       func navegarARegistro() {
           let vista = RegistroView(viewModel: RegistroViewModel())
           navigationController.pushViewController(
               UIHostingController(rootView: vista), animated: true
           )
       }
       
       func navegarARecuperarContrasena() {
           let vista = RecuperarContrasenaView(viewModel: RecuperarContrasenaViewModel())
           navigationController.pushViewController(
               UIHostingController(rootView: vista), animated: true
           )
       }
   }
   ```

3. **Navigation is never called directly from Views.** Views communicate user intent to their ViewModel, which delegates to the Coordinator:
   ```swift
   // View
   struct LoginView: View {
       @StateObject var viewModel: LoginViewModel
       
       var body: some View {
           Button("Registrarse") {
               viewModel.irARegistro()
           }
       }
   }
   
   // ViewModel
   @MainActor
   final class LoginViewModel: ObservableObject {
       @Injected(\.coordinadorAutenticacion) private var coordinador
       
       func irARegistro() {
           coordinador.navegarARegistro()
       }
   }
   ```

4. **`NavegacionBase`** serves as the root coordinator that manages the top-level navigation stack and child coordinator lifecycle:
   ```swift
   final class NavegacionBase: CoordinadorProtocol {
       var navigationController: UINavigationController
       var hijoCoordinadores: [CoordinadorProtocol] = []
       
       func iniciar() {
           let coordinadorAuth = CoordinadorAutenticacion(
               navigationController: navigationController
           )
           hijoCoordinadores.append(coordinadorAuth)
           coordinadorAuth.iniciar()
       }
       
       func cambiarAFlujoAutenticado() {
           hijoCoordinadores.removeAll()
           let coordinadorHome = CoordinadorHome(
               navigationController: navigationController
           )
           hijoCoordinadores.append(coordinadorHome)
           coordinadorHome.iniciar()
       }
   }
   ```

5. **Deep linking** is supported by defining a `RutaNavegacion` enum that each Coordinator can resolve:
   ```swift
   enum RutaNavegacion {
       case perfil(id: String)
       case detalle(tipo: String, id: String)
       case configuracion
   }
   
   extension NavegacionBase {
       func manejarDeepLink(_ ruta: RutaNavegacion) {
           switch ruta {
           case .perfil(let id):
               let coordinador = CoordinadorPerfil(navigationController: navigationController)
               hijoCoordinadores.append(coordinador)
               coordinador.mostrarPerfil(id: id)
           // ...
           }
       }
   }
   ```

6. **Flow composition** is achieved by nesting child coordinators. A parent coordinator starts a child flow and receives results via closures or delegate callbacks:
   ```swift
   func iniciarFlujoEdicion(para item: Elemento) {
       let coordinadorEdicion = CoordinadorEdicion(
           navigationController: navigationController,
           item: item
       )
       coordinadorEdicion.alFinalizar = { [weak self] resultado in
           self?.hijoCoordinadores.removeAll { $0 === coordinadorEdicion }
           if case .guardado = resultado {
               self?.recargarDetalle()
           }
       }
       hijoCoordinadores.append(coordinadorEdicion)
       coordinadorEdicion.iniciar()
   }
   ```

7. **Coordinator protocols per feature** expose only the navigation methods that feature needs, enabling test mocking:
   ```swift
   protocol CoordinadorPerfilProtocol: AnyObject {
       func navegarADetalle(id: String)
       func navegarAEdicion()
       func volver()
   }
   ```

## Consequences

### Positive
- Views are completely decoupled from navigation logic — they only know their ViewModel
- Navigation is fully testable via mock Coordinators with Spy pattern (see ADR-011)
- Deep linking is centralized in `NavegacionBase` and routed to the appropriate Coordinator
- Feature modules do not need to know about each other — the Coordinator layer handles cross-module navigation
- Flow composition supports complex multi-step processes (onboarding, checkout, etc.)

### Negative
- Adds an additional layer of abstraction compared to SwiftUI's native NavigationStack
- UIHostingController bridging is required for SwiftUI views within the UIKit navigation stack
- Child coordinator lifecycle management (retain/release) requires careful attention to avoid memory leaks

### Risks
- **Coordinator memory leaks:** Forgetting to remove child coordinators from the `hijoCoordinadores` array causes retain cycles. **Mitigation:** `alFinalizar` closure always removes the child coordinator. Code review checklist includes coordinator lifecycle verification.
- **Over-coordination:** Creating a Coordinator for trivial navigation (e.g., a simple sheet) adds unnecessary complexity. **Mitigation:** Simple modal presentations (alerts, confirmation sheets) can be handled directly by the ViewModel. Coordinators are required only for screen-to-screen navigation.
- **UIKit dependency:** The Coordinator pattern relies on `UINavigationController`, which ties the architecture to UIKit. **Mitigation:** The Coordinator protocols abstract the UIKit dependency; migration to pure SwiftUI navigation would only require changing Coordinator implementations, not ViewModels or Views.
