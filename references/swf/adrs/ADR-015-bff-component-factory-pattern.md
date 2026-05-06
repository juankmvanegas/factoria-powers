# ADR-015: Server-Driven UI via BFF Component Factory

## Status
Accepted

## Date
2025-01-15

## Context
The application's home screen and several content screens display dynamic layouts that change frequently based on business requirements, A/B testing, and personalization. Releasing app updates through the App Store for every layout change introduces delays (review process) and version fragmentation. A server-driven UI approach allows the backend (BFF — Backend for Frontend) to define the screen composition, component ordering, and content, while the iOS app renders the components using a local registry of SwiftUI views. This enables rapid iteration on UI layouts without requiring app updates.

## Decision
We adopt a **BFF Component Factory pattern** where the server defines screen layouts as ordered lists of typed components, and the iOS app resolves each component type to a concrete SwiftUI view using `FabricaDeComponentes` and `FabricaDeSubcomponentes`.

### Core Rules

1. **`FabricaDeComponentes`** is the top-level factory that renders a list of server-defined components into SwiftUI views:
   ```swift
   struct FabricaDeComponentes: View {
       let componentes: [ComponenteServidor]
       
       var body: some View {
           LazyVStack(spacing: 0) {
               ForEach(componentes, id: \.id) { componente in
                   resolverComponente(componente)
               }
           }
       }
       
       @ViewBuilder
       private func resolverComponente(_ componente: ComponenteServidor) -> some View {
           switch componente.tipo {
           case .titulado:
               TituladoComponenteView(data: componente.data)
           case .contenedorGrilla:
               ContenedorGrillaView(data: componente.data)
           case .carrusel:
               CarruselComponenteView(data: componente.data)
           case .banner:
               BannerComponenteView(data: componente.data)
           case .encuesta:
               EncuestaComponenteView(data: componente.data)
           default:
               EmptyView()
           }
       }
   }
   ```

2. **`FabricaDeSubcomponentes`** resolves `TipoSubComponente` to concrete SwiftUI views for nested component hierarchies:
   ```swift
   struct FabricaDeSubcomponentes: View {
       let subcomponentes: [SubComponenteServidor]
       
       var body: some View {
           ForEach(subcomponentes, id: \.id) { sub in
               resolverSubcomponente(sub)
           }
       }
       
       @ViewBuilder
       private func resolverSubcomponente(_ sub: SubComponenteServidor) -> some View {
           switch sub.tipo {
           case .tarjeta:
               TarjetaView(data: sub.data)
           case .itemLista:
               ItemListaView(data: sub.data)
           case .botonAccion:
               BotonAccionView(data: sub.data)
           case .separador:
               SeparadorView()
           default:
               EmptyView()
           }
       }
   }
   ```

3. **Server response model** defines the component structure with typed data payloads:
   ```swift
   struct ComponenteServidor: Decodable, Identifiable {
       let id: String
       let tipo: TipoComponente
       let data: [String: AnyCodable]
       let subcomponentes: [SubComponenteServidor]?
       let accion: AccionComponente?
   }
   
   enum TipoComponente: String, Decodable {
       case titulado = "TITULADO"
       case contenedorGrilla = "CONTENEDOR_GRILLA"
       case carrusel = "CARRUSEL"
       case banner = "BANNER"
       case encuesta = "ENCUESTA"
       case seccionInformativa = "SECCION_INFORMATIVA"
   }
   ```

4. **Standard components** available in the local registry:
   - `TituladoComponente` — Section header with title and optional subtitle
   - `ContenedorGrilla` — Grid layout that arranges subcomponents in rows/columns
   - `CarruselComponente` — Horizontal scrolling carousel of cards
   - `BannerComponente` — Full-width promotional banner with image and CTA
   - `SeccionInformativa` — Rich text content section
   - `EncuestaComponente` — Qualtrics survey integration

5. **The backend controls UI layout without app updates.** Adding a new section to the home screen requires only a BFF configuration change. Reordering components changes the `componentes` array order in the response.

6. **Qualtrics integration** for surveys is embedded via the `EncuestaComponente`, which loads a Qualtrics intercept when the component becomes visible:
   ```swift
   struct EncuestaComponenteView: View {
       let data: [String: AnyCodable]
       
       var body: some View {
           QualtricsInterceptView(
               interceptId: data["interceptId"]?.stringValue ?? "",
               projectId: data["projectId"]?.stringValue ?? ""
           )
           .frame(height: data["height"]?.doubleValue ?? 300)
       }
   }
   ```

7. **Unknown component types render as `EmptyView()`** to ensure forward compatibility. The app gracefully ignores components it does not yet support, allowing the backend to deploy new component types ahead of the app release.

8. **Component actions** define navigation or interaction behavior driven by the server:
   ```swift
   struct AccionComponente: Decodable {
       let tipo: TipoAccion
       let destino: String?
       let parametros: [String: AnyCodable]?
   }
   
   enum TipoAccion: String, Decodable {
       case navegarInterno = "NAVEGAR_INTERNO"
       case abrirExterno = "ABRIR_EXTERNO"
       case deepLink = "DEEP_LINK"
   }
   ```

## Consequences

### Positive
- UI layouts can be updated instantly without App Store submissions
- A/B testing of screen compositions is controlled entirely from the backend
- New component types can be added to the app incrementally — unknown types are safely ignored
- Consistent component rendering across screens using the same factory infrastructure
- Qualtrics surveys can be deployed to specific screens dynamically

### Negative
- Increased coupling between the BFF API contract and the iOS component registry — breaking changes in the API require coordinated releases
- Debugging layout issues requires inspecting both the server response and the client rendering
- The `data: [String: AnyCodable]` payload is loosely typed — runtime errors can occur if the server sends unexpected data shapes

### Risks
- **Component type mismatch:** The server sends a component type the app doesn't support, resulting in blank areas. **Mitigation:** `EmptyView()` fallback ensures no crashes. Analytics events are logged for unresolved component types to detect gaps.
- **Data contract drift:** The server changes the data payload structure without coordinating with iOS. **Mitigation:** Each component view validates its required data fields and renders a fallback state if critical fields are missing.
- **Performance degradation:** A screen with many complex components (carousels, grids, surveys) can cause scroll performance issues. **Mitigation:** `LazyVStack` defers rendering of off-screen components. Heavy components (Qualtrics, carousels) use `.onAppear` for lazy initialization.
- **Security concern:** Server-driven actions could be manipulated to navigate to unintended destinations. **Mitigation:** All `AccionComponente` destinations are validated against a whitelist of allowed internal routes and URL schemes before execution.
