---
name: kot-compose-optimization
description: "Detect and fix Jetpack Compose recomposition issues and performance problems"
allowed-tools: Read, Grep, Glob, Write, Edit
user-invocable: true
---

# Skill: Compose Optimization

## Purpose

Evaluate Composable functions to improve rendering performance, reduce unnecessary recompositions, and ensure maintainability.

## When to Use

- UI feels slow or janky
- Debugging recomposition issues
- Reviewing Compose code
- Optimizing complex screens

## Execution Flow — 6 Steps

### Step 1: Identify Composables

Locate all Composable functions:
```kotlin
@Composable
fun [Name]Pantalla(...)
@Composable
fun [Name]Componente(...)
```

### Step 2: Check State Stability

Analyze parameter stability:

✅ **Stable parameters:**
```kotlin
@Composable
fun TarjetaNota(
    titulo: String,           // Primitive - stable
    onClick: () -> Unit,      // Lambda - check stability
    modifier: Modifier = Modifier
)
```

❌ **Unstable parameters:**
```kotlin
@Composable
fun ListaNotas(
    notas: List<Nota>  // List is unstable without @Stable or @Immutable
)
```

**Fix with stable collections:**
```kotlin
@Composable
fun ListaNotas(
    notas: ImmutableList<Nota>  // Use kotlinx.collections.immutable
)
```

### Step 3: Check Lambda Stability

Analyze lambda parameters:

❌ **Unstable (new lambda each recomposition):**
```kotlin
Button(onClick = { viewModel.guardar() })  // New lambda each time
```

✅ **Stable (remembered lambda):**
```kotlin
val guardarClick = remember { { viewModel.guardar() } }
Button(onClick = guardarClick)

// Or using method reference
Button(onClick = viewModel::guardar)
```

### Step 4: Check remember Usage

Verify computed values are remembered:

✅ **Correct:**
```kotlin
val notasOrdenadas = remember(notas) {
    notas.sortedBy { it.fecha }
}

val conteo by remember {
    derivedStateOf { notas.size }
}
```

❌ **Problematic:**
```kotlin
// Computed on every recomposition
val notasOrdenadas = notas.sortedBy { it.fecha }

// State read outside derivedStateOf
val conteo = notas.size
```

### Step 5: Check Composable Structure

Analyze composable organization:

✅ **Correct (stateless):**
```kotlin
@Composable
fun TarjetaNota(
    nota: Nota,
    onClic: () -> Unit,
    modifier: Modifier = Modifier
) {
    // No state management here - pure UI
    Card(modifier = modifier.clickable(onClick = onClic)) {
        Text(nota.titulo)
    }
}
```

❌ **Problematic (stateful in reusable component):**
```kotlin
@Composable
fun TarjetaNota(nota: Nota) {
    var expandida by remember { mutableStateOf(false) }  // State in reusable!
    // Should hoist state
}
```

**Fix with state hoisting:**
```kotlin
@Composable
fun TarjetaNota(
    nota: Nota,
    expandida: Boolean,
    onExpandirCambio: (Boolean) -> Unit
) {
    // State hoisted to parent
}
```

### Step 6: Generate Optimization Report

```markdown
## Compose Optimization Report

### Recomposition Issues

| Composable | Issue | Severity | Fix |
|------------|-------|----------|-----|
| `ListaNotas` | Unstable List param | High | Use ImmutableList |
| `BotonGuardar` | New lambda each time | Medium | Remember lambda |

### Memory Issues

| Composable | Issue | Fix |
|------------|-------|-----|
| `PantallaPrincipal` | Large computation in body | Add remember |

### State Hoisting Issues

| Composable | Issue | Fix |
|------------|-------|-----|
| `TarjetaNota` | Internal mutableState | Hoist to parent |

### Recommendations

1. [Specific refactoring suggestion]
2. [Specific refactoring suggestion]
```

## Auto-Shielding

Before optimization:
- Verify Compose is set up correctly
- Check for Layout Inspector availability
- Review existing @Stable/@Immutable annotations

## Common Fixes

### Add @Stable for data classes
```kotlin
@Stable
data class Nota(
    val id: Long,
    val titulo: String
)
```

### Use remember for expensive operations
```kotlin
val resultado = remember(entrada) {
    operacionCostosa(entrada)
}
```

### Use derivedStateOf for derived values
```kotlin
val mostrarBoton by remember {
    derivedStateOf { texto.isNotEmpty() }
}
```

## Rules

- **Prefer stateless composables** — hoist state
- **Remember expensive computations**
- **Use stable types for parameters**
- **Lambda stability matters** — remember or method reference
- **derivedStateOf for derived values** — reduces recompositions
- **Check with Layout Inspector** — verify visually
