# ADR-015: Server-Driven UI with Component Factory Pattern

## Status

Accepted

## Date

2026-04-20

## Context

The mobile application needs to render dynamic screens whose structure is defined by the backend via JSON responses. This enables rapid UI changes without requiring app releases. The existing app uses a Factory Pattern with sealed classes, enums for component types, and recursive rendering via Jetpack Compose.

Key architectural needs:
- Backend defines screen structure via JSON (`componentes` → `subComponente` → recursive nesting)
- App must map JSON types to strongly-typed Kotlin sealed classes
- New component types must be addable without modifying core rendering logic
- Components can nest infinitely (recursive subcomponents)
- ProGuard/R8 must not strip data classes used for JSON deserialization

## Decision

Adopt a **Server-Driven UI (SDUI)** architecture with a **Component Factory Pattern** based on sealed classes:

### JSON → DTO → Factory → Compose Pipeline

```
JSON API → DTO (Componente) → TipoComponentes.crearComponente()
        → FabricaComponentes (sealed) → ConstruirComponentes.PintarComponentes()
        → Composable rendered
```

### Component Registry

- **Top-level components**: Registered in `Contenedores` enum → mapped in `FabricaComponentes` sealed class
- **Nested subcomponents**: Registered in `Anidados` enum → mapped in `FabricaSubComponentes` sealed class
- **Factory dispatch**: `TipoComponentes.crearComponente()` and `TipoSubComponentes.crearSubComponente()` use `when` on the enum
- **Rendering**: `ConstruirComponentes.PintarComponentes()` and `ConstruirSubComponentes.PintarSubComponentes()` dispatch to `@Composable` functions

### Key Files

| File | Purpose |
|------|---------|
| `Contenedores.kt` | Enum of top-level component types |
| `Anidados.kt` | Enum of subcomponent types |
| `FabricaComponentes.kt` | Sealed class with data classes per component |
| `FabricaSubComponentes.kt` | Sealed class with data classes per subcomponent |
| `TipoComponentes.kt` | Factory — maps DTO to sealed class instances |
| `TipoSubComponentes.kt` | Factory — maps DTO to sealed subcomponent instances |
| `ConstruirComponentes.kt` | Composable renderer for components |
| `ConstruirSubComponentes.kt` | Composable renderer for subcomponents |

### Rules

1. All data classes in the factory MUST use `@Keep` and `@Serializable` for ProGuard safety
2. Subcomponents that can contain children MUST include `subComponentes: List<FabricaSubComponentes>`
3. Unknown types fall back to `Blanco` (empty component) — never crash
4. JSON deserialization uses `convertidorObjetoClase<T>()` extension for `Map<String,String>` → typed data class
5. Common properties (colors, margins, alignment) follow standard naming: `colorContenedor`, `margen`, `margenSuperior`, etc.
6. Colors are hex strings parsed with `Color(value.toColorInt())`
7. Composable rendering functions follow naming: `FabricaComponentes{Name}` / `FabricaSubComponentes{Name}`

## Consequences

### Positive
- Backend can ship new screens without app update
- Adding a new component type requires only 4-5 file changes (enum + sealed class + factory case + composable)
- Recursive nesting enables complex layouts
- Type safety via sealed classes — compiler verifies exhaustive `when` handling
- Fallback to `Blanco` prevents crashes on unknown component types

### Negative
- Adding components requires changes across multiple files (enum, sealed class, factory, renderer)
- JSON structure must be well-documented — mismatches cause silent fallback to `Blanco`
- Complex components may need custom state management (e.g., `CONTENEDOR_DESPLEGABLE` with expand/collapse)
- ProGuard misconfiguration can break JSON deserialization at runtime

### Mitigations
- Use the `component-builder` skill to automate component creation across all files
- Maintain `componentes-existentes.md` as reference of available types
- Always test with `assembleRelease` to catch ProGuard issues early
