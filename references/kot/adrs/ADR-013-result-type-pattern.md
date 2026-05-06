# ADR-013: Result Type Pattern

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Error handling in Android applications often relies on exceptions, which can lead to unhandled errors, crashes, and unclear control flow. We need a type-safe approach that makes error handling explicit.

## Decision
Implement a sealed class `Resultado` for representing operation outcomes:

### Result Type Definition

```kotlin
sealed class Resultado<out T>(
    val estado: Estado,
    val datos: T?,
    val mensaje: String?,
    val excepcion: Exception?
) {
    class Correcto<T>(
        estado: Estado = Estado.CORRECTO,
        datos: T?
    ) : Resultado<T>(estado, datos, null, null)
    
    class Error<T>(
        estado: Estado = Estado.ERROR,
        mensaje: String,
        datos: T? = null,
        excepcion: Exception? = null
    ) : Resultado<T>(estado, datos, mensaje, excepcion)
    
    class Cargando<T>(
        estado: Estado = Estado.CARGANDO,
        carga: Boolean = true
    ) : Resultado<T>(estado, null, null, null)
}

enum class Estado {
    CORRECTO,
    CARGANDO,
    ERROR
}
```

### Usage in Repository

```kotlin
override fun obtenerNotas(): Flow<Resultado<List<Nota>>> = flow {
    emit(Resultado.Cargando())
    
    try {
        val notasLocales = fuenteLocal.obtenerNotas()
        
        if (notasLocales.isNotEmpty()) {
            emit(Resultado.Correcto(datos = notasLocales.map { it.toDomain() }))
        } else {
            // Try remote
            val notasRemotas = fuenteRemota.obtenerNotas()
            fuenteLocal.guardarNotas(notasRemotas)
            emit(Resultado.Correcto(datos = notasRemotas.map { it.toDomain() }))
        }
    } catch (e: IOException) {
        emit(Resultado.Error(
            mensaje = "Error de conexión",
            excepcion = e
        ))
    } catch (e: HttpException) {
        emit(Resultado.Error(
            mensaje = "Error del servidor: ${e.code()}",
            excepcion = e
        ))
    } catch (e: Exception) {
        emit(Resultado.Error(
            mensaje = e.message ?: "Error desconocido",
            excepcion = e
        ))
    }
}.flowOn(despachadorIo)
```

### Usage in ViewModel

```kotlin
@HiltViewModel
class NotasViewModel @Inject constructor(
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso
) : ViewModel() {
    
    private val _estadoUi = MutableStateFlow<NotasEstadoUi>(NotasEstadoUi.Cargando)
    val estadoUi: StateFlow<NotasEstadoUi> = _estadoUi.asStateFlow()
    
    fun cargarNotas() {
        viewModelScope.launch {
            obtenerNotasCasoUso().collect { resultado ->
                _estadoUi.value = when (resultado) {
                    is Resultado.Cargando -> NotasEstadoUi.Cargando
                    
                    is Resultado.Correcto -> NotasEstadoUi.Correcto(
                        notas = resultado.datos ?: emptyList()
                    )
                    
                    is Resultado.Error -> NotasEstadoUi.Error(
                        mensaje = resultado.mensaje ?: "Error",
                        reintentable = resultado.excepcion is IOException
                    )
                }
            }
        }
    }
}
```

### Extension Functions

```kotlin
// Map success data
fun <T, R> Resultado<T>.map(transform: (T) -> R): Resultado<R> = when (this) {
    is Resultado.Correcto -> Resultado.Correcto(datos = datos?.let(transform))
    is Resultado.Error -> Resultado.Error(mensaje = mensaje ?: "", excepcion = excepcion)
    is Resultado.Cargando -> Resultado.Cargando()
}

// Handle success
inline fun <T> Resultado<T>.onCorrecto(action: (T) -> Unit): Resultado<T> {
    if (this is Resultado.Correcto) {
        datos?.let(action)
    }
    return this
}

// Handle error
inline fun <T> Resultado<T>.onError(action: (String, Exception?) -> Unit): Resultado<T> {
    if (this is Resultado.Error) {
        action(mensaje ?: "Error", excepcion)
    }
    return this
}

// Get data or default
fun <T> Resultado<T>.obtenerOPredeterminado(default: T): T = when (this) {
    is Resultado.Correcto -> datos ?: default
    else -> default
}

// Fold
inline fun <T, R> Resultado<T>.fold(
    onCorrecto: (T?) -> R,
    onError: (String, Exception?) -> R,
    onCargando: () -> R
): R = when (this) {
    is Resultado.Correcto -> onCorrecto(datos)
    is Resultado.Error -> onError(mensaje ?: "Error", excepcion)
    is Resultado.Cargando -> onCargando()
}
```

### Usage with Extensions

```kotlin
viewModelScope.launch {
    obtenerNotasCasoUso()
        .onCorrecto { notas ->
            _estadoUi.value = NotasEstadoUi.Correcto(notas)
        }
        .onError { mensaje, excepcion ->
            _estadoUi.value = NotasEstadoUi.Error(mensaje)
            crashlytics.reportarExcepcion(excepcion, mensaje)
        }
}

// Or with fold
val mensaje = resultado.fold(
    onCorrecto = { "Cargadas ${it?.size ?: 0} notas" },
    onError = { msg, _ -> "Error: $msg" },
    onCargando = { "Cargando..." }
)
```

### Network Response Wrapper

```kotlin
suspend fun <T> safeApiCall(
    apiCall: suspend () -> T
): Resultado<T> {
    return try {
        Resultado.Correcto(datos = apiCall())
    } catch (e: HttpException) {
        Resultado.Error(
            mensaje = "Error HTTP ${e.code()}: ${e.message()}",
            excepcion = e
        )
    } catch (e: IOException) {
        Resultado.Error(
            mensaje = "Error de red: sin conexión",
            excepcion = e
        )
    } catch (e: Exception) {
        Resultado.Error(
            mensaje = e.message ?: "Error desconocido",
            excepcion = e
        )
    }
}

// Usage
override suspend fun obtenerNotasRemotas(): Resultado<List<NotaDto>> {
    return safeApiCall { apiService.obtenerNotas() }
}
```

## Consequences

- Error handling is explicit and type-safe
- No unchecked exceptions propagating
- Loading state built into the type
- Logging/reporting centralized
- Consistent error handling across codebase
- Extension functions reduce boilerplate
- UI state mapping is straightforward
- Crashes from unhandled exceptions eliminated
