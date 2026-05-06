# ADR-010: StateFlow and SharedFlow for UI State

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
UI state management in Android requires a reactive approach that handles configuration changes, lifecycle events, and efficient updates. We need to standardize on Kotlin Flow-based state management.

## Decision
Use StateFlow for UI state and SharedFlow for one-time events:

### StateFlow for UI State

```kotlin
@HiltViewModel
class NotasViewModel @Inject constructor(
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso
) : ViewModel() {
    
    // Private mutable StateFlow
    private val _estadoUi = MutableStateFlow<NotasEstadoUi>(NotasEstadoUi.Cargando)
    
    // Public read-only StateFlow
    val estadoUi: StateFlow<NotasEstadoUi> = _estadoUi.asStateFlow()
    
    // Update state
    fun cargarNotas() {
        viewModelScope.launch {
            _estadoUi.value = NotasEstadoUi.Cargando
            obtenerNotasCasoUso().collect { resultado ->
                _estadoUi.value = when (resultado) {
                    is Resultado.Correcto -> NotasEstadoUi.Correcto(resultado.datos ?: emptyList())
                    is Resultado.Error -> NotasEstadoUi.Error(resultado.mensaje ?: "Error")
                    is Resultado.Cargando -> NotasEstadoUi.Cargando
                }
            }
        }
    }
}
```

### SharedFlow for One-Time Events

```kotlin
@HiltViewModel
class NotasViewModel @Inject constructor() : ViewModel() {
    
    // One-time events (navigation, snackbars, dialogs)
    private val _eventos = MutableSharedFlow<EventoUi>()
    val eventos: SharedFlow<EventoUi> = _eventos.asSharedFlow()
    
    fun onNotaGuardada() {
        viewModelScope.launch {
            _eventos.emit(EventoUi.MostrarSnackbar("Nota guardada"))
            _eventos.emit(EventoUi.Navegar(Pantalla.ListaNotas))
        }
    }
}

// Event types
sealed class EventoUi {
    data class MostrarSnackbar(val mensaje: String) : EventoUi()
    data class Navegar(val pantalla: Pantalla) : EventoUi()
    object CerrarPantalla : EventoUi()
}
```

### Sealed Class for UI State

```kotlin
sealed class NotasEstadoUi {
    object Cargando : NotasEstadoUi()
    
    data class Correcto(
        val notas: List<Nota>,
        val filtro: FiltroNotas = FiltroNotas.TODAS
    ) : NotasEstadoUi()
    
    data class Error(
        val mensaje: String,
        val reintentable: Boolean = true
    ) : NotasEstadoUi()
}

// Complex state with multiple fields
data class FormularioNotaEstadoUi(
    val titulo: String = "",
    val contenido: String = "",
    val tituloError: String? = null,
    val guardando: Boolean = false,
    val notaGuardada: Boolean = false
)
```

### Collection in Composable

```kotlin
@Composable
fun NotasControladorPantalla(
    viewModel: NotasViewModel = hiltViewModel()
) {
    // StateFlow - lifecycle-aware collection
    val estado by viewModel.estadoUi.collectAsStateWithLifecycle()
    
    // SharedFlow - events
    val contexto = LocalContext.current
    LaunchedEffect(Unit) {
        viewModel.eventos.collect { evento ->
            when (evento) {
                is EventoUi.MostrarSnackbar -> {
                    // Show snackbar
                }
                is EventoUi.Navegar -> {
                    // Navigate
                }
                EventoUi.CerrarPantalla -> {
                    // Close
                }
            }
        }
    }
    
    // Render UI based on state
    when (val estadoActual = estado) {
        is NotasEstadoUi.Cargando -> IndicadorCarga()
        is NotasEstadoUi.Correcto -> ListaNotas(estadoActual.notas)
        is NotasEstadoUi.Error -> PantallaError(estadoActual.mensaje)
    }
}
```

### Combined State with stateIn

```kotlin
@HiltViewModel
class BusquedaViewModel @Inject constructor(
    private val buscarNotasCasoUso: BuscarNotasCasoUso
) : ViewModel() {
    
    private val _consulta = MutableStateFlow("")
    val consulta: StateFlow<String> = _consulta.asStateFlow()
    
    val resultados: StateFlow<List<Nota>> = _consulta
        .debounce(300)
        .filter { it.length >= 2 }
        .flatMapLatest { buscarNotasCasoUso(it) }
        .map { resultado ->
            when (resultado) {
                is Resultado.Correcto -> resultado.datos ?: emptyList()
                else -> emptyList()
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
    
    fun onConsultaCambiada(nuevaConsulta: String) {
        _consulta.value = nuevaConsulta
    }
}
```

### Derived State

```kotlin
@HiltViewModel
class ListaViewModel @Inject constructor() : ViewModel() {
    
    private val _items = MutableStateFlow<List<Item>>(emptyList())
    private val _filtro = MutableStateFlow(Filtro.TODOS)
    
    // Derived state combining multiple flows
    val itemsFiltrados: StateFlow<List<Item>> = combine(
        _items,
        _filtro
    ) { items, filtro ->
        when (filtro) {
            Filtro.TODOS -> items
            Filtro.ACTIVOS -> items.filter { it.activo }
            Filtro.COMPLETADOS -> items.filter { !it.activo }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )
}
```

## Consequences

- StateFlow survives configuration changes automatically
- UI always has current state (no null checks)
- One-time events not replayed on configuration change
- `collectAsStateWithLifecycle` stops collection when UI not visible
- `WhileSubscribed(5000)` keeps state hot for 5 seconds after last subscriber
- Testing with Turbine for Flow assertions
- No LiveData usage - pure Kotlin Flow solution
