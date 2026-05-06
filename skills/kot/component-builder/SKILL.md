---
name: kot-component-builder
description: "Build SDUI components and subcomponents from JSON templates and visual prototypes using the project's Factory Pattern"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Component Builder

## Purpose

Create dynamic UI components and subcomponents for Android from JSON templates and optional visual prototypes, using the project's Server-Driven UI factory architecture (sealed classes + enums + recursive rendering).

## When to Use

- User provides a JSON template with new component types
- User provides a visual prototype to implement as SDUI
- New screen needs dynamic components not yet in the factory
- Existing component needs new properties from updated JSON

## Architecture Reference

The SDUI pipeline:

```
JSON API → DTO (Componente) → TipoComponentes.crearComponente()
        → FabricaComponentes (sealed) → ConstruirComponentes.PintarComponentes()
        → Composable rendered
```

### Key Files

**Core (Models and Enums):**
- `core/.../core_dominio/modelo/contenido/Contenedores.kt` — top-level component enum
- `core/.../core_dominio/modelo/contenido/Anidados.kt` — subcomponent enum

**Core-UI (Factory):**
- `core-ui/.../fabrica/componentes/FabricaComponentes.kt` — sealed class for components
- `core-ui/.../fabrica/componentes/TipoComponentes.kt` — factory dispatch
- `core-ui/.../fabrica/componentes/ConstruirComponentes.kt` — composable renderer
- `core-ui/.../fabrica/subcomponentes/FabricaSubComponentes.kt` — sealed class for subcomponents
- `core-ui/.../fabrica/subcomponentes/TipoSubComponentes.kt` — subcomponent factory
- `core-ui/.../fabrica/subcomponentes/ConstruirSubComponentes.kt` — subcomponent renderer

## Execution Flow — 7 Steps

### Step 1: Analyze JSON and Prototype

1. Read the JSON file provided by user
2. Read the prototype image (if available)
3. Identify all components (`tipo` at `componentes` level)
4. Identify all subcomponents (`tipo` at `subComponente` level)
5. Map properties from each element's `data` object
6. Document hierarchy and nesting relationships

### Step 2: Verify Existence

For each component/subcomponent:

1. Read current enums: `Contenedores.kt` for components, `Anidados.kt` for subcomponents
2. If type EXISTS: check sealed class for property mismatches, update if needed
3. If type DOES NOT EXIST: mark as NEW for creation

### Step 3: Validate Prototype (if image provided)

1. Compare visual design with JSON components
2. Identify visual elements not present in JSON
3. Document discrepancies
4. Suggest JSON adjustments if needed

### Step 4: Generate Component Code (for NEW components)

For each new top-level component, create in order:

**4.1** Add to `Contenedores` enum
**4.2** Add `@Keep` data class in `FabricaComponentes` sealed class
**4.3** Add `when` case in `TipoComponentes.crearComponente()`
**4.4** Add `when` case in `ConstruirComponentes.PintarComponentes()`
**4.5** Create `@Composable` rendering function

### Step 5: Generate Subcomponent Code (for NEW subcomponents)

For each new subcomponent:

**5.1** Add to `Anidados` enum
**5.2** Create `@Keep` data class for the model (if custom properties)
**5.3** Add `@Keep` data class in `FabricaSubComponentes` sealed class
**5.4** Add `when` case in `TipoSubComponentes.crearSubComponente()` using `convertidorObjetoClase<T>()`
**5.5** Add `when` case in `ConstruirSubComponentes.PintarSubComponentes()`
**5.6** Create `@Composable` rendering function

**IMPORTANT**: If the subcomponent can contain children, it MUST include `subComponentes: List<FabricaSubComponentes>` and render them recursively.

### Step 6: Handle Common Properties

Apply consistently across all components:

| Property | Pattern | Default |
|----------|---------|---------|
| Colors | `Color(value.toColorInt())` | `ControladorEstilo.color.*` |
| Margins | `.toIntOrNull()?.dp ?: 0.dp` | `0.dp` |
| Alignment | `"izquierda"/"derecha"/"centro"` → `Alignment.*` | Start |
| Links | `indicadorRedireccion(link, tipo)` | — |
| Metrics | `metricas_evento`, `metricas_pageTitle`, `metricas_step` | — |

Margin properties: `margen`, `margenSuperior`, `margenInferior`, `margenIzquierda`, `margenDerecha`

### Step 7: Final Review

1. Verify all necessary imports
2. Validate component hierarchy
3. Check nullability and default values
4. Present summary to user for compilation and testing

**IMPORTANT**: The user handles compilation. Do NOT run build commands.

## Composable Code Style

### Extract Complex Logic to Local Variables

```kotlin
// ✅ GOOD — descriptive local variables
val modificadorFondo = Modifier.background(
    color = subComponente.colorFondo?.let { Color(it.toColorInt()) } ?: Color.White
)
val modificadorBorde = if (subComponente.borde == "true") {
    Modifier.border(width = 1.dp, color = Color.Gray)
} else { Modifier }

modifier = Modifier.fillMaxWidth().then(modificadorFondo).then(modificadorBorde)
```

```kotlin
// ❌ BAD — inline logic in modifiers
modifier = Modifier.background(color = subComponente.colorFondo?.let { ... } ?: Color.White)
    .then(if (subComponente.borde == "true") { ... } else { Modifier })
```

### Modifier Variable Naming

Use prefix `modificador`: `modificadorFondo`, `modificadorBorde`, `modificadorMargen`

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Enum entries | SCREAMING_SNAKE | `CONTENEDOR_DESPLEGABLE` |
| Sealed classes | PascalCase | `ContenedorDesplegable` |
| Composable functions | `Fabrica` prefix | `FabricaSubComponentesContenedorDesplegable` |
| Model data classes | Descriptive PascalCase | `InformacionContenedorDesplegable` |

## Rules

- **NEVER** overwrite existing code without user confirmation
- **ALWAYS** use `@Keep` on data classes for ProGuard safety
- **ALWAYS** handle nullability correctly (`?` and `?:`)
- **ALWAYS** follow existing code patterns in the project
- **NEVER** run build commands — user compiles
- **ALWAYS** document which files were modified
- **NEVER** create duplicates — verify existence first
- **ALWAYS** use `BLANCO` as fallback for unknown types

## Reference

- See `componentes-existentes.md` for the full list of already-implemented types
- See `flujo-completo-ejemplo.md` for a step-by-step creation example
- See ADR-015 for the architectural decision behind SDUI
