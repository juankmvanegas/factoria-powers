---
name: kot-analyze-viewmodels
description: "Analyze ViewModels, Coroutines, and Flow usage for state management quality"
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Skill: Analyze ViewModels

## Purpose

Analyze ViewModels that use Coroutines and Flow, evaluating state management, concurrency patterns, and UI exposure.

## When to Use

- Reviewing ViewModel implementations
- Debugging state management issues
- Refactoring LiveData to StateFlow
- Optimizing Flow collection patterns

## Execution Flow — 5 Steps

### Step 1: Identify ViewModels

Locate all ViewModels in the project:
```kotlin
// Look for classes ending in ViewModel or annotated with @HiltViewModel
@HiltViewModel
class [Name]ViewModel @Inject constructor(...)
```

### Step 2: Analyze State Exposure

Check each ViewModel for:

✅ **Correct patterns:**
```kotlin
// Private mutable, public immutable
private val _estadoUi = MutableStateFlow<EstadoUi>(EstadoUi.Inicial)
val estadoUi: StateFlow<EstadoUi> = _estadoUi.asStateFlow()

// SharedFlow for events
private val _eventos = MutableSharedFlow<EventoUi>()
val eventos: SharedFlow<EventoUi> = _eventos.asSharedFlow()
```

❌ **Problematic patterns:**
```kotlin
// Exposing mutable state
val estadoUi = MutableStateFlow<EstadoUi>(...)  // Bad!

// Using LiveData instead of Flow
private val _estado = MutableLiveData<Estado>()  // Should migrate

// Public mutable state
var estado by mutableStateOf(...)  // Only for simple compose state
```

### Step 3: Analyze Coroutine Usage

Check coroutine scope usage:

✅ **Correct:**
```kotlin
viewModelScope.launch {
    // Operations tied to ViewModel lifecycle
}
```

❌ **Problematic:**
```kotlin
GlobalScope.launch { ... }  // Memory leak risk!

CoroutineScope(Dispatchers.IO).launch { ... }  // Unmanaged scope!

runBlocking { ... }  // Blocks thread!
```

### Step 4: Analyze Flow Collection

Check Flow collection patterns:

✅ **Correct in Composable:**
```kotlin
val estado by viewModel.estadoUi.collectAsStateWithLifecycle()
```

❌ **Problematic:**
```kotlin
// Not lifecycle-aware
val estado by viewModel.estadoUi.collectAsState()

// Collecting in wrong scope
LaunchedEffect(Unit) {
    viewModel.estadoUi.collect { ... }  // Should use collectAsStateWithLifecycle
}
```

### Step 5: Generate Report

Output diagnosis with:

```markdown
## ViewModel Analysis Report

### [ViewModel Name]

**State Management**
- [ ] Uses StateFlow for state ✅/❌
- [ ] Uses SharedFlow for events ✅/❌
- [ ] No exposed mutable state ✅/❌
- [ ] Sealed class for UI state ✅/❌

**Coroutine Usage**
- [ ] Uses viewModelScope ✅/❌
- [ ] No GlobalScope ✅/❌
- [ ] Proper dispatcher injection ✅/❌

**Issues Found**
1. [Issue description]
2. [Issue description]

**Recommendations**
1. [Refactoring suggestion]
2. [Refactoring suggestion]
```

## State/Event Sealed Class Patterns

### UI State — sealed interface (recommended)

```kotlin
sealed interface ComprasEstadoUi {
    object Cargando : ComprasEstadoUi
    data class Correcto(val datos: List<Compra>) : ComprasEstadoUi
    data class Error(val mensaje: String) : ComprasEstadoUi
}
```

### UI Events — sealed class (one-shot)

```kotlin
sealed class ComprasEvento {
    data class Navegar(val ruta: String) : ComprasEvento()
    data class MostrarMensaje(val texto: String) : ComprasEvento()
    object CerrarPantalla : ComprasEvento()
}
```

### ViewModel State + Event Pattern

```kotlin
@HiltViewModel
class ComprasViewModel @Inject constructor(
    private val casoUso: ModuloComprasCasoUso,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    // State — survives recomposition
    private val _estadoUi = MutableStateFlow<ComprasEstadoUi>(ComprasEstadoUi.Cargando)
    val estadoUi: StateFlow<ComprasEstadoUi> = _estadoUi.asStateFlow()

    // Events — one-shot, do not survive recomposition
    private val _eventos = MutableSharedFlow<ComprasEvento>(replay = 0)
    val eventos: SharedFlow<ComprasEvento> = _eventos.asSharedFlow()

    fun cargarDatos() {
        viewModelScope.launch {
            casoUso.obtenerComprasCasoUso().collect { resultado ->
                _estadoUi.value = when (resultado) {
                    is Resultado.Correcto -> ComprasEstadoUi.Correcto(resultado.datos)
                    is Resultado.Error -> ComprasEstadoUi.Error(resultado.mensaje)
                }
            }
        }
    }

    fun guardar() {
        viewModelScope.launch {
            val resultado = casoUso.crearCompraCasoUso(datos)
            if (resultado is Resultado.Correcto) {
                _eventos.emit(ComprasEvento.Navegar("detalle/${resultado.datos}"))
            }
        }
    }
}
```

### Collecting State in Compose

```kotlin
@Composable
fun ComprasPantalla(viewModel: ComprasViewModel = hiltViewModel()) {
    val estado by viewModel.estadoUi.collectAsStateWithLifecycle()

    // One-shot events
    LaunchedEffect(Unit) {
        viewModel.eventos.collect { evento ->
            when (evento) {
                is ComprasEvento.Navegar -> navController.navigate(evento.ruta)
                is ComprasEvento.MostrarMensaje -> snackbarHostState.showSnackbar(evento.texto)
                ComprasEvento.CerrarPantalla -> navController.popBackStack()
            }
        }
    }

    when (estado) {
        ComprasEstadoUi.Cargando -> CircularProgressIndicator()
        is ComprasEstadoUi.Correcto -> ListaCompras((estado as ComprasEstadoUi.Correcto).datos)
        is ComprasEstadoUi.Error -> TextoError((estado as ComprasEstadoUi.Error).mensaje)
    }
}
```

## Network Layer Analysis (Retrofit)

When analyzing ViewModels, also check:
- **Endpoint validation**: correct HTTP methods and paths
- **DTO vs Domain separation**: DTOs never reach UI
- **Interceptor usage**: proper header injection and token management
- **Error classification**: centralized error handling via `ClasificacionError`

## Auto-Shielding

Before analysis:
- Verify project uses Coroutines + Flow
- Check for existing testing setup
- Identify Compose vs View-based UI

## Rules

- **NEVER modify code without approval** — analysis only
- **Always recommend StateFlow over LiveData**
- **Flag GlobalScope usage as critical**
- **Suggest sealed interface for UI states** (preferred over sealed class)
- **Suggest sealed class for UI events** (one-shot)
- **Check dispatcher injection** — no hardcoded Dispatchers
- **Verify SavedStateHandle usage** in ViewModels for process death survival
- **Check Flow collection** — must use `collectAsStateWithLifecycle` in Compose
